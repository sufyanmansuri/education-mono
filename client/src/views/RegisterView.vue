<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import LineThrough from "@/components/LineThrough.vue";
import RegisterForm from "@/components/Forms/RegisterForm.vue";
</script>

<template>
  <div class="container my-10 flex items-center justify-center gap-20">
    <div class="theme theme-blue relative w-full md:w-2/3 lg:w-1/3">
      <BaseTitle text1="Regis" text2="ter" />
      <RegisterForm />
      <LineThrough />
      <RouterLink :to="{ name: 'login' }" class="flex">
        <BaseButton class="z-20 flex-1" color="yellow">Login</BaseButton>
      </RouterLink>
    </div>
    <img src="/register.svg" alt="Register" class="hidden lg:block" />
  </div>
</template>
