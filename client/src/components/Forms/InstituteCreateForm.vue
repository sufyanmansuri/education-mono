<script setup lang="ts">
import InstituteService from "@/services/InstituteService";
import type { AlertConfig } from "@/types/AlertConfig";
import useVuelidate from "@vuelidate/core";
import { helpers, numeric, required, url } from "@vuelidate/validators";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";
import AlertBox from "../base/AlertBox.vue";
import FormField from "../base/FormField.vue";
import FormSelect from "../base/FormSelect.vue";

defineEmits<{
  (e: "close"): void;
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

const form = ref({ ...initialValue });
const alertConfig = ref<AlertConfig>();
const levels = ref();
const types = ref();
const territories = ref();

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

const handleSubmit = async () => {
  const isValid = await v.value.$validate();
  if (!isValid) return;

  const { error } = await InstituteService.create(form.value);
  if (!error) {
    alertConfig.value = {
      type: "success",
      message: "Institute created successfully.",
    };
    form.value = { ...initialValue };
    v.value.$reset();
  } else {
    if (isAxiosError(error)) {
      alertConfig.value = {
        type: "error",
        message:
          error.response?.data.message || "An unexpected error occurred.",
      };
    }
  }
};

const patchValue = () => {
  form.value = {
    address: {
      county: "Essex",
      line1: "Old Castle",
      line2: "Trent Square",
      town: "London",
      localAuthority: "Royal Borough of London",
      territory: "England",
      postCode: "PO1 3AX",
    },
    homePage: "https://stjosephschool.com",
    level: "Primary",
    name: "St. Joseph's Primary School",
    noOfStudents: 50,
    type: "Free School",
  } as any;
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
  <div
    class="fixed inset-0 z-50 grid bg-black/50 p-10 md:flex md:items-center md:justify-center">
    <div
      class="flex flex-col gap-4 overflow-y-auto border-2 bg-white p-5 md:w-full lg:w-4/5 2xl:w-1/2">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-black">Create Institute</h1>
        <button
          class="text-2xl opacity-80 hover:opacity-100"
          @click="$emit('close')">
          <span class="fa-solid fa-xmark"></span>
        </button>
      </div>
      <div class="grid flex-1 px-2">
        <form @submit.prevent="handleSubmit" class="flex">
          <div class="flex flex-col gap-4">
            <AlertBox :message="alertConfig" />
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
              <button @click="patchValue" type="button">
                Work in progress
              </button>
              <button
                type="submit"
                class="border-2 bg-green/50 px-4 py-1 hover:bg-green/60">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
