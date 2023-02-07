<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseTitle from "../base/BaseTitle.vue";
import { get } from "@/services/DashboardService";
import { computed } from "vue";
import UsersWidget from "./UsersWidget.vue";
import RolesWidget from "./RolesWidget.vue";
import InstitutesWidget from "./InstitutesWidget.vue";
import ClassesWidget from "./ClassesWidget.vue";

type DashboardData = {
  users: [
    {
      total: [{ count: number }];
      "pending-approval": [{ count: number }];
      active: [{ count: number }];
      "pending-verification": [{ count: number }];
      teacher: [{ count: number }];
      "super-admin": [{ count: number }];
      "institute-admin": [{ count: number }];
    }
  ];
  institutes: [{ total: [{ count: number }] }];
  classes: [{ total: [{ count: number }] }];
};
const res = ref<DashboardData>();
const users = computed(() => {
  if (!res.value || !res.value.users) return undefined;
  const data = {
    total: res.value.users[0].total[0]?.count,
    active: res.value.users[0].active[0]?.count,
    "pending-verification":
      res.value.users[0]["pending-verification"][0]?.count,
    "pending-approval": res.value.users[0]["pending-approval"][0]?.count,
  };

  return data;
});
const roles = computed(() => {
  if (!res.value?.users) return undefined;
  return {
    superAdmin: res.value.users[0]["super-admin"][0]?.count,
    instituteAdmin: res.value.users[0]["institute-admin"][0]?.count,
    teacher: res.value.users[0]["teacher"][0]?.count,
  };
});

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
    <Transition>
      <div class="flex flex-col gap-4 py-5 text-lg xl:flex-row">
        <div class="order-1 flex flex-1 gap-4 xl:order-3 xl:flex-col">
          <Transition>
            <InstitutesWidget
              v-if="res?.institutes"
              :data="{ total: res.institutes[0]?.total[0].count }" />
          </Transition>
          <Transition>
            <ClassesWidget
              v-if="res?.classes"
              :data="{ total: res.classes[0].total[0].count }" />
          </Transition>
        </div>
        <UsersWidget
          v-if="users"
          :data="users"
          class="order-2 flex-1 xl:order-1" />
        <RolesWidget
          v-if="roles"
          :data="roles"
          class="order-3 flex-1 xl:order-2" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.7s cubic-bezier(0.4, 0.2, 0.1, 1);
}

.v-enter-from,
.v-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
</style>
