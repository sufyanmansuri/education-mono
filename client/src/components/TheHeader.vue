<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "./base/BaseButton.vue";
import TheNav from "./TheNav.vue";

const showNav = ref(false);
</script>

<template>
  <header class="flex flex-col border-b-2">
    <TheNav />
    <div class="container flex flex-col items-center py-2 lg:h-24 lg:flex-row">
      <div class="flex w-full items-center justify-between">
        <a href="" class="flex items-center gap-4">
          <img
            src="../assets/logo.svg"
            alt="Education Platform"
            class="h-12 w-auto object-contain"
          />
          <h1 class="text-2xl lg:text-3xl">Education Platform</h1>
        </a>
        <div class="lg:hidden">
          <button class="space-y-1 border-2 p-2" @click="showNav = !showNav">
            <div class="h-[2px] w-4 bg-black"></div>
            <div class="h-[2px] w-4 bg-black"></div>
            <div class="h-[2px] w-4 bg-black"></div>
          </button>
        </div>
      </div>
      <div
        class="mt-5 mb-2 w-full bg-white lg:my-0 lg:block lg:w-auto"
        :class="{ block: showNav, hidden: !showNav }"
      >
        <ul class="space-y-3 text-lg">
          <li class="mb-3">
            <div
              class="flex items-center gap-2 border-b-2 text-black/50 transition-all duration-300 focus-within:border-black focus-within:text-black lg:border-black/50"
            >
              <span class="fa-solid fa-search"></span>
              <input
                type="search"
                class="w-full outline-none"
                placeholder="Search books"
              />
            </div>
          </li>
          <li class="border-b lg:hidden">
            <a href="#" class="">Blog</a>
          </li>
          <li class="border-b lg:hidden">
            <a href="#" class="">Further Education</a>
          </li>
          <li class="border-b lg:hidden">
            <a href="#" class="">Primary</a>
          </li>
          <li class="border-b lg:hidden">
            <a href="#" class="">Secondary</a>
          </li>
          <li class="border-b lg:hidden">
            <a href="#" class="">About</a>
          </li>
          <li class="border-b lg:hidden">
            <a href="#" class="">FAQ</a>
          </li>
          <li class="border-b lg:hidden">
            <a href="#" class="">Partners</a>
          </li>
          <li class="pt-5 lg:hidden">
            <a href="#"><BaseButton :animated="false">Sign In</BaseButton></a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
