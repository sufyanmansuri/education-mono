<script setup lang="ts">
defineProps<{
  data?: {
    superAdmin?: number;
    instituteAdmin?: number;
    teacher: number;
  };
  max?: number;
}>();

const getWidth = (count: number = 0, max: number = 100) => {
  return `width: max(${(count * 100) / max}%, 1%);`;
};
</script>
<template>
  <RouterLink
    :to="{ name: 'resource', params: { resource: 'users' } }"
    class="group transition-all hover:shadow-xl">
    <div class="h-full flex-1 border-2 p-5">
      <div class="space-y-6">
        <div>
          <div class="mb-2 flex items-center gap-2 text-xl">
            <span class="fa-solid fa-user-shield text-3xl"></span>
            <div class="flex flex-1 justify-between font-extrabold">
              <span>Roles</span>
            </div>
          </div>
          <hr />
        </div>
        <div class="flex-1 space-y-3">
          <div class="flex flex-col">
            <span class="text-base leading-none">Teacher</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 bg-black transition-all duration-700 ease-out"
                :style="getWidth(data?.teacher, max)"></span>
              {{ data?.teacher || 0 }}
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-base leading-none">Institute admin</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 bg-black transition-all duration-700 ease-out"
                :style="getWidth(data?.instituteAdmin, max)"></span>
              {{ data?.instituteAdmin || 0 }}
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-base leading-none">Super admin</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 bg-black transition-all duration-700 ease-out"
                :style="getWidth(data?.superAdmin, max)"></span>
              {{ data?.superAdmin || 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
