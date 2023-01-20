<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import LineThrough from "@/components/LineThrough.vue";
import LoginForm from "@/components/Forms/LoginForm.vue";
</script>

<template>
  <div
    class="container relative my-10 flex items-center justify-center lg:justify-start lg:gap-36">
    <img src="/login.svg" alt="Login" class="hidden w-1/2 lg:block" />
    <div class="theme theme-yellow relative w-96">
      <BaseTitle text1="Log" text2="in" underline-color="yellow" />
      <LoginForm />
      <LineThrough />
      <RouterLink :to="{ name: 'register' }" class="flex">
        <BaseButton class="z-20 flex-1" color="blue">
          Create an account
        </BaseButton>
      </RouterLink>
    </div>
  </div>
</template>
