<script lang="ts" setup>
import type { AlertConfig } from "@/types/AlertConfig";
import InstituteService from "@/services/InstituteService";
import { omit } from "@/utils/omit";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";
import AlertBox from "../base/AlertBox.vue";
import InstituteForm from "./InstituteForm.vue";

const props = defineProps<{
  id: string;
}>();
defineEmits<{
  (e: "close", state: "success" | undefined): void;
}>();

const institute = ref();
const alertConfig = ref<AlertConfig>();

const handleFormSubmit = async (
  data: any,
  callback: (a: AlertConfig) => void
) => {
  const { error } = await InstituteService.updateById(props.id, data);
  if (!error) {
    alertConfig.value = {
      type: "success",
      message: "Institute updated successfully.",
    };
    institute.value = undefined;
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

onMounted(async () => {
  alertConfig.value = { type: "info", message: "Loading institute details..." };

  const { data, error } = await InstituteService.getById(props.id);
  if (!error) {
    institute.value = omit(["_id", "__v", "createdAt", "updatedAt"], data);
    alertConfig.value = undefined;
  } else {
    alertConfig.value = {
      type: "error",
      message: "An error occurred while fetching institute details.",
    };
  }
});
</script>
<template>
  <div
    class="fixed inset-0 z-50 grid bg-black/50 p-10 md:flex md:items-center md:justify-center">
    <div
      class="flex flex-col gap-4 overflow-y-auto border-2 bg-white p-5 md:w-full lg:w-4/5 2xl:w-1/2">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-black">Update Institute</h1>
        <button
          class="text-2xl opacity-80 hover:opacity-100"
          @click="$emit('close')">
          <span class="fa-solid fa-xmark"></span>
        </button>
      </div>
      <AlertBox :message="alertConfig" />
      <div class="grid flex-1 px-2">
        <InstituteForm
          @submit="handleFormSubmit"
          :default-values="institute"
          v-if="institute" />

        <div class="text-right" v-if="alertConfig?.type === 'success'">
          <button @click="$emit('close', 'success')" class="border-2 px-4 py-1">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
