<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'sm' },
)
</script>

<template>
  <img
    class="brand-logo"
    :class="`brand-logo--${size}`"
    src="/Logo.png"
    alt="澜知 LanZhi AI"
  />
</template>
