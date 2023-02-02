<script setup lang="ts">
import InstituteService from "@/services/InstituteService";
import { useAuthStore } from "@/stores/useAuthStore";
import type { AlertConfig } from "@/types/AlertConfig";
import { isAxiosError } from "axios";
import { onMounted, ref } from "vue";
import AlertBox from "./base/AlertBox.vue";

const { auth } = useAuthStore();
const institute = ref();
const alertConfig = ref<AlertConfig>();

const fetchInstitute = async () => {
  if (auth.value.user?.institute) {
    const { data, error } = await InstituteService.getById(
      auth.value.user?.institute || ""
    );
    if (!error) {
      institute.value = data;
    } else {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message || "Error fetching institute data",
        };
      }
    }
  }
};
onMounted(fetchInstitute);
</script>
<template>
  <div
    class="theme theme-blue relative grid w-full border-2 bg-transparent p-0 after:translate-x-0 after:translate-y-0 after:border-0 after:bg-gradient-to-r after:from-yellow after:to-green/50">
    <div class="border-b-2 bg-transparent p-3">
      <h1 class="my-2 text-2xl font-extrabold drop-shadow-xl">Institute</h1>
    </div>
    <div class="grid min-h-[18rem] grid-cols-6 gap-y-2 gap-x-4 bg-white p-3">
      <template v-if="institute">
        <span class="col-span-2 md:col-span-1">Id:</span>
        <p class="col-span-4 font-semibold md:col-span-5">
          {{ institute._id }}
        </p>

        <span class="col-span-2 md:col-span-1">Name:</span>
        <p class="col-span-4 font-semibold md:col-span-5">
          {{ institute.name }}
        </p>

        <span class="col-span-2 md:col-span-1">Level:</span>
        <p class="col-span-4 font-semibold md:col-span-5">
          {{ institute.level }}
        </p>

        <span class="col-span-2 md:col-span-1">Address:</span>
        <p class="col-span-4 font-semibold md:col-span-5">
          {{ Object.values(institute.address).join(", ") }}
        </p>

        <span class="col-span-2 md:col-span-1">Type:</span>
        <p class="col-span-4 font-semibold md:col-span-5">
          {{ institute.type }}
        </p>

        <span class="col-span-2 md:col-span-1">Home page:</span>
        <p class="col-span-4 font-semibold md:col-span-5">
          {{ institute.homePage }}
        </p>

        <span class="col-span-2 md:col-span-1">No of students:</span>
        <p class="col-span-4 font-semibold md:col-span-5">
          {{ institute.noOfStudents }}
        </p>
      </template>
      <div class="col-span-6 h-56 gap-x-4 bg-white p-3" v-else>
        <AlertBox
          :message="{
            type: 'warning',
            message: 'This account is not associated with an institute.',
          }" />
      </div>
    </div>
  </div>
</template>
