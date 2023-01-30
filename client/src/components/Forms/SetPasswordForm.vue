<script setup lang="ts">
import type { ValidatorFn } from "@vuelidate/core";

import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { minLength, required, helpers } from "@vuelidate/validators";

import BaseButton from "../base/BaseButton.vue";
import FormFieldWithoutError from "../base/FormFieldWithoutError.vue";
import ValidationBox from "../ValidationBox.vue";

const emit = defineEmits<{
  (e: "submit", password: string): void;
}>();

const form = ref({
  password: "",
  confirmPassword: "",
});

// Validators
const mustHaveNumber: ValidatorFn = (value: string) => {
  if (value.match(/[0-9]/)) return true;
  return false;
};
const mustHaveUppercase: ValidatorFn = (value: string) => {
  if (value.match(/[A-Z]/)) return true;
  return false;
};
const mustHaveSpecial: ValidatorFn = (value: string) => {
  if (value.match(/[!@#$%^&*]/)) return true;
  return false;
};
const mustBeSame: ValidatorFn = (value: string) =>
  value.length > 0 && value === v.value.password.$model;

const v = useVuelidate(
  {
    password: {
      required: helpers.withMessage("Password cannot be empty", required),
      minLength: helpers.withMessage(
        "Must contain at least 8 characters",
        minLength(8)
      ),
      mustHaveNumber: helpers.withMessage(
        "Must contain a number",
        mustHaveNumber
      ),
      mustHaveUppercase: helpers.withMessage(
        "Must contain an uppercase letter",
        mustHaveUppercase
      ),
      mustHaveSpecial: helpers.withMessage(
        "Must contain a special character (!@#$%^&*)",
        mustHaveSpecial
      ),
    },
    confirmPassword: {
      mustBeSame: helpers.withMessage("Passwords should match.", mustBeSame),
    },
  },
  form
);

// Handle submit
async function handleSubmit() {
  const isFormValid = await v.value.$validate();
  if (!isFormValid) return;

  emit("submit", form.value.password);
}
</script>

<template>
  <div>
    <form action="" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-4">
        <FormFieldWithoutError
          accent="blue"
          type="password"
          v-model="v.password.$model"
          :field="v.password"
          label="Password" />
        <ValidationBox
          :errors="v.password.$silentErrors"
          :dirty="v.$dirty && v.password.$model.length > 0" />
        <FormFieldWithoutError
          accent="blue"
          type="password"
          v-model="v.confirmPassword.$model"
          :field="v.confirmPassword"
          label="Confirm password" />
        <ValidationBox
          :errors="v.confirmPassword.$silentErrors"
          :dirty="v.confirmPassword.$dirty && v.password.$model.length > 0" />
        <BaseButton type="submit" color="blue" class="">Submit</BaseButton>
      </div>
    </form>
  </div>
</template>
