<script setup lang="ts">
import { timeline } from '@/data/site'
</script>

<template>
  <div class="container inner-page">
    <header class="page-hero">
      <h1>关于我们</h1>
      <p>
        澜知做能上线的 AI 服务：先让能力可用、结果可核对、权限可管，再按客户业务往下扩展。不追求「什么都能聊」，追求在明确场景里稳定交付。
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
