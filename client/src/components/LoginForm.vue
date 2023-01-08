<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import BaseButton from "./base/BaseButton.vue";
import FormField from "./base/FormField.vue";
import { useUserStore } from "@/stores/useUserStore";
import axios, { isAxiosError } from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const loginForm = ref({
  email: "",
  password: "",
});
const serverError = ref("");
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
  serverError.value = "";

  try {
    // Set form state to submitting
    isSubmitting.value = true;

    const res = await axios.post("/api/users/login", loginForm.value);
    if (res.status === 200) {
      const { user } = res.data;
      login(user);
      router.push({ name: "dashboard" });
    }
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      serverError.value = error.response?.data.error.message;
      loginForm.value.password = "";
    } else {
      alert("Unexpected error occurred.");
    }
  } finally {
    // Reset form state
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form @submit="submit">
    <div>
      <ul class="mb-3 mt-5 border-2 bg-red p-2" v-if="serverError">
        <li class="flex items-center">
          <span class="fa-solid fa-triangle-exclamation fa-xs mx-1"></span
          >{{ serverError }}
        </li>
      </ul>
      <div class="grid grid-cols-1 gap-2">
        <FormField
          :field="v.email"
          label="Email"
          placeholder="example@abc.com"
          type="text"
          v-model="v.email.$model"
          :autofocus="true"
        />
        <FormField
          :field="v.password"
          v-model="v.password.$model"
          label="Password"
          placeholder="!@#$%^&*"
          type="password"
        />
        <BaseButton
          type="submit"
          class="z-20 mt-3"
          :animated="!isSubmitting"
          :disabled="isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="fa-solid fa-spinner fa-spin-pulse"
          ></span>
          <span v-else>Submit</span>
        </BaseButton>
      </div>
    </div>
  </form>
</template>
