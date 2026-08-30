<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  id: string
  autocomplete?: string
  required?: boolean
}>()

const password = defineModel<string>({ required: true })
const visible = ref(false)
</script>

<template>
  <div class="password-field">
    <input
      :id="id"
      v-model="password"
      :type="visible ? 'text' : 'password'"
      :autocomplete="autocomplete"
      :required="required !== false"
    />
    <button class="password-field__toggle" type="button" @click="visible = !visible">
      {{ visible ? '隐藏' : '显示' }}
    </button>
  </div>
</template>
