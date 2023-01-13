<script setup lang="ts">
import type { ErrorObject } from "@vuelidate/core";

defineProps<{
  errors: ErrorObject[];
  dirty: boolean;
}>();
</script>

<template>
  <div
    v-if="errors.length > 0"
    class="border-2 border-black px-4 py-2"
    :class="{
      'bg-yellow ': !dirty,
      'bg-red': dirty,
    }">
    <p class="flex items-start gap-2" v-for="error in errors" :key="error.$uid">
      <span class="fa-info-circle fa-solid mt-1"></span>
      <span>{{ error.$message }}</span>
    </p>
  </div>
</template>
