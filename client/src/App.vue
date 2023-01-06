<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "./components/TheFooter.vue";
import TheHeader from "./components/TheHeader.vue";
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <TheHeader />
    <RouterView class="flex-1" />
    <TheFooter />
  </div>
</template>
