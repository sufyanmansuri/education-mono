<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";

import userService from "@/services/UserService";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";
import { pick } from "@/utils/pick";
import { useQueryStore } from "@/stores/useQueryStore";
import { computed } from "vue";
import { omit } from "@/utils/omit";
import { useAuthStore } from "@/stores/useAuthStore";

import AlertBox from "../base/AlertBox.vue";
import BaseTitle from "../base/BaseTitle.vue";
import FormField from "../base/FormField.vue";
import FormSelect from "../base/FormSelect.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";
import SelectInstitute from "../SelectInstitute.vue";

const props = defineProps<{
  id: string;
}>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const { auth } = useAuthStore();

const initialForm = {
  title: "",
  firstName: "",
  lastName: "",
  email: "",
  institute: "",
  role: "",
};

const form = ref({ ...initialForm });
const original = ref();
const titles = ref<string[]>();
const state = ref<"fetching" | "idle" | "error" | "success">("fetching");
const alertConfig = ref<AlertConfig>();

const isDisabled = computed(
  () => JSON.stringify(form.value) === JSON.stringify(original.value)
);
const showForm = computed(
  () => state.value !== "success" && state.value !== "fetching"
);
const roles = computed(() => {
  if (auth.value.user?.role === "super-admin") {
    return ["super-admin", "institute-admin", "teacher"];
  } else return ["institute-admin", "teacher"];
});

const { query } = useQueryStore();

const v = useVuelidate(
  {
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
    institute: {
      requiredIf: helpers.withMessage(
        "Institute is required.",
        (value: string) => {
          if (form.value.role === "super-admin") {
            if (value !== "") {
              return false;
            }
          } else {
            if (!value) {
              return false;
            }
          }
          return true;
        }
      ),
    },
    role: {
      required: helpers.withMessage("Role is required", required),
    },
  },
  form
);

const onSubmit = async () => {
  const dirtyFields = Object.keys(v.value).filter((key) => {
    if (
      Object.keys(initialForm).includes(key) &&
      (form.value as any)[key] !== original.value[key]
    ) {
      return v.value[key].$dirty;
    }
  });
  if (!dirtyFields.length) {
    alertConfig.value = {
      type: "warning",
      message: "Change at least one field to update.",
    };
    return;
  }
  if (v.value.$invalid) {
    return;
  }

  const updated = pick(dirtyFields, form.value);
  state.value = "fetching";
  const { error } = await userService.update(props.id, updated);
  if (error) {
    state.value = "error";
    if (isAxiosError(error)) {
      alertConfig.value = {
        type: "error",
        message:
          error.response?.data.message || "An unexpected error occurred.",
      };
    }
  } else {
    state.value = "success";
    alertConfig.value = {
      type: "success",
      message: "User updated successfully.",
    };
  }
};

const onReset = () => {
  form.value = { ...original.value };
  v.value.$reset();
  alertConfig.value = undefined;
};

const fetchUserData = async () => {
  const { data, error } = await userService.getById(props.id);
  if (error) {
    console.log(error);
  } else {
    original.value = omit(
      ["createdAt", "updatedAt", "approved", "verified", "__v", "_id"],
      data
    ) as typeof form.value;
    form.value = { ...original.value };
    state.value = "idle";
  }
};

const fetchTitles = async () => {
  const { data, error } = await userService.getTitles();
  if (error) {
    alert("An error occurred while fetching titles.");
    console.log(error);
  } else {
    titles.value = data;
  }
};

const handleConfirm = () => {
  emit("close");
  query.value.users.fetch = true;
};

onMounted(fetchUserData);
onMounted(fetchTitles);

// Remove institute if role is super-admin
const handleRoleChange = (role?: string) => {
  if (role === "super-admin") {
    form.value.institute = "";
    v.value.institute.$touch();
  } else {
    form.value.institute = original.value.institute;
  }
  if (v.value.institute.$invalid) {
    v.value.institute.$touch();
  }
};

const handleResetPassword = async () => {
  state.value = "fetching";
  const { error } = await userService.resetPassword(original.value.email);
  if (!error) {
    alertConfig.value = {
      type: "success",
      message:
        "Request submitted successfully. An email will be sent to the user to reset password.",
    };
  } else {
    if (isAxiosError(error)) {
      alertConfig.value = {
        type: "error",
        message:
          error.response?.data.message || "An unexpected error occurred.",
      };
    }
  }
  state.value = "idle";
};
</script>

<template>
  <div
    class="fixed inset-0 z-40 grid overflow-y-auto bg-black/50 p-5 md:flex md:items-center md:justify-center">
    <div class="w-full space-y-4 border-2 bg-white p-5 md:w-2/3 lg:w-1/2">
      <div class="flex items-center justify-between">
        <BaseTitle text1="Edit " text2="user" underline-color="yellow" />
        <button
          class="opacity-75 transition hover:opacity-100"
          @click="$emit('close')">
          <span class="fa-solid fa-xl fa-close"></span>
        </button>
      </div>
      <div class="relative" :class="{ 'h-96': state === 'fetching' }">
        <AlertBox :message="alertConfig" />
        <form
          @submit.prevent="onSubmit"
          v-if="showForm"
          @reset.prevent="onReset">
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
              v-model="v.firstName.$model"
              :field="v.firstName"
              label="First name"
              placeholder="John" />
            <FormField
              v-model="v.lastName.$model"
              :field="v.lastName"
              label="Last name"
              placeholder="Doe" />
            <FormSelect
              v-model="v.role.$model"
              :field="v.role"
              @update:model-value="handleRoleChange"
              label="Role"
              placeholder="Select role">
              <option v-for="role in roles" :key="role" :value="role">
                {{ role }}
              </option>
            </FormSelect>
            <SelectInstitute
              v-if="form?.role !== 'super-admin'"
              v-model="v.institute.$model"
              :disabled="auth.user?.role !== 'super-admin'"
              :field="v.institute" />
          </div>
          <div class="flex items-center justify-between">
            <div class="grid gap-2 md:grid-cols-2">
              <button
                class="border-2 px-4 py-2 transition disabled:opacity-50"
                type="reset"
                :disabled="state === 'fetching'">
                Reset
              </button>
              <button
                class="border-2 bg-yellow/80 px-4 py-2 transition hover:bg-yellow disabled:opacity-50"
                type="button"
                @click="handleResetPassword">
                Reset Password
              </button>
            </div>
            <button
              class="border-2 bg-green/50 px-4 py-2 transition enabled:hover:bg-green/60 disabled:opacity-50"
              type="submit"
              :disabled="isDisabled || state === 'fetching'">
              Submit
            </button>
          </div>
        </form>
        <Transition>
          <div
            class="absolute inset-0 flex items-center justify-center bg-white pb-5 text-5xl"
            v-if="state === 'fetching'">
            <SpinnerIcon />
          </div>
        </Transition>
      </div>
      <div v-if="state === 'success'" class="mt-10 text-right">
        <button
          @click="handleConfirm"
          class="border-2 bg-green/50 px-8 py-2 transition hover:bg-green/60">
          Ok
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
