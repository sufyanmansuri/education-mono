<script setup lang="ts">
import BaseTitle from "@/components/base/BaseTitle.vue";
import InstituteCard from "@/components/InstituteCard.vue";
import LoginActivity from "@/components/LoginActivity.vue";
import ProfileCard from "@/components/ProfileCard.vue";
</script>

<template>
  <div class="container flex flex-col items-start gap-4 p-3">
    <BaseTitle text1="Profile" underline-color="none" />
    <div class="flex w-full flex-col gap-4 xl:flex-row">
      <ProfileCard />
      <InstituteCard />
    </div>
    <LoginActivity />
  </div>
</template>
