<script setup lang="ts">
import BaseTitle from "../base/BaseTitle.vue";
</script>

<template>
  <div class="relative flex-1">
    <BaseTitle
      class="text-start"
      text1="Dash"
      text2="board"
      underline-color="yellow" />
    <img
      src="/dashboard.svg"
      alt="Welcome"
      class="fixed top-1/2 left-1/2 -z-50 h-48 -translate-y-1/2 -translate-x-1/2 opacity-70 md:h-64 lg:absolute lg:h-96" />
  </div>
</template>
