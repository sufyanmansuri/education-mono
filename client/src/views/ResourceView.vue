<script setup lang="ts">
import { getInstitutes, getUsers } from "@/services/InstituteService";
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import DisplayData from "../components/DisplayData.vue";

const props = defineProps<{
  resource: string;
}>();
const service = ref();

const router = useRouter();

watchEffect(() => {
  switch (props.resource) {
    case "users":
      service.value = getUsers;
      break;

    case "institutes":
      service.value = getInstitutes;
      break;

    default:
      router.push({ name: "not-found" });
      break;
  }
});
</script>

<template>
  <DisplayData :service="service" :key="resource" :resource="resource" />
</template>
