<script setup lang="ts">
defineProps<{
  data?: {
    total: number;
    approved: number;
    verified: number;
    unVerified: number;
    unApproved: number;
  };
}>();

const getWidth = (count: number = 0, max: number = 100) => {
  return `width: max(${(count * 100) / max}%, 1%);`;
};
</script>

<template>
  <RouterLink :to="{ name: 'resource', params: { resource: 'users' } }">
    <div class="border-2 p-8">
      <div class="space-y-6">
        <div>
          <div class="mb-2 flex items-center gap-2 text-xl">
            <span class="fa-solid fa-users text-3xl"></span>
            <div class="flex flex-1 justify-between font-extrabold">
              <span>Users</span>
              <span
                ><span class="font-medium">Total: </span>{{ data?.total }}</span
              >
            </div>
          </div>
          <hr />
        </div>
        <div class="flex-1 space-y-3">
          <div class="flex flex-col">
            <span class="text-base leading-none">Verified</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 rounded-full bg-black transition-all duration-700 ease-out"
                :style="getWidth(data?.verified, data?.total)"></span>
              {{ data?.verified || 0 }}
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-base leading-none">Approved</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 rounded-full bg-black transition-all duration-700 ease-out"
                :style="getWidth(data?.approved, data?.total)"></span>
              {{ data?.approved || 0 }}
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-base leading-none">Pending approvals</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 rounded-full bg-black transition-all duration-700 ease-out"
                :style="getWidth(data?.unApproved, data?.total)"></span>
              {{ data?.unApproved || 0 }}
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-base leading-none">Pending verifications</span>
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-3 w-0 rounded-full bg-black transition-all duration-700 ease-out"
                :style="getWidth(data?.unVerified, data?.total)"></span>
              {{ data?.unVerified || 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
