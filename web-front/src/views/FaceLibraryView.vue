<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  allAttendanceApi,
  enrollFaceForUserApi,
  faceLibraryApi,
  removeFaceApi,
} from '@/api/face'
import CameraCapture from '@/components/CameraCapture.vue'
import { useFaceScan } from '@/composables/useFaceScan'
import { formatBeijingTime } from '@/utils/time'
import type { AttendanceItem, FaceLibraryItem } from '@/types/face'

const list = ref<FaceLibraryItem[]>([])
const records = ref<AttendanceItem[]>([])
const userId = ref<number | null>(null)
const loading = ref(false)
const {
  camera,
  scanning,
  remain,
  preview,
  pending,
  error,
  message,
  scan,
  setPreview,
} = useFaceScan()
void camera

const hint = computed(() => {
  if (scanning.value) {
    return `请将面部放入中间框内 · 剩余 ${remain.value} 秒`
  }
  if (preview.value) {
    return '检测完成，摄像头已关闭'
  }
  return '选择成员后打开摄像头，将面部放入椭圆框'
})

function personName(row: { displayName?: string; username: string }) {
  return row.displayName || row.username
}

async function reload() {
  const lib = (await faceLibraryApi()) as { data: FaceLibraryItem[] }
  list.value = lib.data
  if (userId.value == null && lib.data[0]) {
    userId.value = lib.data[0].id
  }
  const att = (await allAttendanceApi()) as { data: AttendanceItem[] }
  records.value = att.data
}

async function openCamera() {
  await scan()
}

async function enroll() {
  if (userId.value == null) {
    error.value = '请选择成员'
    return
  }
  if (!pending.value) {
    error.value = '请先打开摄像头并完成人脸检测'
    return
  }
  loading.value = true
  error.value = ''
  message.value = ''
  try {
    const res = (await enrollFaceForUserApi(userId.value, pending.value)) as unknown as {
      message: string
      data: { image?: string }
    }
    if (res.data.image) {
      setPreview(res.data.image)
    }
    message.value = res.message
    await reload()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '录入失败'
  } finally {
    loading.value = false
  }
}

async function remove(row: FaceLibraryItem) {
  if (!window.confirm(`确定删除「${personName(row)}」的人脸吗？`)) {
    return
  }
  try {
    await removeFaceApi(row.id)
    await reload()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '删除失败'
  }
}

onMounted(async () => {
  try {
    await reload()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
  }
})
</script>

<template>
  <section class="face-page">
    <div class="face-card">
      <div class="face-card__head">
        <div>
          <h2>人脸库</h2>
          <p>为成员录入人脸。打开摄像头检测到人脸后会自动关闭。</p>
        </div>
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
      <p v-if="message" class="form-ok">{{ message }}</p>

      <label class="face-page__label" for="face-user">选择成员</label>
      <select id="face-user" v-model.number="userId" class="face-page__select">
        <option v-for="row in list" :key="row.id" :value="row.id">
          {{ personName(row) }}（{{ row.enrolled ? '已录入' : '未录入' }}）
        </option>
      </select>

      <div class="face-stage">
        <CameraCapture ref="camera" :active="scanning" :hint="hint" />
        <div v-if="preview && !scanning" class="face-result">
          <img :src="preview" alt="检测结果" />
        </div>
      </div>

      <div class="face-page__actions">
        <button class="btn btn--primary" type="button" :disabled="scanning || loading" @click="openCamera">
          {{ scanning ? `检测中 ${remain}s` : '打开摄像头' }}
        </button>
        <button class="btn btn--ghost" type="button" :disabled="scanning || loading" @click="enroll">
          {{ loading ? '写入中…' : '写入人脸库' }}
        </button>
      </div>
    </div>

    <div class="face-card">
      <h3>已录入成员</h3>
      <div class="members__table-wrap">
        <table class="members__table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>状态</th>
              <th>录入时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td>{{ personName(row) }}</td>
              <td>{{ row.enrolled ? '已录入' : '未录入' }}</td>
              <td>{{ formatBeijingTime(row.enrolledAt) }}</td>
              <td>
                <button
                  v-if="row.enrolled"
                  class="btn btn--ghost btn--small"
                  type="button"
                  @click="remove(row)"
                >
                  删除
                </button>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="face-card">
      <h3>全部打卡记录</h3>
      <div class="members__table-wrap">
        <table class="members__table">
          <thead>
            <tr>
              <th>打卡人</th>
              <th>结果</th>
              <th>时间</th>
              <th>相似度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!records.length">
              <td colspan="4">暂无记录</td>
            </tr>
            <tr v-for="row in records" :key="row.id">
              <td>{{ personName(row) }}</td>
              <td>{{ row.status === 'fail' ? '检测失败' : '打卡成功' }}</td>
              <td>{{ formatBeijingTime(row.createdAt) }}</td>
              <td>{{ row.status === 'fail' ? '—' : row.similarity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
