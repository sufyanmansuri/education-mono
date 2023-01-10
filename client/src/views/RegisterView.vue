<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import RegisterForm from "@/components/RegisterForm.vue";
</script>

<template>
  <div class="container my-10 flex items-center justify-center gap-20 px-5">
    <div class="theme theme-blue relative lg:w-1/3">
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
    <img src="/register.svg" alt="Register" class="hidden lg:block" />
  </div>
</template>
