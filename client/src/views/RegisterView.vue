<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import RegisterForm from "@/components/RegisterForm.vue";
</script>

<template>
  <div class="flex items-center justify-center">
    <div
      class="relative bottom-0 right-2 border-2 bg-white px-10 py-5 pb-10 transition-all after:absolute after:left-2 after:top-2 after:-z-20 after:h-full after:w-full after:border-2 after:bg-blue">
      <h1 class="mb-5 text-center text-5xl font-black">
        Regis<span
          class="font-outline-2 text-transparent underline decoration-blue decoration-wavy decoration-2 underline-offset-2"
          >ter</span
        >
      </h1>
      <RegisterForm />
      <div
        class="relative my-3 text-center before:absolute before:left-0 before:top-1/2 before:h-px before:w-2/5 before:bg-black after:absolute after:right-0 after:top-1/2 after:h-px after:w-2/5 after:bg-black">
        <span class="px-2">Or</span>
      </div>

      <RouterLink to="/login" class="flex">
        <BaseButton class="z-20 flex-1" color="yellow">Login</BaseButton>
      </RouterLink>
    </div>
  </div>
</template>
