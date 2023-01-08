<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import { ref, watch } from "vue";
import BaseButton from "./base/BaseButton.vue";
import FormField from "./base/FormField.vue";
import { register } from "@/services/users";
import { useQuery } from "@/hooks/useQuery";
import FormSelect from "./base/FormSelect.vue";

const registerForm = ref({
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  institute: "",
});
const isSubmitting = ref(false);
const serverMessage = ref<{ type?: "success" | "error"; message?: string }>({});

const v = useVuelidate(
  {
    firstName: {
      required: helpers.withMessage("First name is required", required),
      minLength: minLength(2),
    },
    lastName: {
      required: helpers.withMessage("Last name is required.", required),
      minLength: minLength(2),
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
  registerForm,
  { $rewardEarly: true }
);

const { titles } = useQuery("titles", { url: "/api/titles" });
const { institutes } = useQuery("institutes", { url: "/api/institutes/list" });

// Handle register
async function handleRegister(e: Event) {
  e.preventDefault();

  serverMessage.value = {};
  const isFormValid = await v.value.$validate();
  if (!isFormValid) return;

  isSubmitting.value = true;
  const { status, error } = register(registerForm.value);

  watch(status, () => {
    if (status.value === "error") {
      serverMessage.value = {
        type: "error",
        message: error.value?.error.message,
      };
    }
    if (status.value === "success") {
      serverMessage.value = {
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
  });
}
</script>

<template>
  <form @submit="handleRegister">
    <div>
      <ul
        class="mb-3 mt-5 border-2 p-2"
        :class="{
          'bg-green/50': serverMessage.type === 'success',
          'bg-red': serverMessage.type === 'error',
        }"
        v-if="serverMessage.message"
      >
        <li class="flex items-center">
          <span
            class="fa-solid fa-xs mx-1"
            :class="{
              'fa-triangle-exclamation': serverMessage.type === 'error',
              'fa-circle-check': serverMessage.type === 'success',
            }"
          ></span
          >{{ serverMessage.message }}
        </li>
      </ul>
      <div class="grid grid-cols-1 gap-2">
        <FormSelect
          v-model="v.title.$model"
          :field="v.title"
          placeholder="Select title"
          label="Title"
        >
          <option v-for="title of titles.data" :value="title" :key="title">
            {{ title }}
          </option>
        </FormSelect>
        <div class="flex flex-col gap-3 lg:flex-row">
          <FormField
            v-model="v.firstName.$model"
            label="First name"
            placeholder="John"
            :autofocus="true"
            :field="v.firstName"
          />
          <FormField
            v-model="v.lastName.$model"
            label="Last name"
            placeholder="Doe"
            :field="v.lastName"
          />
        </div>
        <FormField
          v-model="v.email.$model"
          :field="v.email"
          label="Email"
          placeholder="Doe"
        />
        <FormSelect
          :field="v.institute"
          v-model="v.institute.$model"
          label="Institute"
          placeholder="Select Institute"
        >
          <option
            v-for="institute of institutes.data"
            :value="institute._id"
            :key="institute._id"
          >
            {{ institute.name }}
          </option>
        </FormSelect>
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
