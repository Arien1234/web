<script setup lang="ts">
import { timeline } from '@/data/site'
</script>

<template>
  <div class="container inner-page">
    <header class="page-hero">
      <h1>关于我们</h1>
      <p>
        澜知做智能服务，不追求「什么都能聊」，而追求在明确场景里稳定、可解释、可追责。
      </p>
    </header>

    <div class="timeline">
      <article v-for="item in timeline" :key="item.year" class="timeline__item">
        <b>{{ item.year }}</b>
        <p>{{ item.text }}</p>
      </article>
    </div>
  </div>
</template>
