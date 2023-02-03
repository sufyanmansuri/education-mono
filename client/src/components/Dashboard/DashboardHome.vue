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
      approved: [{ count: number }];
      verified: [{ count: number }];
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
  if (!res.value) return undefined;
  const user = {
    total: res.value.users[0].total[0].count,
    approved: res.value.users[0].approved[0].count,
    verified: res.value.users[0].verified[0].count,
    unVerified:
      res.value.users[0].total[0].count - res.value.users[0].verified[0].count,
    unApproved:
      res.value.users[0].verified[0].count -
      res.value.users[0].approved[0].count,
  };

  return user;
});
const roles = computed(() => {
  if (!res.value) return undefined;
  return {
    superAdmin: res.value.users[0]["super-admin"][0].count,
    instituteAdmin: res.value.users[0]["institute-admin"][0].count,
    teacher: res.value.users[0]["teacher"][0].count,
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
      <div class="grid gap-4 py-5 text-lg xl:grid-cols-3">
        <UsersWidget :data="users" />
        <RolesWidget :data="roles" />
        <div class="flex flex-col gap-2">
          <Transition>
            <InstitutesWidget
              v-if="res?.institutes[0].total[0].count"
              :data="{ total: res.institutes[0].total[0].count }" />
          </Transition>
          <Transition>
            <ClassesWidget
              v-if="res?.classes[0].total[0].count"
              :data="{ total: res.classes[0].total[0].count }" />
          </Transition>
        </div>
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
