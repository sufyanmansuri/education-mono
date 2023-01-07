<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import { ref, watch } from "vue";
import BaseButton from "./base/BaseButton.vue";
import FormField from "./base/FormField.vue";
import { getInstituteList } from "@/services/institutes";
import { getUserTitles, register } from "@/services/users";

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

const { data: institutes } = getInstituteList();
const { data: titles } = getUserTitles();

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
        v-if="serverMessage.message">
        <li class="flex items-center">
          <span
            class="fa-solid fa-xs mx-1"
            :class="{
              'fa-triangle-exclamation': serverMessage.type === 'error',
              'fa-circle-check': serverMessage.type === 'success',
            }"></span
          >{{ serverMessage.message }}
        </li>
      </ul>
      <div class="grid grid-cols-1 gap-2">
        <div>
          <label>
            <div>Title</div>
            <select
              class="h-9 w-full border-2 bg-white px-2 py-1 outline-none"
              v-model="registerForm.title"
              :class="{
                'border-red': v.title.$dirty && v.title.$invalid,
                'border-green': v.title.$dirty && !v.title.$invalid,
              }">
              <option value="" disabled selected>Select title</option>
              <option v-for="title of titles" :value="title" :key="title">
                {{ title }}
              </option>
            </select>
          </label>
          <template v-if="v.title.$dirty && v.title.$invalid">
            <p
              v-for="error of v.title.$errors"
              :key="error.$uid"
              class="text-red">
              {{ error.$message }}
            </p>
          </template>
        </div>
        <div class="flex flex-col gap-3 lg:flex-row">
          <FormField
            :field="v.firstName"
            label="First name"
            placeholder="John"
            :autofocus="true" />
          <FormField :field="v.lastName" label="Last name" placeholder="Doe" />
        </div>
        <FormField :field="v.email" label="Email" placeholder="Doe" />
        <div>
          <label>
            <div>Institute</div>
            <select
              class="h-9 w-full border-2 bg-white px-2 py-1 outline-none"
              v-model="registerForm.institute"
              :class="{
                'border-red': v.institute.$dirty && v.institute.$invalid,
                'border-green': v.institute.$dirty && !v.institute.$invalid,
              }">
              <option disabled selected value="">Select Institute</option>
              <option
                v-for="institute of institutes"
                :value="institute._id"
                :key="institute._id">
                {{ institute.name }}
              </option>
            </select>
          </label>
          <template v-if="v.institute.$dirty && v.institute.$invalid">
            <p
              v-for="error of v.institute.$errors"
              :key="error.$uid"
              class="text-red">
              {{ error.$message }}
            </p>
          </template>
        </div>
        <BaseButton
          type="submit"
          class="z-20 mt-3"
          :animated="!isSubmitting"
          :disabled="isSubmitting">
          <span
            v-if="isSubmitting"
            class="fa-solid fa-spinner fa-spin-pulse"></span>
          <span v-else>Submit</span>
        </BaseButton>
      </div>
    </div>
  </form>
</template>
