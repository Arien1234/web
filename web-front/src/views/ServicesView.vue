<script setup lang="ts">
import { services } from '@/data/site'
</script>

<template>
  <div class="container inner-page">
    <header class="page-hero">
      <h1>AI 服务</h1>
      <p>
        我们把 AI 做成可登录的服务，而不是一次性演示。视觉智能、场景定制、系统接入可以按你的节奏启用，数据和权限仍由你方掌控。
      </p>
    </header>

    <div class="service-grid">
      <article v-for="item in services" :key="item.name" class="service-card">
        <h3>{{ item.name }}</h3>
        <p>{{ item.summary }}</p>
      </article>
    </div>
  </div>
</template>
