<script setup lang="ts">
import AlertBox from "@/components/base/AlertBox.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import FormField from "@/components/base/FormField.vue";
import type { AlertConfig } from "@/types/AlertConfig";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import axios, { isAxiosError } from "axios";
import { ref } from "vue";

const form = ref({
  email: "",
});
const isLoading = ref(false);
const alertConfig = ref<AlertConfig>({
  type: "warning",
  message:
    "An email will be sent to this address with a link to reset password.",
});

const v = useVuelidate(
  {
    email: {
      required: helpers.withMessage("Email is required.", required),
      email: helpers.withMessage("Email is invalid", email),
    },
  },
  form
);

// Handle submit
async function handleSubmit() {
  const isFormValid = await v.value.$validate();
  if (!isFormValid) return;

  alertConfig.value = { type: "info", message: "Loading..." };
  isLoading.value = true;
  try {
    const res = await axios.post("/api/users/reset-password", form.value);
    if (res.status === 200) {
      alertConfig.value = {
        type: "success",
        message:
          "Request to reset password submitted successfully. Check your email for further process.",
      };
    }
  } catch (error) {
    if (isAxiosError(error)) {
      alertConfig.value = {
        type: "error",
        message: error.response?.data.message,
      };
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="container relative flex items-center justify-center xl:justify-end xl:px-56">
    <img
      src="/forgot-password.svg"
      alt="Login"
      class="absolute left-48 -z-50 hidden w-[calc(100vw/2.5)] object-contain xl:block" />
    <div class="theme theme-yellow relative lg:w-3/5 xl:w-2/5">
      <h1 class="mb-5 text-center text-5xl font-black">
        Reset
        <span
          class="font-outline-2 text-transparent underline decoration-yellow decoration-wavy decoration-2 underline-offset-2"
          >Password</span
        >
      </h1>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4">
          <FormField
            accent="yellow"
            :field="v.email"
            label="Email"
            placeholder="example@abc.com"
            v-model="v.email.$model" />
          <BaseButton
            type="submit"
            :disabled="isLoading"
            :animated="!isLoading">
            <span
              v-if="isLoading"
              class="fa-spinner fa-solid fa-spin-pulse"></span>
            <span v-else>Submit</span>
          </BaseButton>
        </div>
      </form>
      <AlertBox :message="alertConfig" />
    </div>
  </div>
</template>
