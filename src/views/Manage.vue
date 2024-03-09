<template>
  <h1>{{ setValue?.title }}</h1>
</template>

<script setup>
  import { ref } from 'vue'

  const setValue = ref({})

  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await response.json()

  setValue.value = data
</script>

<style scoped></style>
