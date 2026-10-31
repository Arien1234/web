<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import PasswordField from '@/components/PasswordField.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()
const loading = ref(false)
const error = ref('')
const form = reactive({
  username: '',
  displayName: '',
  password: '',
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await register(form)
    await router.replace('/console')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container inner-page">
    <div class="login-box">
      <BrandLogo size="lg" />
      <p class="hero__kicker">LANZHI AI</p>
      <h1>注册澜知</h1>
      <p class="login-box__lead">创建账号后即可进入 AI 工作台。用户名至少 3 位，密码至少 6 位。</p>
      <form class="contact-form login-form" @submit.prevent="onSubmit">
        <p v-if="error" class="form-error">{{ error }}</p>
        <label for="reg-username">用户名</label>
        <input id="reg-username" v-model="form.username" autocomplete="username" required minlength="3" />
        <label for="reg-display">显示名（选填）</label>
        <input id="reg-display" v-model="form.displayName" autocomplete="nickname" />
        <label for="reg-password">密码</label>
        <PasswordField id="reg-password" v-model="form.password" autocomplete="new-password" />
        <button class="btn btn--primary" type="submit" :disabled="loading">
          {{ loading ? '提交中…' : '注册并进入' }}
        </button>
      </form>
      <p class="login-box__switch">
        已有账号？
        <router-link to="/login">去登录</router-link>
      </p>
    </div>
  </div>
</template>
