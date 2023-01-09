<script setup lang="ts">
import AlertBox from "@/components/base/AlertBox.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import PasswordForm from "@/components/PasswordForm.vue";
import { useQuery } from "@/hooks/useQuery";
import type { AlertConfig } from "@/types/AlertConfig";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

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
const state = ref<
  "invalid" | "expired" | "valid" | "regenerated" | "fetching" | "success"
>("fetching");

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

function handleSubmit(password: string) {
  state.value = "fetching";
  const { setPassword } = useQuery("setPassword", {
    url: "/api/users/set-password",
    params: { token: query.token },
    method: "PUT",
    data: { password },
  });

  watch(setPassword, () => {
    if (setPassword.value.status === "success") {
      state.value = "success";
      alertConfig.value = {
        type: "success",
        message:
          "Account verified. Ask your institute admin to approve your account.",
      };
    } else if (setPassword.value.status === "error") {
      if (setPassword.value.error.status === 400) {
        state.value = "invalid";
        alertConfig.value = {
          type: "error",
          message: "Invalid token provided",
        };
      }
      if (setPassword.value.error.status === 401) {
        state.value = "expired";
        alertConfig.value = {
          type: "error",
          message:
            "Token expired. Click on the button to regenerate verification token.",
        };
      }
    }
  });
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="theme theme-blue">
      <h1 class="mb-5 text-center text-4xl font-black">
        Verifica<span
          class="font-outline text-white underline decoration-blue decoration-wavy decoration-2"
          >tion</span
        >
      </h1>
      <AlertBox :message="alertConfig" />
      <div class="mt-5">
        <div v-if="state === 'valid'">
          <PasswordForm @submit="handleSubmit" />
        </div>
        <div v-else-if="state === 'fetching'" class="text-center">
          <span class="fa-spinner fa-spin-pulse fa-solid"></span>
        </div>
        <div v-else-if="state === 'expired'" class="flex justify-center">
          <div class="flex">
            <BaseButton type="button" color="blue" @click.prevent="regenerate">
              <span class="px-8">Regenerate Token</span>
            </BaseButton>
          </div>
        </div>
        <div v-else-if="state === 'regenerated' || state === 'invalid'">
          <div class="flex justify-center">
            <BaseButton type="button" color="blue" @click="router.push('/')">
              <span class="px-8">Go to home</span>
            </BaseButton>
          </div>
        </div>
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
