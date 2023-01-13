<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import LineThrough from "@/components/LineThrough.vue";
import LoginForm from "@/components/Forms/LoginForm.vue";
</script>

<template>
  <div
    class="container relative flex items-center justify-center xl:justify-start xl:px-72">
    <img
      src="/login.svg"
      alt="Login"
      class="absolute right-56 -z-50 hidden object-contain xl:block" />
    <div class="theme theme-yellow relative">
      <BaseTitle text1="Log" text2="in" />
      <LoginForm />
      <LineThrough />
      <RouterLink to="/register" class="flex">
        <BaseButton class="z-20 flex-1" color="blue">
          Create an account
        </BaseButton>
      </RouterLink>
    </div>
  </div>
</template>
