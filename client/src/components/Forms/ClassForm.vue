<script setup lang="ts">
import ClassService from "@/services/ClassService";
import { useAuthStore } from "@/stores/useAuthStore";
import type { AlertConfig } from "@/types/AlertConfig";
import { computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers, numeric, required } from "@vuelidate/validators";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";
import AlertBox from "../base/AlertBox.vue";
import FormField from "../base/FormField.vue";
import FormSelect from "../base/FormSelect.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";
import SelectInstitute from "../SelectInstitute.vue";

const { auth } = useAuthStore();

const props = defineProps<{
  defaultValues?: any;
}>();

const emit = defineEmits<{
  (e: "submit", data: any, callback: (a: AlertConfig) => void): AlertConfig;
}>();

const initialValue = {
  institute: auth.value.user?.institute,
  name: "",
  keyStage: "",
  yearGroup: "",
  noOfStudents: "",
  examBoard: "",
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
const keyStages = ref();
const examBoards = ref();
const isSame = computed(() => {
  const equal =
    JSON.stringify(props.defaultValues) === JSON.stringify(form.value);
  if (equal) v.value.$reset();
  return equal;
});

const v = useVuelidate(
  {
    institute: {
      required: helpers.withMessage("Institute is required.", required),
    },
    name: { required: helpers.withMessage("Name is required.", required) },
    keyStage: {
      required: helpers.withMessage("Key stage  is required.", required),
    },
    yearGroup: {
      YYYY: helpers.withMessage(
        "Year group must be in YYYY format",
        helpers.regex(/^\d{4}$/)
      ),
      required: helpers.withMessage("Year group is required.", required),
    },
    examBoard: {
      required: helpers.withMessage(
        "Number of students is required.",
        required
      ),
    },
    noOfStudents: {
      required: helpers.withMessage(
        "Number of students is required.",
        required
      ),
      numeric: helpers.withMessage("Enter a numeric value.", numeric),
    },
  },
  form
);

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

onMounted(() => {
  const fetchKeyStages = async () => {
    const { data, error } = await ClassService.getKeyStages();
    if (!error) {
      keyStages.value = data;
    } else {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message ||
            "An error occurred while fetching key stages.",
        };
      }
    }
  };
  const fetchExamBoards = async () => {
    const { data, error } = await ClassService.getExamBoards();
    if (!error) {
      examBoards.value = data;
    } else {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message ||
            "An error occurred while fetching exam boards.",
        };
      }
    }
  };

  fetchKeyStages();
  fetchExamBoards();
});
</script>
<template>
  <form @submit.prevent="handleSubmit" class="">
    <AlertBox :message="alertConfig" />
    <div class="relative flex flex-col gap-4">
      <Transition>
        <div
          class="absolute inset-0 z-50 flex w-full items-center justify-center bg-white text-3xl"
          v-if="alertConfig?.message === 'Loading...'">
          <SpinnerIcon />
        </div>
      </Transition>
      <div class="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <SelectInstitute
          v-model="v.institute.$model"
          :disabled="!!auth.user?.institute"
          :field="v.institute" />
        <FormField
          :field="v.name"
          v-model.trim="v.name.$model"
          label="Name"
          placeholder="2B" />
        <FormSelect
          :field="v.keyStage"
          v-model="v.keyStage.$model"
          placeholder="Select key stage"
          label="Key stage">
          <option :value="stage" v-for="stage in keyStages" :key="stage">
            {{ stage }}
          </option>
        </FormSelect>
        <FormSelect
          :field="v.examBoard"
          v-model="v.examBoard.$model"
          placeholder="Select exam board"
          label="Exam board">
          <option v-for="board in examBoards" :key="board" :value="board">
            {{ board }}
          </option>
        </FormSelect>
        <FormField
          :field="v.yearGroup"
          v-model.number="v.yearGroup.$model"
          placeholder="2022"
          label="Year group" />
        <FormField
          :field="v.noOfStudents"
          v-model.number="v.noOfStudents.$model"
          placeholder="100"
          label="Number of students" />
      </div>
      <div class="mt-auto flex justify-between md:mt-5">
        <button @click="resetForm" type="button">Reset</button>
        <button
          type="submit"
          :disabled="isSame"
          class="border-2 bg-green/50 px-4 py-1 enabled:hover:bg-green/60 disabled:opacity-70">
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
