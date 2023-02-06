<script setup lang="ts">
import UserService, { getTitles } from "@/services/UserService";
import { useAuthStore } from "@/stores/useAuthStore";
import type { AlertConfig } from "@/types/AlertConfig";
import { computed, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { onMounted, ref } from "vue";
import AlertBox from "../base/AlertBox.vue";
import FormField from "../base/FormField.vue";
import FormSelect from "../base/FormSelect.vue";
import SelectInstitute from "../SelectInstitute.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";

const { auth } = useAuthStore();

const props = defineProps<{
  defaultValues?: any;
}>();

const emit = defineEmits<{
  (e: "submit", data: any, callback: (a: AlertConfig) => void): void;
  (e: "reset-password", callback: (a: AlertConfig) => void): void;
}>();

const initialValue = {
  title: "",
  email: "",
  role: "",
  firstName: "",
  lastName: "",
  institute: auth.value.user?.institute || "",
};

const getInitialValue = () => {
  if (props.defaultValues)
    return {
      ...props.defaultValues,
    };
  return { ...initialValue };
};

const alertConfig = ref<AlertConfig>();
const form = ref(getInitialValue());
const titles = ref<string[]>();
const roles = computed(() => {
  if (auth.value.user?.role === "super-admin") {
    return ["super-admin", "institute-admin", "teacher"];
  } else return ["institute-admin", "teacher"];
});
const isSame = computed(() => {
  const equal =
    JSON.stringify(props.defaultValues) === JSON.stringify(form.value);
  if (equal) v.value.$reset();
  return equal;
});

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
  if (form.value.role === "super-admin") {
    delete initialRules.institute.required;
  }

  return initialRules;
});

const v = useVuelidate(rules, form);

const resetForm = () => {
  form.value = getInitialValue();
  v.value.$reset();
};

const handleSubmit = async () => {
  const isValid = await v.value.$validate();
  if (!isValid) return;

  alertConfig.value = { type: "info", message: "Loading..." };
  emit("submit", form.value, (value: AlertConfig) => {
    alertConfig.value = value;
    if (alertConfig.value && alertConfig.value.type === "success") {
      resetForm();
    }
  });
};

const handleResetPassword = () => {
  alertConfig.value = { type: "info", message: "Loading..." };
  emit("reset-password", (value: AlertConfig) => {
    alertConfig.value = value;
  });
};

onMounted(() => {
  const fetchTitles = async () => {
    const { data, error } = await getTitles();
    if (error) {
      alert("An error occurred while fetching titles.");
      console.log(error);
    } else {
      titles.value = data;
    }
  };
  fetchTitles();
});
watch(
  () => form.value.role,
  () => {
    if (form.value.role === "super-admin") {
      form.value.institute = "";
    }
  }
);
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <AlertBox :message="alertConfig" />
    <div class="relative">
      <Transition>
        <div
          class="absolute inset-0 z-50 flex w-full items-center justify-center bg-white text-3xl"
          v-if="alertConfig?.message === 'Loading...'">
          <SpinnerIcon />
        </div>
      </Transition>
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
          v-if="form.role !== 'super-admin'"
          v-model="v.institute.$model"
          :disabled="auth.user?.role !== 'super-admin'"
          :field="v.institute" />
      </div>
      <div class="flex justify-between">
        <div class="flex gap-4">
          <button @click="resetForm" type="button">Reset</button>
          <button
            v-if="defaultValues"
            @click="handleResetPassword"
            class="border-2 bg-yellow px-2 py-1"
            type="button">
            Update Password
          </button>
        </div>

        <button
          class="border-2 bg-green/50 px-4 py-2 transition hover:bg-green/60 disabled:opacity-50"
          :disabled="isSame">
          Submit
        </button>
      </div>
    </div>
  </form>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}
.v-enter-from,
.v-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
