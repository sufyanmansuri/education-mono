<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import { onMounted } from "vue";

onMounted(() => {
  document.title = "Education Platform";
});
</script>

<template>
  <div class="flex">
    <div class="container relative py-5 lg:py-10">
      <img
        src="/landing.png"
        alt="Education platform"
        class="object-cover opacity-40 lg:absolute lg:right-0 lg:-z-10 lg:block lg:w-[calc(100vw/2)]"
      />
      <div
        class="relative -top-20 space-y-4 md:-top-20 lg:static lg:w-2/3 lg:space-y-8 lg:bg-transparent"
      >
        <h1
          class="bg-[url('/landing.png')] bg-clip-text bg-center text-5xl font-black md:text-7xl lg:text-8xl"
        >
          Education
          <span
            class="font-outline lg:font-outline-2 block bg-gradient-to-br from-yellow/75 to-blue/75 bg-clip-text text-opaque underline decoration-wavy decoration-2 underline-offset-8"
            >Platform</span
          >
        </h1>
        <div class="space-y-4 lg:space-y-8">
          <p class="p-2 text-xl tracking-wide lg:leading-loose">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum neque,
            dolor enim, iure, natus corrupti quam corporis sit ipsam saepe
            perspiciatis quis aspernatur asperiores eos repellat incidunt fugit
            voluptatum quasi sapiente ipsa deleniti. Atque perferendis
            laboriosam eos quam at? Adipisci nihil, harum architecto magnam
            accusantium deserunt id facere, vel, esse molestiae ea? Quidem
            nesciunt voluptatibus alias ex earum, doloribus rem.
          </p>
          <RouterLink :to="{ name: 'login' }">
            <BaseButton
              ><div class="px-8 py-3 text-xl">Get Started</div></BaseButton
            >
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
