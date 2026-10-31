<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import UserMenu from '@/components/UserMenu.vue'
import { useAuth } from '@/composables/useAuth'
import { navItems, site } from '@/data/site'

const route = useRoute()
const open = ref(false)
const { isLoggedIn, loadProfile, syncFromStorage } = useAuth()

watch(
  () => route.fullPath,
  () => {
    open.value = false
    // 登录跳转后顶栏不会整页刷新，这里跟 localStorage 对齐
    syncFromStorage()
    if (isLoggedIn.value && route.path !== '/login' && route.path !== '/register') {
      void loadProfile()
    }
  },
  { immediate: true },
)

function isNavActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <router-link class="brand" to="/">
        <BrandLogo size="sm" />
        <span class="brand__name">{{ site.name }}</span>
      </router-link>

      <nav class="nav" :class="{ 'is-open': open }" aria-label="主导航">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          class="nav__link"
          :class="{ 'is-active': isNavActive(item.path) }"
          :to="item.path"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="header-actions">
        <UserMenu v-if="isLoggedIn" />
        <template v-else>
          <router-link class="btn btn--ghost btn--small" to="/register">注册</router-link>
          <router-link class="btn btn--primary btn--small" to="/login">登录</router-link>
        </template>
        <button class="menu-btn" type="button" aria-label="打开菜单" @click="open = !open">
          菜单
        </button>
      </div>
    </div>
  </header>
</template>
