<script setup lang="ts">
import TheFooter from "./TheFooter.vue";
import TheHeader from "./TheHeader.vue";
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <TheHeader />
    <RouterView class="flex-1" />
    <TheFooter />
  </div>
</template>
