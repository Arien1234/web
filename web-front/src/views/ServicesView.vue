<script setup lang="ts">
import { services } from '@/data/site'
</script>

<template>
  <div class="container inner-page">
    <header class="page-hero">
      <h1>智能服务</h1>
      <p>客服、知识助手与流程助手可以单独启用，数据和权限仍由你方系统掌控。</p>
    </header>

    <div class="service-grid">
      <article v-for="item in services" :key="item.name" class="service-card">
        <h3>{{ item.name }}</h3>
        <p>{{ item.summary }}</p>
      </article>
    </div>
  </div>
</template>
