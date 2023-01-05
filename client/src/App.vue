<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "./components/TheFooter.vue";
import TheNav from "./components/TheNav.vue";
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <TheNav />
    <RouterView />
    <TheFooter />
  </div>
</template>
