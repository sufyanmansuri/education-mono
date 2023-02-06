<script setup lang="ts">
import DashboardLink from "@/components/Dashboard/DashboardLink.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { ref } from "vue";

const { auth } = useAuthStore();
const isOpen = ref(true);
</script>

<template>
  <div class="flex flex-col lg:flex-row">
    <div
      class="group peer flex flex-col py-3 px-2 transition-all lg:w-20 lg:border-r-2 lg:aria-expanded:w-1/6"
      :aria-expanded="isOpen">
      <div
        class="flex flex-1 gap-2 overflow-x-auto p-1 lg:block lg:space-y-2.5 lg:overflow-x-hidden">
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
        <DashboardLink to="/dashboard/employees" icon="fa-solid fa-briefcase">
          Employees
        </DashboardLink>
      </div>
      <div class="mt-auto hidden text-left lg:block">
        <button
          @click="isOpen = !isOpen"
          class="ml-2 h-12 w-12 rounded-full border-2 border-black p-1 outline-offset-2 outline-yellow transition-all hover:bg-black hover:text-white group-aria-expanded:bg-black group-aria-expanded:text-white">
          <span
            class="fa-solid fa-arrow-right text-lg transition-all group-aria-expanded:-scale-x-100"></span>
        </button>
      </div>
    </div>
    <div
      class="relative flex flex-1 flex-col overflow-x-auto p-5 transition-all lg:w-full lg:peer-aria-expanded:w-11/12">
      <RouterView />
    </div>
  </div>
</template>
