<script setup lang="ts">
import DashboardLink from "@/components/Dashboard/DashboardLink.vue";
import { useUserStore } from "@/stores/useUserStore";
import { ref } from "vue";

const { state: auth } = useUserStore();
const isOpen = ref(false);
</script>

<template>
  <div class="lg:flex">
    <div
      class="group flex flex-col py-3 px-2 transition-all duration-200 lg:w-20 lg:border-r-2 lg:aria-expanded:w-1/6"
      :aria-expanded="isOpen">
      <div
        class="flex flex-1 gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-x-hidden">
        <DashboardLink
          to="/dashboard/users"
          v-if="
            ['super-admin', 'institute-admin'].includes(auth.user?.role || '')
          ">
          <span
            class="fa-solid fa-users my-1 ml-1 transition-all lg:mr-3 lg:group-aria-expanded:mr-0"></span>
          <span class="">Users</span>
        </DashboardLink>
        <DashboardLink
          to="/dashboard/institutes"
          v-if="auth.user?.role === 'super-admin'">
          <span
            class="fa-solid fa-school my-1 ml-1 transition-all lg:mr-3 lg:group-aria-expanded:mr-0"></span>

          <span class="">Institutes</span>
        </DashboardLink>
        <DashboardLink to="/dashboard/classes">
          <span
            class="fa-solid fa-graduation-cap my-1 ml-1 transition-all lg:mr-3 lg:group-aria-expanded:mr-0"></span>
          <span class="">Classes</span>
        </DashboardLink>
      </div>
      <div class="mt-auto hidden text-left lg:block">
        <button
          @click="isOpen = !isOpen"
          class="w-16 border-2 p-2 px-4 outline-offset-2 outline-yellow transition-all hover:bg-yellow group-aria-expanded:bg-yellow">
          <span
            class="fa-solid fa-arrow-right text-lg transition-all group-aria-expanded:-rotate-180"></span>
        </button>
      </div>
    </div>
    <div class="relative flex flex-col p-5 lg:flex-1">
      <RouterView />
    </div>
  </div>
</template>
