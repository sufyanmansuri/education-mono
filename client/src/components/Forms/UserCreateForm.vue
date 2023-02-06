<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";

import { create } from "@/services/UserService";
import { isAxiosError } from "axios";
import { ref } from "vue";
import UserForm from "./UserForm.vue";

const emit = defineEmits<{
  (e: "close", state: "success" | undefined): void;
}>();

const state = ref<"idle" | "success" | "error" | "loading">("idle");
const mutated = ref(false);

const handleFormSubmit = async (
  data: any,
  callback: (a: AlertConfig) => void
) => {
  if (data.institute === "") delete data.institute;

  const { error } = await create(data);
  if (error) {
    if (isAxiosError(error)) {
      callback({
        type: "error",
        message:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  } else {
    mutated.value = true;
    callback({
      message: "User created successfully.",
      type: "success",
    });
  }
};

const handleClose = () => {
  if (mutated.value) {
    emit("close", "success");
  } else {
    emit("close", undefined);
  }
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
    <div class="w-full space-y-4 border-2 bg-white p-5 md:w-2/3 lg:w-1/2">
      <div class="mb-10 flex items-center justify-between">
        <h1 class="text-3xl font-black">Create user</h1>
        <button
          class="opacity-75 transition hover:opacity-100"
          @click="handleClose">
          <span class="fa-solid fa-xl fa-close"></span>
        </button>
      </div>
      <UserForm @submit="handleFormSubmit" />
      <div class="flex justify-end" v-if="state === 'success'">
        <button
          class="border-2 bg-green/50 px-4 py-2 hover:bg-green/60"
          @click="handleClose">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
