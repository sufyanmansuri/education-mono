<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
</script>

<template>
  <div class="relative flex flex-col justify-center">
    <img
      src="/landing.png"
      alt="Education platform"
      class="object-cover py-5 opacity-40 lg:absolute lg:top-1/2 lg:right-0 lg:-z-10 lg:block lg:w-[calc(100vw/2)] lg:-translate-y-1/2 lg:p-5"
      loading="eager" />
    <div class="container py-5 lg:py-10">
      <div
        class="relative -top-20 space-y-4 md:-top-20 lg:static lg:w-2/3 lg:space-y-8 lg:bg-transparent">
        <h1
          class="bg-[url('/landing.png')] bg-clip-text bg-center text-5xl font-black tracking-wide md:text-6xl lg:whitespace-nowrap lg:text-7xl">
          Education
          <span
            class="font-outline lg:font-outline-2 bg-gradient-to-br from-yellow/75 to-blue/75 bg-clip-text text-opaque underline decoration-yellow decoration-wavy decoration-2 underline-offset-8"
            >Platform</span
          >
        </h1>
        <div class="space-y-4 lg:space-y-8">
          <p class="mb-5 py-4 text-2xl lg:leading-relaxed">
            Welcome to our educational platform! Our website is designed to help
            institutes streamline their class management and bookkeeping. With
            our easy-to-use interface and powerful features, you can simplify
            your administrative tasks and focus on what really matters: teaching
            and learning. By registering for our platform, you'll gain access to
            a host of benefits including the ability to manage your classes and
            teachers and stay organized with our bookkeeping tools. Don't wait,
            register today and start streamlining your institute's operations!
          </p>
          <RouterLink :to="{ name: 'login' }">
            <BaseButton>
              <div class="px-8 py-3 text-xl">Get Started</div>
            </BaseButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
