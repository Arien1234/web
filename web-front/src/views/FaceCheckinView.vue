<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { checkInFaceApi, faceStatusApi, missFaceApi, myAttendanceApi } from '@/api/face'
import CameraCapture from '@/components/CameraCapture.vue'
import { useAuth } from '@/composables/useAuth'
import { useFaceScan } from '@/composables/useFaceScan'
import { formatBeijingTime } from '@/utils/time'
import type { AttendanceItem, FaceStatus } from '@/types/face'

const { isAdmin } = useAuth()
const enrolled = ref(false)
const loading = ref(false)
const records = ref<AttendanceItem[]>([])
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
  return '点击下方按钮打开摄像头，将面部放入椭圆框'
})

function personName(row: AttendanceItem) {
  return row.displayName || row.username
}

async function loadStatus() {
  const res = (await faceStatusApi()) as { data: FaceStatus }
  enrolled.value = res.data.enrolled
}

async function loadRecords() {
  const res = (await myAttendanceApi()) as { data: AttendanceItem[] }
  records.value = res.data
}

async function openCamera() {
  const result = await scan()
  if (result === 'miss') {
    try {
      await missFaceApi()
      await loadRecords()
    } catch {
      /* 仍显示检测失败 */
    }
  }
}

async function checkIn() {
  if (!pending.value) {
    error.value = '请先打开摄像头并完成人脸检测'
    return
  }
  error.value = ''
  message.value = ''
  loading.value = true
  try {
    const res = (await checkInFaceApi(pending.value)) as unknown as {
      message: string
      data: { image?: string }
    }
    if (res.data.image) {
      setPreview(res.data.image)
    }
    message.value = res.message
    await loadStatus()
    await loadRecords()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '打卡失败'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadStatus()
    await loadRecords()
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
          <h2>人脸打卡</h2>
          <p>由管理员在人脸库录入后，即可打开摄像头打卡。请将面部对准中间椭圆。</p>
        </div>
        <span class="face-badge" :class="enrolled ? 'is-on' : 'is-off'">
          {{ enrolled ? '管理员已录入' : '待管理员录入' }}
        </span>
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>
      <p v-if="message" class="form-ok">{{ message }}</p>

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
        <button class="btn btn--ghost" type="button" :disabled="scanning || loading" @click="checkIn">
          {{ loading ? '打卡中…' : '确认打卡' }}
        </button>
      </div>
    </div>

    <div class="face-card">
      <h3>{{ isAdmin ? '全部打卡记录' : '我的打卡记录' }}</h3>
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
