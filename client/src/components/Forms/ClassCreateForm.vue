<script setup lang="ts">
import ClassService from "@/services/ClassService";
import type { AlertConfig } from "@/types/AlertConfig";
import { isAxiosError } from "axios";
import ClassForm from "./ClassForm.vue";

defineEmits<{
  (e: "close"): void;
}>();

const handleFormSubmit = async (
  data: any,
  callback: (a: AlertConfig) => void
) => {
  const { error } = await ClassService.create(data);
  if (!error) {
    callback({
      type: "success",
      message: "Class created successfully.",
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
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-10">
    <div
      class="flex flex-col gap-4 overflow-y-auto border-2 bg-white p-5 md:w-full lg:w-2/3 xl:w-1/2">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-black">Create Class</h1>
        <button
          class="text-2xl opacity-80 hover:opacity-100"
          @click="$emit('close')">
          <span class="fa-solid fa-xmark"></span>
        </button>
      </div>
      <div class="grid flex-1 px-2">
        <ClassForm @submit="handleFormSubmit" />
      </div>
    </div>
  </div>
</template>
