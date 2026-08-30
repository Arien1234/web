<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { consoleMenu } from '@/data/consoleMenu'

const router = useRouter()
const route = useRoute()
const { displayName, isAdmin, logout } = useAuth()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

const menuItems = computed(() =>
  consoleMenu.filter((item) => !item.adminOnly || isAdmin.value),
)

function placePanel() {
  const el = root.value
  if (!el) {
    return
  }
  const rect = el.getBoundingClientRect()
  panelStyle.value = {
    top: `${Math.round(rect.bottom + 8)}px`,
    right: `${Math.round(window.innerWidth - rect.right)}px`,
  }
}

async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    placePanel()
  }
}

function close() {
  open.value = false
}

function isInsideMenu(target: EventTarget | null) {
  const node = target as Node | null
  return Boolean(node && (root.value?.contains(node) || panel.value?.contains(node)))
}

function onDocPointerDown(event: PointerEvent) {
  if (!open.value) {
    return
  }
  if (!isInsideMenu(event.target)) {
    close()
  }
}

async function onLogout() {
  close()
  await logout()
  await router.replace('/')
}

watch(
  () => route.fullPath,
  () => {
    close()
  },
)

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown)
  window.addEventListener('resize', placePanel)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
  window.removeEventListener('resize', placePanel)
})
</script>

<template>
  <div ref="root" class="user-menu">
    <button class="user-menu__trigger" type="button" @click="toggle">
      <span class="user-menu__name">{{ displayName || '用户' }}</span>
      <span class="user-menu__caret" aria-hidden="true">▾</span>
    </button>
    <Teleport to="body">
      <div
        v-if="open"
        ref="panel"
        class="user-menu__panel"
        role="menu"
        :style="panelStyle"
      >
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          class="user-menu__item"
          :to="item.path"
          role="menuitem"
          @click="close"
        >
          {{ item.label }}
        </router-link>
        <button class="user-menu__item user-menu__item--danger" type="button" role="menuitem" @click="onLogout">
          退出登录
        </button>
      </div>
    </Teleport>
  </div>
</template>
