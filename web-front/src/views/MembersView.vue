<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  createMemberApi,
  deleteMemberApi,
  fetchMembersApi,
  updateMemberApi,
} from '@/api/users'
import PasswordField from '@/components/PasswordField.vue'
import { useAuth } from '@/composables/useAuth'
import type { MemberItem } from '@/types/user'

const { profile } = useAuth()
const list = ref<MemberItem[]>([])
const loading = ref(false)
const error = ref('')
const editingId = ref<number | null>(null)

const createForm = reactive({
  username: '',
  displayName: '',
  password: '',
})

const editForm = reactive({
  displayName: '',
  password: '',
})

async function reload() {
  loading.value = true
  error.value = ''
  try {
    const res = (await fetchMembersApi()) as { data: MemberItem[] }
    list.value = res.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function onCreate() {
  error.value = ''
  try {
    await createMemberApi({
      username: createForm.username,
      password: createForm.password,
      displayName: createForm.displayName || undefined,
    })
    createForm.username = ''
    createForm.displayName = ''
    createForm.password = ''
    await reload()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '添加失败'
  }
}

function startEdit(row: MemberItem) {
  editingId.value = row.id
  editForm.displayName = row.displayName
  editForm.password = ''
}

async function onSave() {
  if (editingId.value == null) {
    return
  }
  error.value = ''
  try {
    const payload: { displayName: string; password?: string } = {
      displayName: editForm.displayName,
    }
    if (editForm.password) {
      payload.password = editForm.password
    }
    await updateMemberApi(editingId.value, payload)
    editingId.value = null
    await reload()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '保存失败'
  }
}

async function onDelete(row: MemberItem) {
  if (!window.confirm(`确定删除成员「${row.username}」吗？`)) {
    return
  }
  error.value = ''
  try {
    await deleteMemberApi(row.id)
    await reload()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '删除失败'
  }
}

function roleLabel(role: string) {
  return role === 'admin' ? '系统管理员' : '普通成员'
}

onMounted(reload)
</script>

<template>
  <section class="members">
    <p v-if="error" class="form-error">{{ error }}</p>

    <form class="members__create contact-form" @submit.prevent="onCreate">
      <h3>添加成员</h3>
      <label for="m-username">用户名</label>
      <input id="m-username" v-model="createForm.username" required minlength="3" />
      <label for="m-display">显示名</label>
      <input id="m-display" v-model="createForm.displayName" />
      <label for="m-password">初始密码</label>
      <PasswordField
        id="m-password"
        v-model="createForm.password"
        autocomplete="new-password"
        :minlength="6"
      />
      <button class="btn btn--primary" type="submit">添加到名单</button>
    </form>

    <div class="members__table-wrap">
      <p v-if="loading">加载中…</p>
      <table v-else class="members__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>显示名</th>
            <th>角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in list" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.username }}</td>
            <td>
              <template v-if="editingId === row.id">
                <input v-model="editForm.displayName" />
                <PasswordField
                  id="edit-password"
                  v-model="editForm.password"
                  autocomplete="new-password"
                  :required="false"
                  :minlength="6"
                />
              </template>
              <template v-else>{{ row.displayName }}</template>
            </td>
            <td>{{ roleLabel(row.role) }}</td>
            <td>
              <template v-if="editingId === row.id">
                <button class="btn btn--primary btn--small" type="button" @click="onSave">保存</button>
                <button class="btn btn--ghost btn--small" type="button" @click="editingId = null">取消</button>
              </template>
              <template v-else>
                <button class="btn btn--ghost btn--small" type="button" @click="startEdit(row)">编辑</button>
                <button
                  v-if="row.role !== 'admin' && row.id !== profile?.id"
                  class="btn btn--ghost btn--small"
                  type="button"
                  @click="onDelete(row)"
                >
                  删除
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
