<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { loginUser } from "@/services/UserService";
import { isAxiosError } from "axios";

import BaseButton from "../base/BaseButton.vue";
import FormField from "../base/FormField.vue";
import AlertBox from "../base/AlertBox.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";

const loginForm = ref({
  email: "",
  password: "",
});
const alertConfig = ref<AlertConfig>();
const isSubmitting = ref(false);

const { login } = useUserStore();
const router = useRouter();
const v = useVuelidate(
  {
    email: {
      required: helpers.withMessage("Email is required.", required),
      email: helpers.withMessage("Email is invalid.", email),
    },
    password: {
      required: helpers.withMessage("Password is required.", required),
    },
  },
  loginForm
);

async function submit(e: Event) {
  e.preventDefault();
  const isFormValid = await v.value.$validate();
  if (!isFormValid) return;

  // Clear server errors
  alertConfig.value = {};

  isSubmitting.value = true;
  const { data, error } = await loginUser(loginForm.value);

  if (error) {
    if (isAxiosError(error)) {
      alertConfig.value = {
        type: "error",
        message:
          error.response?.data.error.message || error.response?.data.message,
      };

      // Reset form
      loginForm.value.password = "";
      v.value.$reset();
    } else {
      alert("Unexpected error occurred.");
      console.log(error);
    }
  } else {
    login(data.user);
    router.push({ name: "dashboard" });
  }
  isSubmitting.value = false;
}
</script>

<template>
  <form @submit="submit">
    <div>
      <AlertBox :message="alertConfig" />
      <div class="grid grid-cols-1 gap-4">
        <FormField
          :field="v.email"
          label="Email"
          placeholder="example@abc.com"
          type="text"
          accent="yellow"
          v-model="v.email.$model"
          :autofocus="true" />
        <FormField
          :field="v.password"
          v-model="v.password.$model"
          label="Password"
          accent="yellow"
          placeholder="!@#$%^&*"
          type="password" />
        <div class="grid gap-1">
          <div>
            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="text-right decoration-yellow transition hover:underline hover:decoration-2"
              >Forgot password?</RouterLink
            >
          </div>
          <BaseButton
            type="submit"
            class="z-20"
            color="yellow"
            :animated="!isSubmitting"
            :disabled="isSubmitting">
            <SpinnerIcon v-if="isSubmitting" />
            <span v-else>Submit</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </form>
</template>
