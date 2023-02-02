<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";
import type { User } from "@/types/User";
import { useAuthStore } from "@/stores/useAuthStore";
import { omit } from "@/utils/omit";
import { email, helpers, required } from "@vuelidate/validators";
import { isAxiosError } from "axios";
import { onMounted, ref, watch } from "vue";
import userService from "@/services/UserService";
import useVuelidate from "@vuelidate/core";
import AlertBox from "./base/AlertBox.vue";
import ValidationBox from "./ValidationBox.vue";
import SpinnerIcon from "./icons/SpinnerIcon.vue";

const { auth, login } = useAuthStore();

const alertConfig = ref<AlertConfig>();
const state = ref<"loading" | "idle" | "editing" | "submitting">("loading");
const isSame = ref(true);
const profile = ref(
  omit(["institute", "role"], { ...auth.value.user }) as User
);
const titles = ref();

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
  },
  profile as any
);

const handleFormReset = () => {
  state.value = "idle";
  profile.value = { ...(auth.value.user as User) };
  v.value.$reset();
};

const handleResetPassword = async () => {
  alertConfig.value = { type: "info", message: "Loading..." };

  const { error } = await userService.resetPassword(
    auth.value.user?.email as string
  );
  if (!error) {
    alertConfig.value = {
      type: "success",
      message:
        "Request submitted successfully. Check your inbox for further process.",
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
};

const handleFormSubmit = async () => {
  const isValid = await v.value.$validate();
  if (!isValid) return;

  state.value = "submitting";
  const { data, error } = await userService.updateProfile(profile.value);
  if (!error) {
    alertConfig.value = {
      type: "success",
      message: "Profile updated successfully.",
    };
    login(data);
    state.value = "idle";
  } else {
    if (isAxiosError(error)) {
      alertConfig.value = {
        type: "error",
        message:
          error.response?.data.message || "An unexpected error occurred.",
      };
    }
    state.value = "editing";
  }
};

watch(
  profile,
  () => {
    let isDirty = false;
    alertConfig.value = undefined;
    Object.keys(profile.value).forEach((key) => {
      if ((profile.value as any)[key] !== (auth.value.user as any)[key]) {
        isDirty = true;
      }
    });
    if (!isDirty) {
      v.value.$reset();
    }
    isSame.value = !isDirty;
  },
  { deep: true }
);
const fetchTitles = async () => {
  const { data, error } = await userService.getTitles();
  if (!error) {
    titles.value = data;
  } else {
    if (isAxiosError(error)) {
      alertConfig.value = {
        type: "error",
        message:
          error.response?.data.message ||
          "An error occurred while fetching titles.",
      };
    }
  }
};
onMounted(fetchTitles);
</script>
<template>
  <div
    class="theme theme-blue group relative flex min-h-[25rem] w-full flex-col border-2 bg-transparent p-0 shadow-green transition-all after:translate-x-0 after:translate-y-0 after:border-0 after:bg-gradient-to-r after:from-yellow after:to-green/50 md:grid md:grid-cols-6 md:after:bg-gradient-to-b"
    :aria-disabled="state !== 'editing'">
    <div
      class="relative h-20 border-b-2 bg-transparent md:h-full md:border-b-0 md:border-r-2">
      <img
        :src="`https://api.dicebear.com/5.x/thumbs/svg?seed=${auth.user?.email}`"
        alt="avatar"
        class="absolute top-full left-1/2 h-16 -translate-y-1/2 -translate-x-1/2 border-2 drop-shadow-xl md:top-1/2 md:left-full md:h-20" />
    </div>
    <form
      class="flex w-full flex-1 md:col-span-5"
      @reset.prevent="handleFormReset"
      @submit.prevent="handleFormSubmit">
      <div class="flex flex-1 flex-col bg-white p-3 pt-12 md:p-6 md:pl-16">
        <AlertBox :message="alertConfig" style="margin-top: 0" />
        <div class="flex flex-1 flex-col justify-between gap-4">
          <div class="grid gap-4 md:gap-6">
            <div class="flex gap-2">
              <select
                v-model="v.title.$model"
                class="border-2 bg-white px-2 py-1 opacity-100 outline-offset-2 outline-yellow drop-shadow transition-all disabled:border-black/50 disabled:drop-shadow-none"
                :disabled="state !== 'editing'">
                <option selected disabled value="">Select title</option>
                <option v-for="title in titles" :value="title" :key="title">
                  {{ title }}
                </option>
              </select>
              <input
                type="text"
                class="w-full border-2 bg-white px-2 py-1 outline-offset-2 outline-yellow drop-shadow transition-all disabled:border-black/50 disabled:drop-shadow-none"
                :disabled="state !== 'editing'"
                v-model="v.firstName.$model"
                placeholder="First name" />
              <input
                type="text"
                class="w-full border-2 bg-white px-2 py-1 outline-offset-2 outline-yellow drop-shadow transition-all disabled:border-black/50 disabled:drop-shadow-none"
                v-model="v.lastName.$model"
                :disabled="state !== 'editing'"
                placeholder="Last name" />
            </div>
            <input
              type="text"
              placeholder="Email"
              v-model="v.email.$model"
              class="w-full border-2 bg-white px-2 py-1 outline-offset-2 outline-yellow drop-shadow transition-all disabled:border-black/50 disabled:drop-shadow-none"
              :disabled="state !== 'editing'" />
            <select
              v-if="auth.user?.role"
              :value="auth.user.role"
              class="w-full cursor-not-allowed border-2 bg-white px-2 py-1 opacity-100 outline-offset-2 outline-yellow transition-all disabled:border-black/50 group-aria-disabled:drop-shadow-none"
              disabled>
              <option :value="auth.user.role">{{ auth.user.role }}</option>
            </select>
          </div>
          <ValidationBox :errors="v.$errors" :dirty="v.$anyDirty" />
          <div class="relative xl:justify-self-end">
            <TransitionGroup>
              <div
                v-if="state === 'editing' || state === 'submitting'"
                class="grid grid-cols-2 gap-2">
                <button class="border-2 px-2 py-1" type="reset">Cancel</button>
                <button
                  class="border-2 bg-green/50 px-2 py-1 enabled:hover:bg-green/60 disabled:opacity-70"
                  :disabled="
                    isSame || v.$errors.length > 0 || state === 'submitting'
                  ">
                  <SpinnerIcon v-if="state === 'submitting'" />
                  <span v-else> Submit</span>
                </button>
              </div>
              <div v-else class="grid grid-cols-2 gap-2">
                <button
                  class="border-2 px-2 py-1"
                  type="button"
                  @click="state = 'editing'">
                  Edit
                </button>
                <button
                  class="hover:bg-yellow. border-2 bg-yellow/90 px-2 py-1"
                  type="button"
                  @click="handleResetPassword">
                  Reset Password
                </button>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<style scoped>
.v-enter-active,
.v-move,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-leave-active {
  position: absolute;
  width: 100%;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
