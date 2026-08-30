<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PasswordField from '@/components/PasswordField.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const loading = ref(false)
const error = ref('')
const form = reactive({
  username: '',
  password: '',
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(form)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/console'
    await router.replace(redirect)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container inner-page">
    <div class="login-box">
      <p class="hero__kicker">ACCOUNT</p>
      <h1>登录澜知</h1>
      <p class="login-box__lead">使用账号进入智能服务工作台。也可先注册新账号。</p>
      <form class="contact-form login-form" @submit.prevent="onSubmit">
        <p v-if="error" class="form-error">{{ error }}</p>
        <label for="username">用户名</label>
        <input id="username" v-model="form.username" autocomplete="username" required />
        <label for="password">密码</label>
        <PasswordField id="password" v-model="form.password" autocomplete="current-password" />
        <button class="btn btn--primary" type="submit" :disabled="loading">
          {{ loading ? '登录中…' : '进入工作台' }}
        </button>
      </form>
      <p class="login-box__switch">
        还没有账号？
        <router-link to="/register">去注册</router-link>
      </p>
    </div>
  </div>
</template>
