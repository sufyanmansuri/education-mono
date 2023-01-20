<script setup lang="ts">
import DashboardLink from "@/components/Dashboard/DashboardLink.vue";
</script>

<template>
  <div class="lg:grid lg:grid-cols-12">
    <div class="p-5 lg:col-span-3 lg:border-r-2 xl:col-span-2">
      <h2 class="text-2xl font-bold">Resources</h2>
      <div class="mt-5 flex gap-2 overflow-x-auto lg:block lg:space-y-2">
        <DashboardLink to="/dashboard/users">
          <span class="fa-solid fa-user"></span>Users
        </DashboardLink>
        <DashboardLink to="/dashboard/institutes">
          <span class="fa-solid fa-school"></span>Institutes
        </DashboardLink>
      </div>
    </div>
    <div class="relative flex flex-col p-5 lg:col-span-9 xl:col-span-10">
      <RouterView />
    </div>
  </div>
</template>
