<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

defineProps<{
  hint?: string
  active?: boolean
}>()

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const error = ref('')
const ready = ref(false)
let stream: MediaStream | null = null

async function start() {
  error.value = ''
  stop()
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    })
    if (!video.value) {
      return false
    }
    video.value.srcObject = stream
    await video.value.play()
    ready.value = true
    return true
  } catch {
    error.value = '无法打开摄像头，请允许浏览器使用摄像头后重试'
    ready.value = false
    return false
  }
}

function stop() {
  stream?.getTracks().forEach((track) => track.stop())
  stream = null
  ready.value = false
  if (video.value) {
    video.value.srcObject = null
  }
}

function grabFile() {
  const el = video.value
  const board = canvas.value
  if (!el || !board || !ready.value || !el.videoWidth) {
    return Promise.resolve(null)
  }
  board.width = el.videoWidth
  board.height = el.videoHeight
  const ctx = board.getContext('2d')
  if (!ctx) {
    return Promise.resolve(null)
  }
  ctx.drawImage(el, 0, 0)
  return new Promise<File | null>((resolve) => {
    board.toBlob(
      (blob) => {
        resolve(blob ? new File([blob], 'face.jpg', { type: 'image/jpeg' }) : null)
      },
      'image/jpeg',
      0.92,
    )
  })
}

onUnmounted(stop)

defineExpose({ start, stop, grabFile, error })
</script>

<template>
  <div class="camera">
    <p v-if="error" class="form-error">{{ error }}</p>
    <div class="camera__stage" :class="{ 'is-on': active }">
      <video ref="video" class="camera__video" autoplay playsinline muted></video>
      <div class="camera__mask" aria-hidden="true"></div>
      <div class="camera__oval" aria-hidden="true"></div>
      <p class="camera__hint">{{ hint || '将面部放入中间的人脸框内' }}</p>
    </div>
    <canvas ref="canvas" class="camera__canvas"></canvas>
  </div>
</template>
