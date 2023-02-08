<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";

import userService from "@/services/UserService";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";
import { omit } from "@/utils/omit";

import AlertBox from "../base/AlertBox.vue";
import UserForm from "./UserForm.vue";

const props = defineProps<{
  id: string;
}>();
const emit = defineEmits<{
  (e: "close", state: "success" | undefined): void;
}>();

const original = ref();
const mutated = ref(false);
const alertConfig = ref<AlertConfig>();

const handleSubmit = async (data: any, callback: (a: AlertConfig) => void) => {
  const { error } = await userService.update(props.id, data);
  if (error) {
    if (isAxiosError(error)) {
      callback({
        type: "error",
        message:
          error.response?.data.message || "An unexpected error occurred.",
      });
    }
  } else {
    alertConfig.value = {
      type: "success",
      message: "User updated successfully.",
    };
    original.value = undefined;
  }
};

const handleResetPassword = async (callback: (a: AlertConfig) => void) => {
  const { error } = await userService.resetPassword(original.value.email);
  if (!error) {
    callback({
      type: "success",
      message:
        "Request submitted successfully. An email will be sent to the user to reset password.",
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

const fetchUserData = async () => {
  alertConfig.value = { type: "info", message: "Loading user details..." };

  const { data, error } = await userService.getById(props.id);
  if (error) {
    alertConfig.value = {
      type: "error",
      message: "An error occurred while fetching user details.",
    };
  } else {
    original.value = omit(
      ["createdAt", "updatedAt", "approved", "verified", "__v", "_id"],
      data
    );
    alertConfig.value = undefined;
  }
};

onMounted(fetchUserData);

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
    class="fixed inset-0 z-50 grid bg-black/50 p-10 md:flex md:items-center md:justify-center">
    <div
      class="flex flex-col gap-4 border-2 bg-white p-5 md:w-full lg:w-4/5 2xl:w-1/2">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-black">Update user</h1>
        <button
          class="text-2xl opacity-80 hover:opacity-100"
          @click="handleClose">
          <span class="fa-solid fa-xmark"></span>
        </button>
      </div>
      <AlertBox :message="alertConfig" />
      <div class="grid flex-1 px-2">
        <UserForm
          @submit="handleSubmit"
          :default-values="{ ...original }"
          @reset-password="handleResetPassword"
          v-if="original" />

        <div class="text-right" v-if="alertConfig?.type === 'success'">
          <button @click="$emit('close', 'success')" class="border-2 px-4 py-1">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
