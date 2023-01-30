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
      class="group peer flex flex-col py-3 px-2 transition-all duration-300 lg:w-20 lg:border-r-2 lg:aria-expanded:w-1/6"
      :aria-expanded="isOpen">
      <div
        class="flex flex-1 gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-x-hidden">
        <DashboardLink
          to="/dashboard/users"
          icon="fa-solid fa-users"
          v-if="
            ['super-admin', 'institute-admin'].includes(auth.user?.role || '')
          ">
          Users
        </DashboardLink>
        <DashboardLink
          to="/dashboard/pending-approvals"
          icon="fa-solid fa-user-lock"
          v-if="
            ['super-admin', 'institute-admin'].includes(auth.user?.role || '')
          ">
          Pending Approvals
        </DashboardLink>
        <DashboardLink
          to="/dashboard/institutes"
          v-if="auth.user?.role === 'super-admin'"
          icon="fa-solid fa-school">
          Institutes
        </DashboardLink>
        <DashboardLink
          to="/dashboard/classes"
          icon="fa-solid fa-graduation-cap">
          Classes
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
    <div
      class="relative flex flex-col p-5 transition-all lg:w-full lg:peer-aria-expanded:w-11/12">
      <RouterView />
    </div>
  </div>
</template>
<style>
::-webkit-scrollbar {
  @apply hidden lg:block;
}
</style>
