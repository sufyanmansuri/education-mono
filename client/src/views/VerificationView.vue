<script setup lang="ts">
import TokenVerification from "@/components/TokenVerification.vue";
</script>

<template>
  <div class="container flex min-h-screen items-center justify-center">
    <img
      src="/verification.svg"
      alt="Verification"
      class="-z-50 -mr-36 hidden lg:block" />
    <div class="theme theme-blue md:w-1/2 lg:w-1/3">
      <TokenVerification />
    </div>
  </div>
</template>
