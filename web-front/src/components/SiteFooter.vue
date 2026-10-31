<script setup lang="ts">
import BrandLogo from '@/components/BrandLogo.vue'
import { site } from '@/data/site'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <span class="site-footer__brand">
        <BrandLogo size="sm" />
        <span>{{ site.name }} · {{ site.slogan }}</span>
      </span>
      <span>{{ site.email }}</span>
    </div>
  </footer>
</template>
