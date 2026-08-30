<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createInquiryApi } from '@/api/inquiry'
import { site } from '@/data/site'

const submitted = ref(false)
const error = ref('')
const loading = ref(false)
const form = reactive({
  name: '',
  company: '',
  message: '',
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await createInquiryApi(form)
    submitted.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : '提交失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container inner-page">
    <header class="page-hero">
      <h1>联系我们</h1>
      <p>告诉我们你的业务场景与数据范围，我们会在一个工作日内回复。</p>
    </header>

    <div class="contact-grid">
      <aside class="contact-card">
        <h2>联络方式</h2>
        <p>电话：{{ site.phone }}</p>
        <p>邮箱：{{ site.email }}</p>
        <p>地址：{{ site.address }}</p>
      </aside>

      <form class="contact-form" @submit.prevent="onSubmit">
        <p v-if="submitted" class="form-ok">已写入数据库，我们会尽快与你联系。</p>
        <p v-if="error" class="form-error">{{ error }}</p>
        <label for="name">姓名</label>
        <input id="name" v-model="form.name" required autocomplete="name" />
        <label for="company">公司</label>
        <input id="company" v-model="form.company" autocomplete="organization" />
        <label for="message">需求</label>
        <textarea id="message" v-model="form.message" rows="5" required></textarea>
        <button class="btn btn--primary" type="submit" :disabled="loading || submitted">
          提交留言
        </button>
      </form>
    </div>
  </div>
</template>
