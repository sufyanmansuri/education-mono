<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";
import { ref } from "vue";
import AlertBox from "@/components/base/AlertBox.vue";
import ForgotPasswordForm from "@/components/Forms/ForgotPasswordForm.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";

const alertConfig = ref<AlertConfig>({
  type: "warning",
  message:
    "An email will be sent to this address with a link to reset password.",
});

// Update alert on form state change
function updateAlert(config: AlertConfig) {
  alertConfig.value = config;
}
</script>

<template>
  <div
    class="container relative flex items-center justify-center xl:justify-end xl:px-56">
    <img
      src="/forgot-password.svg"
      alt="Login"
      class="absolute left-48 -z-50 hidden w-[calc(100vw/2.5)] object-contain xl:block" />
    <div class="theme theme-yellow relative lg:w-3/5 xl:w-2/5">
      <BaseTitle text1="Reset " text2="Password" />
      <ForgotPasswordForm @change="updateAlert" />
      <AlertBox :message="alertConfig" />
    </div>
  </div>
</template>
