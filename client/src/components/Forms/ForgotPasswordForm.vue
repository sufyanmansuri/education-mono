<script lang="ts" setup>
import type { AlertConfig } from "@/types/AlertConfig";

import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { resetPassword } from "@/services/UserService";
import { isAxiosError } from "axios";

import FormField from "../base/FormField.vue";
import BaseButton from "../base/BaseButton.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";

const emit = defineEmits<{
  (e: "change", alert: AlertConfig): void;
}>();

const form = ref({
  email: "",
});
const isLoading = ref(false);

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

  isLoading.value = true;
  emit("change", { type: "info", message: "Loading..." });

  const { error } = await resetPassword(form.value.email);

  if (error) {
    if (isAxiosError(error)) {
      emit("change", {
        type: "error",
        message: error.response?.data.message,
      });
    } else {
      alert("Unexpected error occurred.");
      console.log(error);
    }
  } else {
    emit("change", {
      type: "success",
      message:
        "Request submitted successfully. Check your email for further process.",
    });

    // Reset form
    v.value.$reset();
    form.value.email = "";
  }

  isLoading.value = false;
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid gap-4">
      <FormField
        accent="yellow"
        :field="v.email"
        label="Email"
        placeholder="example@abc.com"
        v-model="v.email.$model" />
      <BaseButton type="submit" :disabled="isLoading" :animated="!isLoading">
        <SpinnerIcon v-if="isLoading" />
        <span v-else>Submit</span>
      </BaseButton>
    </div>
  </form>
</template>
