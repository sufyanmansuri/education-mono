<script setup lang="ts">
import BaseButton from "./base/BaseButton.vue";
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-8">
    <img src="/404.svg" alt="Page not found" class="h-72 object-contain" />
    <h1 class="text-5xl">Page not found</h1>
    <RouterLink to="/">
      <BaseButton>
        <span class="px-8"> Go to home </span>
      </BaseButton>
    </RouterLink>
  </div>
</template>
