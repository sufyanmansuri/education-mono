<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";

import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import { isAxiosError } from "axios";
import { useQuery } from "@/hooks/useQuery";

import BaseButton from "../base/BaseButton.vue";
import FormField from "../base/FormField.vue";
import FormSelect from "../base/FormSelect.vue";
import AlertBox from "../base/AlertBox.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";
import { register } from "@/services/UserService";

const registerForm = ref({
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  institute: "",
});
const isSubmitting = ref(false);
const alertConfig = ref<AlertConfig>({});

const v = useVuelidate(
  {
    firstName: {
      required: helpers.withMessage("First name is required", required),
      minLength: helpers.withMessage(
        "Should contain two characters",
        minLength(2)
      ),
    },
    lastName: {
      required: helpers.withMessage("Last name is required.", required),
      minLength: helpers.withMessage(
        "Should contain two characters",
        minLength(2)
      ),
    },
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage("Email is invalid", email),
    },
    title: {
      required: helpers.withMessage("Title is required.", required),
    },
    institute: {
      required: helpers.withMessage("Institute is required.", required),
    },
  },
  registerForm
);

const { titles } = useQuery("titles", { url: "/api/titles" });
const { institutes } = useQuery("institutes", { url: "/api/institutes/list" });

// Handle register
async function handleRegister() {
  alertConfig.value = {};
  const isFormValid = await v.value.$validate();
  if (!isFormValid) return;

  isSubmitting.value = true;

  const { error } = await register(registerForm.value);

  if (error) {
    if (isAxiosError(error)) {
      alertConfig.value = {
        type: "error",
        message: error.response?.data.message,
      };
    }
  } else {
    alertConfig.value = {
      type: "success",
      message: "Account registered. Check your email to verify.",
    };
    registerForm.value = {
      email: "",
      firstName: "",
      institute: "",
      lastName: "",
      title: "",
    };
    v.value.$reset();
  }

  isSubmitting.value = false;
}
</script>

<template>
  <form @submit.prevent="handleRegister">
    <div>
      <AlertBox :message="alertConfig" />
      <div class="grid grid-cols-1 gap-4">
        <FormSelect
          v-model="v.title.$model"
          :field="v.title"
          placeholder="Select title"
          accent="blue"
          autofocus
          label="Title">
          <option v-for="title of titles.data" :value="title" :key="title">
            {{ title }}
          </option>
        </FormSelect>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            v-model="v.firstName.$model"
            label="First name"
            accent="blue"
            placeholder="John"
            :field="v.firstName" />
          <FormField
            v-model="v.lastName.$model"
            label="Last name"
            accent="blue"
            placeholder="Doe"
            :field="v.lastName" />
        </div>
        <FormField
          v-model="v.email.$model"
          :field="v.email"
          accent="blue"
          label="Email"
          placeholder="john@example.com" />
        <FormSelect
          :field="v.institute"
          v-model="v.institute.$model"
          label="Institute"
          accent="blue"
          placeholder="Select Institute">
          <option
            v-for="institute of institutes.data"
            :value="institute._id"
            :key="institute._id">
            {{ institute.name }}
          </option>
        </FormSelect>
        <BaseButton
          type="submit"
          class="z-20 mt-3"
          :animated="!isSubmitting"
          :disabled="isSubmitting"
          color="blue">
          <SpinnerIcon v-if="isSubmitting" />
          <span v-else>Submit</span>
        </BaseButton>
      </div>
    </div>
  </form>
</template>