<script setup lang="ts">
import { site } from '@/data/site'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <span>{{ site.name }} · {{ site.slogan }}</span>
      <span>{{ site.email }}</span>
    </div>
  </footer>
</template>
