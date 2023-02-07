<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";
import type { Status } from "@/types/Status";

import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@/hooks/useQuery";
import { setPassword } from "@/services/UserService";
import { isAxiosError } from "axios";
import { verifyToken } from "@/services/UserService";

import AlertBox from "@/components/base/AlertBox.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import SpinnerIcon from "@/components/icons/SpinnerIcon.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import PasswordForm from "@/components/Forms/SetPasswordForm.vue";

const route = useRoute();
const { query } = route;

const alertConfig = ref<AlertConfig>({
  type: "info",
  message: "Verifying link...",
});
const state = ref<Status>("fetching");

// Verify token on component mount
onMounted(async () => {
  const { error } = await verifyToken(query.token as string);

  if (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) state.value = "invalid";
      if (status === 403) state.value = "expired";
    }
  } else {
    state.value = "valid";
  }
});

function regenerate() {
  state.value = "regenerating";

  const { regen } = useQuery("regen", {
    url: "/api/auth/token/regenerate",
    params: { token: query.token },
  });

  watch(regen, () => {
    if (regen.value.status === "success") {
      state.value = "regenerated";
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
        if (query.ref === "reset") state.value = "same-password";
        else state.value = "invalid";
      }
      if (error.response?.status === 401) state.value = "expired";
    }
  } else {
    state.value = "success";
  }
}

// Change alert box based on state changes
watch(state, () => {
  switch (state.value) {
    case "valid":
      alertConfig.value = {};
      break;

    case "invalid":
      alertConfig.value = {
        type: "error",
        message: "This link is not valid.",
      };
      break;

    case "expired":
      alertConfig.value = {
        type: "error",
        message:
          "This link is expired. Please click on the button below to generate new link.",
      };
      break;

    case "regenerating":
      alertConfig.value = { type: "info", message: "Sending email..." };
      break;

    case "regenerated":
      alertConfig.value = {
        type: "info",
        message: "Email sent. Check your inbox for verification.",
      };
      break;

    case "same-password":
      alertConfig.value = {
        type: "error",
        message: "New password can't be same as old password.",
      };
      break;

    case "success":
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
      break;

    case "fetching":
      alertConfig.value = {
        type: "info",
        message: "Setting password...",
      };
      break;

    default:
      alertConfig.value = {
        type: "error",
        message: "An unexpected error occurred.",
      };
      break;
  }
});
</script>
<template>
  <BaseTitle v-if="query.ref === 'reset'" text1="Reset " text2="Password" />
  <BaseTitle v-else text1="Verifica" text2="tion" />
  <AlertBox :message="alertConfig" />
  <div class="mt-5">
    <!-- Show spinner while fetching -->
    <div v-if="state === 'fetching'" class="text-center">
      <SpinnerIcon />
    </div>
    <!-- Set password if token is valid -->
    <div v-else-if="state === 'valid' || state === 'same-password'">
      <PasswordForm @submit="handleSubmit" />
    </div>
    <!-- Token expired -->
    <div v-else-if="state === 'expired'" class="flex justify-center">
      <div class="flex">
        <BaseButton type="button" color="blue" @click.prevent="regenerate">
          <span class="px-8">Resend link</span>
        </BaseButton>
      </div>
    </div>
    <!-- Show button if token is regenerated or invalid -->
    <div v-else-if="state === 'regenerated' || state === 'invalid'">
      <RouterLink class="flex justify-center" :to="{ name: 'home' }">
        <BaseButton type="button" color="blue">
          <span class="px-8">Go to home</span>
        </BaseButton>
      </RouterLink>
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
</template>
