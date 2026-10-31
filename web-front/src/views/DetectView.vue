<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { detectImageApi } from '@/api/detect'
import type { DetectionItem } from '@/types/detect'

const fileInput = ref<HTMLInputElement | null>(null)
const originUrl = ref('')
const resultUrl = ref('')
const detections = ref<DetectionItem[]>([])
const infoText = ref('请选择图片，开始一次视觉检测')
const loading = ref(false)
const error = ref('')

onUnmounted(() => {
  if (originUrl.value) {
    URL.revokeObjectURL(originUrl.value)
  }
})

function pickFile() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }

  if (originUrl.value) {
    URL.revokeObjectURL(originUrl.value)
  }
  originUrl.value = URL.createObjectURL(file)
  resultUrl.value = ''
  detections.value = []
  error.value = ''
  loading.value = true
  infoText.value = '正在推理…'

  try {
    const res = (await detectImageApi(file)) as { data: { image: string; detections: DetectionItem[]; message: string } }
    resultUrl.value = res.data.image
    detections.value = res.data.detections
    infoText.value = formatInfo(res.data.detections, res.data.message)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '检测失败'
    infoText.value = error.value
  } finally {
    loading.value = false
  }
}

function formatInfo(list: DetectionItem[], fallback: string) {
  if (!list.length) {
    return fallback
  }
  return list
    .map(
      (item) =>
        `类别：${item.className}，置信度：${item.confidence.toFixed(3)}，框坐标：[${item.box.join(', ')}]`,
    )
    .join('\n')
}
</script>

<template>
  <section class="detect">
    <div class="detect__toolbar">
      <input
        ref="fileInput"
        class="detect__file"
        type="file"
        accept=".jpg,.jpeg,.png,.bmp,image/jpeg,image/png,image/bmp"
        @change="onFileChange"
      />
      <button class="btn btn--primary" type="button" :disabled="loading" @click="pickFile">
        {{ loading ? '检测中…' : '选择图片' }}
      </button>
      <span class="detect__hint">支持 jpg / png / bmp。当前模型用于安全帽识别，更多视觉能力将陆续加入工作台</span>
    </div>

    <div class="detect__frames">
      <figure class="detect__frame">
        <figcaption>原图</figcaption>
        <div class="detect__canvas">
          <img v-if="originUrl" :src="originUrl" alt="原始图片" />
          <span v-else>尚未导入</span>
        </div>
      </figure>
      <figure class="detect__frame">
        <figcaption>AI 检测结果</figcaption>
        <div class="detect__canvas">
          <img v-if="resultUrl" :src="resultUrl" alt="YOLO 检测结果" />
          <span v-else>{{ loading ? '推理中…' : '等待检测' }}</span>
        </div>
      </figure>
    </div>

    <pre class="detect__info">{{ infoText }}</pre>
  </section>
</template>
