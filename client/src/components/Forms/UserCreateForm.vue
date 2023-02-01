<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";

import { create, getTitles } from "@/services/UserService";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { isAxiosError } from "axios";
import { onMounted, ref, watch } from "vue";
import AlertBox from "../base/AlertBox.vue";
import BaseTitle from "../base/BaseTitle.vue";
import FormField from "../base/FormField.vue";
import FormSelect from "../base/FormSelect.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";
import SelectInstitute from "../SelectInstitute.vue";
import { computed } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";

defineEmits<{
  (e: "close", state: "success" | undefined): void;
}>();

const { auth } = useAuthStore();

const state = ref<"idle" | "success" | "error" | "loading">("idle");
const alertConfig = ref<AlertConfig>();
const initialUser = {
  title: "",
  email: "",
  role: "",
  firstName: "",
  lastName: "",
  institute: auth.value.user?.institute || "",
};
const user = ref({ ...initialUser });
const roles = computed(() => {
  if (auth.value.user?.role === "super-admin") {
    return ["super-admin", "institute-admin", "teacher"];
  } else return ["institute-admin", "teacher"];
});
const titles = ref<string[]>();

const rules = computed(() => {
  const initialRules: any = {
    firstName: {
      required: helpers.withMessage("First name is required.", required),
    },
    lastName: {
      required: helpers.withMessage("Last name is required.", required),
    },
    email: {
      required: helpers.withMessage("Email is required.", required),
      email: helpers.withMessage("Email is invalid.", email),
    },
    title: {
      required: helpers.withMessage("Title is required.", required),
    },
    role: {
      required: helpers.withMessage("Role is required", required),
    },
    institute: {
      required: helpers.withMessage("Institute is required", required),
    },
  };

  // Remove institute if role is super-admin
  if (user.value.role === "super-admin") {
    delete initialRules.institute.required;
  }

  return initialRules;
});

const v = useVuelidate(rules, user);

const onSubmit = async () => {
  const isValid = await v.value.$validate();
  if (!isValid) return;

  state.value = "loading";
  alertConfig.value = undefined;

  const data: any = { ...user.value };
  if (data.institute === "") delete data.institute;

  const { error } = await create(data);
  if (error) {
    state.value = "error";
    console.log(error);
    if (isAxiosError(error)) {
      console.log(error.response?.data);
      alertConfig.value = {
        type: "error",
        message:
          error.response?.data?.message || "An unexpected error occurred.",
      };
    } else {
      alertConfig.value = {
        type: "error",
        message: "An unexpected error occurred.",
      };
    }
  } else {
    user.value = { ...initialUser };
    v.value.$reset();
    state.value = "success";
    alertConfig.value = {
      message: "User created successfully.",
      type: "success",
    };
  }
};

const fetchTitles = async () => {
  const { data, error } = await getTitles();
  if (error) {
    alert("An error occurred while fetching titles.");
    console.log(error);
  } else {
    titles.value = data;
  }
};
onMounted(fetchTitles);
watch(
  () => user.value.role,
  () => {
    if (user.value.role === "super-admin") {
      user.value.institute = "";
    }
  }
);
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
    <div class="w-full space-y-4 border-2 bg-white p-5 md:w-2/3 lg:w-1/2">
      <div class="mb-10 flex items-center justify-between">
        <BaseTitle text1="Create " text2="user" underline-color="yellow" />
        <button
          class="opacity-75 transition hover:opacity-100"
          @click="$emit('close')">
          <span class="fa-solid fa-xl fa-close"></span>
        </button>
      </div>
      <AlertBox :message="alertConfig" />
      <form
        @submit.prevent="onSubmit"
        v-if="state !== 'success'"
        class="relative">
        <div class="mb-10 grid gap-4 md:grid-cols-2">
          <FormField
            v-model="v.email.$model"
            :field="v.email"
            placeholder="john@example.com"
            label="Email" />
          <FormSelect
            v-model="v.title.$model"
            :field="v.title"
            label="Title"
            placeholder="Select title">
            <option v-for="title in titles" :key="title" :value="title">
              {{ title }}
            </option>
          </FormSelect>
          <FormField
            v-model.trim="v.firstName.$model"
            :field="v.firstName"
            label="First name"
            placeholder="John" />
          <FormField
            v-model.trim="v.lastName.$model"
            :field="v.lastName"
            label="Last name"
            placeholder="Doe" />
          <FormSelect
            v-model="v.role.$model"
            :field="v.role"
            label="Role"
            placeholder="Select role">
            <option v-for="role in roles" :key="role" :value="role">
              {{ role }}
            </option>
          </FormSelect>
          <SelectInstitute
            v-if="user.role !== 'super-admin'"
            v-model="v.institute.$model"
            :disabled="auth.user?.role !== 'super-admin'"
            :field="v.institute" />
        </div>
        <div class="flex justify-end">
          <button
            class="border-2 bg-green/50 px-4 py-2 transition hover:bg-green/60 disabled:opacity-50"
            :disabled="state === 'loading'">
            Submit
          </button>
        </div>
        <div
          class="absolute inset-0 flex items-center justify-center bg-opaque pb-5 text-5xl"
          v-if="state === 'loading'">
          <SpinnerIcon />
        </div>
      </form>
      <div class="flex justify-end" v-if="state === 'success'">
        <button
          class="border-2 bg-green/50 px-4 py-2 hover:bg-green/60"
          @click="$emit('close', 'success')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
