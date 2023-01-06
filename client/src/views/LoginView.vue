<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
</script>
<template>
  <div class="flex items-center justify-center">
    <div class="border-2 px-10 py-5 pb-10">
      <h1 class="mb-5 text-center text-5xl font-black">
        Log<span
          class="font-outline-2 text-transparent underline decoration-yellow decoration-wavy decoration-2 underline-offset-2"
          >In</span
        >
      </h1>
      <LoginForm />
    </div>
  </div>
</template>
