<script setup lang="ts">
import InstituteService from "@/services/InstituteService";
import type { AlertConfig } from "@/types/AlertConfig";
import { isAxiosError } from "axios";

import InstituteForm from "./InstituteForm.vue";

defineEmits<{
  (e: "close"): void;
}>();

const handleFormSubmit = async (
  data: any,
  callback: (a: AlertConfig) => void
) => {
  const { error } = await InstituteService.create(data);
  if (!error) {
    callback({
      type: "success",
      message: "Institute created successfully.",
    });
  } else {
    if (isAxiosError(error)) {
      callback({
        type: "error",
        message:
          error.response?.data.message || "An unexpected error occurred.",
      });
    }
  }
};
</script>
<template>
  <div
    class="fixed inset-0 z-50 grid bg-black/50 p-10 md:flex md:items-center md:justify-center">
    <div
      class="flex flex-col gap-4 overflow-y-auto border-2 bg-white p-5 md:w-full lg:w-4/5 2xl:w-1/2">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-black">Create Institute</h1>
        <button
          class="text-2xl opacity-80 hover:opacity-100"
          @click="$emit('close')">
          <span class="fa-solid fa-xmark"></span>
        </button>
      </div>
      <div class="grid flex-1 px-2">
        <InstituteForm @submit="handleFormSubmit" />
      </div>
    </div>
  </div>
</template>
