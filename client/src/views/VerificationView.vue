<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";
import type { Status } from "@/types/Status";

import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@/hooks/useQuery";

import AlertBox from "@/components/AlertBox.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import SpinnerIcon from "@/components/icons/SpinnerIcon.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import PasswordForm from "@/components/PasswordForm.vue";
import { setPassword } from "@/services/UserService";
import { isAxiosError } from "axios";

const route = useRoute();
const router = useRouter();

const { query } = route;
const { tokenValidation } = useQuery("tokenValidation", {
  url: "/api/users/token/check",
  params: { token: query.token },
});
const alertConfig = ref<AlertConfig>({
  type: "info",
  message: "Verifying token...",
});
const state = ref<Status>("fetching");

watch(tokenValidation, () => {
  if (tokenValidation.value.status === "success") {
    state.value = "valid";
    alertConfig.value = {};
  } else if (tokenValidation.value.status === "error") {
    if (tokenValidation.value.error.status === 400) {
      state.value = "invalid";
      alertConfig.value = {
        type: "error",
        message: "Invalid token provided",
      };
    }
    if (tokenValidation.value.error.status === 401) {
      state.value = "expired";
      alertConfig.value = {
        type: "error",
        message:
          "Token expired. Click on the button to regenerate verification token.",
      };
    }
  }
});

function regenerate() {
  state.value = "fetching";
  alertConfig.value = { type: "info", message: "Regenerating token..." };

  const { regen } = useQuery("regen", {
    url: "/api/users/token/regenerate",
    params: { token: query.token },
  });

  watch(regen, () => {
    if (regen.value.status === "success") {
      state.value = "regenerated";
      alertConfig.value = {
        type: "info",
        message: "Token regenerated. Check your inbox for verification.",
      };
    }

    if (regen.value.status === "error") {
      state.value = "invalid";
      alertConfig.value = {
        type: "error",
        message: "Unexpected error occurred.",
      };
    }
  });
}

async function handleSubmit(password: string) {
  state.value = "fetching";

  const { error } = await setPassword(password, query.token as string);

  if (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 400) {
        if (query.ref === "reset") {
          state.value = "valid";
          alertConfig.value = {
            type: "error",
            message: error.response.data.error.message,
          };
        } else {
          state.value = "invalid";
          alertConfig.value = {
            type: "error",
            message: "Invalid token provided",
          };
        }
      }
      if (error.response?.status === 401) {
        state.value = "expired";
        alertConfig.value = {
          type: "error",
          message:
            "Token expired. Click on the button to regenerate verification token.",
        };
      }
    }
  } else {
    state.value = "success";

    if (query.ref === "reset")
      alertConfig.value = {
        type: "success",
        message: "Password reset successfully.",
      };
    else
      alertConfig.value = {
        type: "success",
        message:
          "Account verified. Ask your institute admin to approve your account.",
      };
  }
}
</script>

<template>
  <div class="container flex min-h-screen items-center justify-center">
    <img
      src="/verification.svg"
      alt="Verification"
      class="-z-50 -mr-36 hidden lg:block" />
    <div class="theme theme-blue md:w-1/2 lg:w-1/3">
      <BaseTitle v-if="query.ref === 'reset'" text1="Reset " text2="Password" />
      <BaseTitle v-else text1="Verifica" text2="tion" />
      <AlertBox :message="alertConfig" />
      <div class="mt-5">
        <!-- Show spinner while fetching -->
        <div v-if="state === 'fetching'" class="text-center">
          <SpinnerIcon />
        </div>
        <!-- Set password if token is valid -->
        <div v-else-if="state === 'valid'">
          <PasswordForm @submit="handleSubmit" />
        </div>
        <!-- Token expired -->
        <div v-else-if="state === 'expired'" class="flex justify-center">
          <div class="flex">
            <BaseButton type="button" color="blue" @click.prevent="regenerate">
              <span class="px-8">Regenerate Token</span>
            </BaseButton>
          </div>
        </div>
        <!-- Show button if token is regenerated or invalid -->
        <div v-else-if="state === 'regenerated' || state === 'invalid'">
          <div class="flex justify-center">
            <BaseButton type="button" color="blue" @click="router.push('/')">
              <span class="px-8">Go to home</span>
            </BaseButton>
          </div>
        </div>
        <!-- Show login button on success -->
        <div v-else-if="state === 'success'">
          <RouterLink class="flex justify-center" :to="{ name: 'login' }">
            <BaseButton type="button" color="blue">
              <span class="px-8">Login</span>
            </BaseButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
