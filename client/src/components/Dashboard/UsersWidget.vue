<script setup lang="ts">
defineProps<{
  data?: {
    total: number;
    active: number;
    "pending-verification": number;
    "pending-approval": number;
  };
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
            <span class="fa-solid fa-users text-3xl"></span>
            <div class="flex flex-1 justify-between font-extrabold">
              Users
              <span
                ><span class="font-medium">Total: </span>{{ data?.total }}</span
              >
            </div>
          </div>
          <hr />
        </div>
        <div class="flex-1 space-y-3">
          <div class="flex flex-col">
            <span class="text-base leading-none">Active</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 bg-black transition-all duration-700 ease-out"
                :style="getWidth(data?.active, data?.total)"></span>
              {{ data?.active || 0 }}
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-base leading-none">Unverified</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 bg-black transition-all duration-700 ease-out"
                :style="
                  getWidth(data?.['pending-verification'], data?.total)
                "></span>
              {{ data?.["pending-verification"] || 0 }}
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-left text-base leading-none"
              >Pending approvals</span
            >
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 bg-black transition-all duration-700 ease-out"
                :style="
                  getWidth(data?.['pending-approval'], data?.total)
                "></span>
              {{ data?.["pending-approval"] || 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
