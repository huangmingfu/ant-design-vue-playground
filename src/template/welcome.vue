<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <a-input v-model:value="msg" />

  <a-popover title="Title">
    <template #content>
      <p>Content</p>
      <p>Content</p>
    </template>
    <a-button type="primary">Hover me</a-button>
  </a-popover>
</template>
