<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { deleteInquiryApi, fetchInquiriesApi } from '@/api/inquiry'
import type { InquiryItem } from '@/types/inquiry'

const list = ref<InquiryItem[]>([])
const loading = ref(false)
const error = ref('')

async function reload() {
  loading.value = true
  error.value = ''
  try {
    const res = (await fetchInquiriesApi()) as { data: InquiryItem[] }
    list.value = res.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function onDelete(row: InquiryItem) {
  if (!window.confirm(`确定删除「${row.name}」的留言吗？`)) {
    return
  }
  try {
    await deleteInquiryApi(row.id)
    await reload()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '删除失败'
  }
}

function formatTime(value: string) {
  if (!value) {
    return ''
  }
  return String(value).replace('T', ' ').slice(0, 19)
}

onMounted(reload)
</script>

<template>
  <section class="inquiries">
    <p class="inquiries__lead">官网「联系我们」提交的内容会写入 inquiries 表，仅系统管理员可见。</p>
    <p v-if="error" class="form-error">{{ error }}</p>
    <p v-if="loading">加载中…</p>
    <div v-else class="members__table-wrap">
      <table class="members__table">
        <thead>
          <tr>
            <th>时间</th>
            <th>姓名</th>
            <th>公司</th>
            <th>留言</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!list.length">
            <td colspan="5">暂无留言</td>
          </tr>
          <tr v-for="row in list" :key="row.id">
            <td>{{ formatTime(row.createdAt) }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.company || '—' }}</td>
            <td class="inquiries__msg">{{ row.message }}</td>
            <td>
              <button class="btn btn--ghost btn--small" type="button" @click="onDelete(row)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
