<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <button
    class="group relative pl-5 hover:font-semibold"
    @click="router.back()">
    <span
      class="fa-solid fa-arrow-left absolute -left-0 top-1/2 -translate-y-1/2 transition-all group-hover:-left-1"></span
    >Go back
  </button>
</template>
