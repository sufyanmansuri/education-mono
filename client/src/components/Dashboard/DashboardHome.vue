<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseTitle from "../base/BaseTitle.vue";
import { get } from "@/services/DashboardService";
import { computed } from "vue";

type DashboardData = {
  users: [
    {
      total: [{ count: number }];
      approved: [{ count: number }];
      verified: [{ count: number }];
    }
  ];
  institutes: [{ total: [{ count: number }] }];
  classes: [{ total: [{ count: number }] }];
};
const res = ref<DashboardData>();
const users = computed(() => {
  if (!res.value) return undefined;
  const total = res.value.users[0].total[0].count;
  const approved = res.value.users[0].approved[0].count;
  const verified = res.value.users[0].verified[0].count;

  const unVerified = total - verified;
  const unApproved = verified - approved;

  return { total, approved, verified, unVerified, unApproved };
});

const getWidth = (count: number | undefined, max: number | undefined) => {
  if (count === undefined || max === undefined) return `width: 0px`;
  return `width: max(${(count * 100) / max - 5}%, 2%);`;
};

onMounted(async () => {
  const { data, error } = await get();
  if (!error) {
    res.value = data;
  } else {
    console.log(error);
  }
});
</script>

<template>
  <div class="relative flex-1">
    <BaseTitle class="text-start" text1="Dashboard" underline-color="none" />
    <div class="grid grid-cols-2 gap-4 py-10 text-lg">
      <div class="border-2 p-8">
        <div class="flex">
          <div class="flex flex-col items-center justify-center gap-2">
            <div class="text-6xl">
              <span class="fa-solid fa-users"></span>
            </div>
            <p>Users</p>
          </div>
          <div class="flex-1 pl-5">
            <div class="grid grid-cols-12 gap-3">
              <span class="col-span-2">Total: </span>
              <div class="col-span-10 flex items-center gap-2">
                <span
                  class="inline-block h-3 rounded-full bg-black transition-all duration-700 ease-out"
                  :style="getWidth(users?.total, users?.total)"></span>
                {{ users?.total || 0 }}
              </div>
            </div>

            <div class="grid grid-cols-12 gap-3">
              <span class="col-span-2">Verified:</span>
              <div class="col-span-10 flex items-center gap-2">
                <span
                  class="inline-block h-3 rounded-full bg-black transition-all duration-700 ease-out"
                  :style="getWidth(users?.verified, users?.total)"></span>
                {{ users?.verified || 0 }}
              </div>
            </div>
            <div class="grid grid-cols-12 gap-3">
              <span class="col-span-2">Unapproved:</span>
              <div class="col-span-10 flex items-center gap-2">
                <span
                  class="inline-block h-3 rounded-full bg-black transition-all duration-700 ease-out"
                  :style="getWidth(users?.unApproved, users?.total)"></span>
                {{ users?.unApproved || 0 }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border-2 p-5">
        <h1>Institutes</h1>
        <p>Total: {{ res?.institutes[0].total[0].count }}</p>
      </div>
      <div class="border-2 p-5">
        <h1>Classes</h1>
        <p>Total: {{ res?.classes[0].total[0].count }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
span {
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
