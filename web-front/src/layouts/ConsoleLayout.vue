<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { consoleMenu } from '@/data/consoleMenu'

const { displayName, isAdmin, loadProfile } = useAuth()

const visibleMenu = computed(() =>
  consoleMenu.filter((item) => !item.adminOnly || isAdmin.value),
)

onMounted(() => {
  void loadProfile()
})
</script>

<template>
  <div class="container inner-page">
    <header class="page-hero">
      <h1>AI 服务工作台</h1>
      <p>
        你好，{{ displayName || '用户' }}。在此使用已开放的 AI 能力，点右上角名字可切换功能。
      </p>
    </header>
    <nav class="console-nav">
      <router-link
        v-for="item in visibleMenu"
        :key="item.path"
        class="console-nav__link"
        :to="item.path"
      >
        {{ item.label }}
      </router-link>
    </nav>
    <router-view />
  </div>
</template>
