<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import LoginForm from "@/components/LoginForm.vue";
</script>

<template>
  <div
    class="container relative flex items-center justify-center xl:justify-start xl:px-72">
    <img
      src="/login.svg"
      alt="Login"
      class="absolute right-56 -z-50 hidden object-contain xl:block" />
    <div class="theme theme-yellow relative">
      <h1 class="mb-5 text-center text-5xl font-black">
        Log<span
          class="font-outline-2 text-transparent underline decoration-yellow decoration-wavy decoration-2 underline-offset-2"
          >in</span
        >
      </h1>
      <LoginForm />
      <div
        class="relative my-3 text-center before:absolute before:left-0 before:top-1/2 before:h-px before:w-2/5 before:bg-black after:absolute after:right-0 after:top-1/2 after:h-px after:w-2/5 after:bg-black">
        <span class="px-2">Or</span>
      </div>

      <RouterLink to="/register" class="flex">
        <BaseButton class="z-20 flex-1" color="blue"
          >Create an account</BaseButton
        >
      </RouterLink>
    </div>
  </div>
</template>
