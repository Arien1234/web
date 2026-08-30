<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { profile, isAdmin, loadProfile } = useAuth()

onMounted(() => {
  void loadProfile()
})
</script>

<template>
  <div class="container inner-page">
    <header class="page-hero">
      <h1>智能服务工作台</h1>
      <p>
        你好，{{ profile?.displayName || profile?.username || '用户' }}。
        <template v-if="isAdmin">你是系统管理员，可以管理注册成员。</template>
        <template v-else>头盔检测仅登录后可用。</template>
      </p>
    </header>
    <nav class="console-nav">
      <router-link class="console-nav__link" to="/console/detect">头盔检测</router-link>
      <router-link v-if="isAdmin" class="console-nav__link" to="/console/members">成员名单</router-link>
    </nav>
    <router-view />
  </div>
</template>
