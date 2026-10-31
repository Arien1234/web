import { onUnmounted, ref } from 'vue'
import { probeFaceApi } from '@/api/face'
import type CameraCapture from '@/components/CameraCapture.vue'

const SCAN_MS = 4000
const TICK_MS = 500

export function useFaceScan() {
  const camera = ref<InstanceType<typeof CameraCapture> | null>(null)
  const scanning = ref(false)
  const remain = ref(0)
  const preview = ref('')
  const pending = ref<File | null>(null)
  const error = ref('')
  const message = ref('')
  let timer: ReturnType<typeof setInterval> | null = null
  let stopped = false
  let probing = false

  function clearTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function setPreview(url: string) {
    if (preview.value.startsWith('blob:')) {
      URL.revokeObjectURL(preview.value)
    }
    preview.value = url
  }

  async function scan() {
    if (scanning.value) {
      return 'denied'
    }
    error.value = ''
    message.value = ''
    pending.value = null
    scanning.value = true
    stopped = false
    probing = false
    remain.value = Math.ceil(SCAN_MS / 1000)

    const opened = await camera.value?.start()
    if (!opened) {
      scanning.value = false
      error.value = '无法打开摄像头，请允许浏览器使用摄像头后重试'
      return 'denied'
    }

    const deadline = Date.now() + SCAN_MS
    return new Promise<'ok' | 'miss'>((resolve) => {
      const finish = (ok: 'ok' | 'miss') => {
        stopped = true
        clearTimer()
        camera.value?.stop()
        scanning.value = false
        remain.value = 0
        resolve(ok)
      }

      const tick = async () => {
        if (stopped) {
          return
        }
        remain.value = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
        if (Date.now() >= deadline) {
          error.value = '检测失败：这几秒内未识别到人脸'
          finish('miss')
          return
        }
        if (probing) {
          return
        }
        probing = true
        try {
          const file = await camera.value?.grabFile()
          if (!file || stopped) {
            return
          }
          const res = (await probeFaceApi(file)) as { data: { image?: string } }
          if (stopped) {
            return
          }
          pending.value = file
          setPreview(res.data.image || URL.createObjectURL(file))
          message.value = '已检测到人脸'
          finish('ok')
        } catch {
          /* 继续检测直到超时 */
        } finally {
          probing = false
        }
      }

      void tick()
      timer = setInterval(() => void tick(), TICK_MS)
    })
  }

  onUnmounted(() => {
    stopped = true
    clearTimer()
    camera.value?.stop()
    setPreview('')
  })

  return {
    camera,
    scanning,
    remain,
    preview,
    pending,
    error,
    message,
    scan,
    setPreview,
  }
}
