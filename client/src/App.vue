<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "./components/layout/TheFooter.vue";
import TheHeader from "./components/layout/TheHeader.vue";
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <TheHeader />
    <RouterView class="flex-1 p-5" />
    <TheFooter />
  </div>
</template>
