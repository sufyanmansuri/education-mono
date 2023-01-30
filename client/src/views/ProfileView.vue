<script setup lang="ts">
import AlertBox from "@/components/base/AlertBox.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import { getById as getInstituteById } from "@/services/InstituteService";
import { useUserStore } from "@/stores/useUserStore";
import type { AlertConfig } from "@/types/AlertConfig";
import { humanize } from "@/utils/humanize";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";

const { state: auth } = useUserStore();

const institute = ref();
const isEditing = ref(false);
const alertConfig = ref<AlertConfig>();

onMounted(async () => {
  if (auth.value.user?.role !== "super-admin" && auth.value.user?.institute) {
    const { data, error } = await getInstituteById(auth.value.user?.institute);
    if (!error) {
      institute.value = data;
    } else {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message || "An unexpected error occurred.",
        };
      }
    }
  }
});
</script>
<template>
  <div class="container relative mt-5 flex flex-col items-start gap-4">
    <BaseTitle text1="Profile" underline-color="none" />
    <AlertBox />
    <div
      class="relative h-56 w-full border-2 bg-white p-5 transition-all aria-expanded:inset-0 aria-expanded:h-96"
      :aria-expanded="isEditing">
      <div class="flex justify-between gap-4">
        <img
          :src="`https://api.dicebear.com/5.x/avataaars-neutral/svg?backgroundColor=edb98a&backgroundType=gradientLinear&seed=${auth.user?.email}`"
          alt="avatar"
          class="h-24 object-contain" />
        <div class="text-right">
          <h1 class="text-3xl">
            {{ auth.user?.title }}
            {{ auth.user?.firstName + " " + auth.user?.lastName }}
            <p class="text-lg">{{ auth.user?.email }}</p>
          </h1>
          <p>{{ humanize(auth.user?.role || "", true) }}</p>
          <p v-if="institute">
            {{ `${institute.name}, ${institute.address.localAuthority}` }}
          </p>
        </div>
      </div>
      <div class="mt-3 flex justify-end gap-2">
        <button class="border-2 bg-yellow px-4 py-1">Reset Password</button>
        <button class="border-2 px-4 py-1" @click="isEditing = !isEditing">
          Edit
          <span class="fa-solid fa-edit"></span>
        </button>
      </div>
    </div>
  </div>
</template>
