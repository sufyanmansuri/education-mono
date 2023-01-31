<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";
import type { User } from "@/types/User";

import AlertBox from "@/components/base/AlertBox.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import InstituteService from "@/services/InstituteService";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref, watch } from "vue";
import { isAxiosError } from "axios";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import ValidationBox from "@/components/ValidationBox.vue";

const { state: auth } = useUserStore();
const state = ref<"loading" | "idle" | "editing">("loading");
const alertConfig = ref<AlertConfig>();
const profile = ref({ ...auth.value.user } as User);
const institute = ref();

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
      required: helpers.withMessage("Institute is required.", required),
      same: helpers.withMessage(
        "Cannot be changed.",
        (value) => value === auth.value.user?.institute
      ),
    },
    role: {
      required: helpers.withMessage("Role is required.", required),
      same: helpers.withMessage(
        "Cannot be changed.",
        (value) => value === auth.value.user?.role
      ),
    },
  },
  profile as any
);

watch(
  profile,
  () => {
    let isDirty = false;
    Object.keys(profile.value).forEach((key) => {
      if ((profile.value as any)[key] !== (auth.value.user as any)[key]) {
        isDirty = true;
      }
    });
    console.log(isDirty);
  },
  { deep: true }
);

const fetchInstitute = async () => {
  if (auth.value.user?.institute) {
    const { data, error } = await InstituteService.getById(
      auth.value.user?.institute || ""
    );
    if (!error) {
      institute.value = data;
    } else {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message || "Error fetching institute data",
        };
      }
    }
  }
  state.value = "idle";
};
onMounted(fetchInstitute);
</script>
<template>
  <div class="container flex flex-col items-start gap-4 p-3">
    <BaseTitle text1="Profile" underline-color="none" />
    <AlertBox :message="alertConfig" :show-close-button="true" />
    <div class="flex w-full flex-col gap-4 xl:flex-row">
      <div
        class="theme theme-blue group relative w-full border-2 bg-transparent p-0 shadow-green transition-all after:translate-x-0 after:translate-y-0 after:border-0 after:bg-gradient-to-r after:from-yellow after:to-green/50 md:grid md:grid-cols-6 md:after:bg-gradient-to-b"
        :aria-disabled="state !== 'editing'">
        <div
          class="relative h-20 border-b-2 bg-transparent md:h-full md:border-b-0 md:border-r-2">
          <img
            :src="`https://api.dicebear.com/5.x/avataaars-neutral/svg?backgroundColor=edb98a&backgroundType=gradientLinear&seed=${auth.user?.email}`"
            alt="avatar"
            class="absolute top-full left-1/2 h-16 -translate-y-1/2 -translate-x-1/2 border-2 drop-shadow-xl md:top-1/2 md:left-full md:h-20" />
        </div>
        <div class="flex bg-white p-3 pt-12 md:col-span-5 md:p-6 md:pl-16">
          <form class="w-full">
            {{ profile }}
            <div class="flex h-full flex-col gap-4 md:gap-6">
              <div class="flex gap-2">
                <select
                  v-model="profile.title"
                  class="border-2 bg-white px-2 py-1 opacity-100 drop-shadow transition-all disabled:border-black/50 disabled:drop-shadow-none"
                  :disabled="state !== 'editing'">
                  <option selected disabled value="">Title</option>
                  <option :value="profile.title">
                    {{ profile.title }}
                  </option>
                </select>
                <input
                  type="text"
                  class="w-full border-2 bg-white px-2 py-1 drop-shadow transition-all disabled:border-black/50 disabled:drop-shadow-none"
                  :disabled="state !== 'editing'"
                  v-model="profile.firstName"
                  placeholder="First name" />
                <input
                  type="text"
                  class="w-full border-2 bg-white px-2 py-1 drop-shadow transition-all disabled:border-black/50 disabled:drop-shadow-none"
                  v-model="profile.lastName"
                  :disabled="state !== 'editing'"
                  placeholder="Last name" />
              </div>
              <input
                type="text"
                placeholder="Email"
                v-model="profile.email"
                class="w-full border-2 bg-white px-2 py-1 drop-shadow transition-all disabled:border-black/50 disabled:drop-shadow-none"
                :disabled="state !== 'editing'" />
              <select
                v-model="profile.role"
                class="w-full border-2 bg-white px-2 py-1 opacity-100 transition-all disabled:border-black/50 group-aria-disabled:drop-shadow-none"
                disabled>
                <option :value="profile.role">{{ profile.role }}</option>
              </select>
              <ValidationBox :errors="v.$errors" :dirty="v.$anyDirty" />
              <div class="relative xl:mt-auto">
                <TransitionGroup>
                  <div
                    v-if="state === 'editing'"
                    class="grid grid-cols-2 gap-2">
                    <button
                      class="border-2 px-2 py-1"
                      type="button"
                      @click="state = 'idle'">
                      Cancel
                    </button>
                    <button
                      class="border-2 bg-green/50 px-2 py-1 hover:bg-green/60">
                      Submit
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
                      type="button">
                      Reset Password
                    </button>
                  </div>
                </TransitionGroup>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        class="theme theme-blue relative grid w-full border-2 bg-transparent p-0 after:translate-x-0 after:translate-y-0 after:border-0 after:bg-gradient-to-r after:from-yellow after:to-green/50"
        :class="{ 'h-96': state === 'loading' }">
        <div class="border-b-2 bg-transparent p-3">
          <h1 class="my-2 text-2xl font-extrabold drop-shadow-xl">Institute</h1>
        </div>
        <div
          class="grid min-h-[18rem] grid-cols-6 gap-y-2 gap-x-4 bg-white p-3">
          <template v-if="institute">
            <span class="col-span-2 md:col-span-1">Id:</span>
            <p class="col-span-4 font-semibold md:col-span-5">
              {{ institute._id }}
            </p>

            <span class="col-span-2 md:col-span-1">Name:</span>
            <p class="col-span-4 font-semibold md:col-span-5">
              {{ institute.name }}
            </p>

            <span class="col-span-2 md:col-span-1">Level:</span>
            <p class="col-span-4 font-semibold md:col-span-5">
              {{ institute.level }}
            </p>

            <span class="col-span-2 md:col-span-1">Address:</span>
            <p class="col-span-4 font-semibold md:col-span-5">
              {{ Object.values(institute.address).join(", ") }}
            </p>

            <span class="col-span-2 md:col-span-1">Type:</span>
            <p class="col-span-4 font-semibold md:col-span-5">
              {{ institute.type }}
            </p>

            <span class="col-span-2 md:col-span-1">Home page:</span>
            <p class="col-span-4 font-semibold md:col-span-5">
              {{ institute.homePage }}
            </p>

            <span class="col-span-2 md:col-span-1">No of students:</span>
            <p class="col-span-4 font-semibold md:col-span-5">
              {{ institute.noOfStudents }}
            </p>
          </template>
          <div class="col-span-6 h-56 gap-x-4 bg-white p-3" v-else>
            <AlertBox
              :message="{
                type: 'warning',
                message: 'This account is not associated with an institute.',
              }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.v-enter-active,
.v-move,
.v-leave-active,
.label-enter-active,
.label-leave-active {
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
.label-enter-from,
.label-leave-to {
  top: -10%;
  opacity: 0;
  height: 0px;
}
</style>
