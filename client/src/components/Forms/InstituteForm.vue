<script setup lang="ts">
import InstituteService from "@/services/InstituteService";
import type { AlertConfig } from "@/types/AlertConfig";
import { computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers, numeric, required, url } from "@vuelidate/validators";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";
import AlertBox from "../base/AlertBox.vue";
import FormField from "../base/FormField.vue";
import FormSelect from "../base/FormSelect.vue";
import SpinnerIcon from "../icons/SpinnerIcon.vue";

const props = defineProps<{
  defaultValues?: any;
}>();

const emit = defineEmits<{
  (e: "submit", data: any, callback: (a: AlertConfig) => void): AlertConfig;
}>();

const initialValue = {
  name: "",
  address: {
    line1: "",
    line2: "",
    town: "",
    postCode: "",
    territory: "",
    county: "",
    localAuthority: "",
  },
  level: "",
  type: "",
  homePage: "",
  noOfStudents: "",
};

const getInitialValue = () => {
  if (props.defaultValues)
    return {
      ...props.defaultValues,
      address: { ...props.defaultValues.address },
    };
  return { ...initialValue, address: { ...initialValue.address } };
};

const alertConfig = ref<AlertConfig>();
const form = ref(getInitialValue());
const levels = ref();
const types = ref();
const territories = ref();
const isSame = computed(() => {
  const equal =
    JSON.stringify(props.defaultValues) === JSON.stringify(form.value);
  if (equal) v.value.$reset();
  return equal;
});

const v = useVuelidate(
  {
    name: { required: helpers.withMessage("Name is required.", required) },
    address: {
      line1: { required: helpers.withMessage("Line 1 is required.", required) },
      line2: {},
      town: { required: helpers.withMessage("Town is required.", required) },
      postCode: {
        required: helpers.withMessage("Post code is required.", required),
        valid: helpers.withMessage(
          "Enter valid post code. (example: PO1 3AX)",
          helpers.regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/)
        ),
      },
      county: {},
      territory: {
        required: helpers.withMessage("Territory is required.", required),
      },
      localAuthority: {
        required: helpers.withMessage("Local authority is required.", required),
      },
    },
    level: { required: helpers.withMessage("Level is required.", required) },
    type: {},
    homePage: { url: helpers.withMessage("Enter valid url.", url) },
    noOfStudents: {
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
  const fetchLevels = async () => {
    const { data, error } = await InstituteService.levels();
    if (!error) {
      levels.value = data;
    } else {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message ||
            "An error occurred while fetching levels.",
        };
      }
    }
  };
  const fetchTypes = async () => {
    const { data, error } = await InstituteService.types();
    if (!error) {
      types.value = data;
    } else {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message ||
            "An error occurred while fetching types.",
        };
      }
    }
  };
  const fetchTerritories = async () => {
    const { data, error } = await InstituteService.territories();
    if (!error) {
      territories.value = data;
    } else {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message ||
            "An error occurred while fetching types.",
        };
      }
    }
  };

  fetchTypes();
  fetchLevels();
  fetchTerritories();
});
</script>
<template>
  <form @submit.prevent="handleSubmit" class="">
    <AlertBox :message="alertConfig" />
    <div class="relative flex flex-col gap-4">
      <Transition>
        <div
          class="absolute inset-0 flex w-full items-center justify-center bg-white text-3xl"
          v-if="alertConfig?.message === 'Loading...'">
          <SpinnerIcon />
        </div>
      </Transition>
      <div class="grid gap-4 md:grid-cols-2">
        <fieldset class="border px-4 py-2 pb-4">
          <legend class="px-2 font-semibold">Institute Details</legend>
          <div class="space-y-2">
            <FormField
              :field="v.name"
              v-model.trim="v.name.$model"
              label="Name"
              placeholder="St. Joseph's Primary School" />
            <FormSelect
              :field="v.level"
              v-model="v.level.$model"
              placeholder="Select level"
              label="Level">
              <option :value="level" v-for="level in levels" :key="level">
                {{ level }}
              </option>
            </FormSelect>
            <FormSelect
              :field="v.type"
              v-model="v.type.$model"
              placeholder="Select type"
              label="Type">
              <option v-for="t in types" :key="t" :value="t">
                {{ t }}
              </option>
            </FormSelect>
            <FormField
              :field="v.homePage"
              v-model.trim="v.homePage.$model"
              label="Homepage"
              placeholder="https://stjosephs.com" />
            <FormField
              :field="v.noOfStudents"
              v-model.number="v.noOfStudents.$model"
              placeholder="100"
              label="Number of students" />
          </div>
        </fieldset>
        <fieldset class="border px-4 py-2 pb-4">
          <legend class="px-2 font-semibold">Address</legend>
          <div class="space-y-2">
            <FormField
              :field="v.address.line1"
              v-model.trim="v.address.line1.$model"
              placeholder="Old Castle"
              label="Line 1" />
            <FormField
              :field="v.address.line2"
              v-model.trim="v.address.line2.$model"
              placeholder="Trent Square"
              label="Line 2" />
            <div class="grid grid-cols-2 gap-4">
              <FormField
                :field="v.address.town"
                v-model.trim="v.address.town.$model"
                placeholder="London"
                label="Town/City" />
              <FormField
                :field="v.address.postCode"
                v-model.trim="v.address.postCode.$model"
                placeholder="P01 3AX"
                label="Post code" />
              <FormField
                :field="v.address.county"
                v-model.trim="v.address.county.$model"
                placeholder="Essex"
                label="County" />
              <FormSelect
                :field="v.address.territory"
                v-model="v.address.territory.$model"
                placeholder="Select territory"
                label="Territory">
                <option
                  :value="territory"
                  v-for="territory in territories"
                  :key="territory">
                  {{ territory }}
                </option>
              </FormSelect>
            </div>
            <FormField
              :field="v.address.localAuthority"
              v-model.trim="v.address.localAuthority.$model"
              placeholder="Royal Borough of London"
              label="Local authority" />
          </div>
        </fieldset>
      </div>
      <div class="mt-auto flex justify-between md:mt-5">
        <button @click="resetForm" type="button">Reset</button>
        <button
          type="submit"
          :disabled="isSame"
          class="border-2 bg-green/50 px-4 py-1 enabled:hover:bg-green/60 disabled:opacity-50">
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
