<script setup lang="ts">
import AlertBox from "@/components/base/AlertBox.vue";
import InstituteService from "@/services/InstituteService";
import UserService from "@/services/UserService";
import { ref, watchEffect, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import DisplayData from "@/components/DisplayData/DisplayData.vue";
import type { Resource } from "@/types/Resource";

const props = defineProps<{
  resource: string;
}>();

const service = ref();
const showAlert = ref(false);

const router = useRouter();

watchEffect(() => {
  switch (props.resource) {
    case "users":
      service.value = UserService;
      break;

    case "institutes":
      service.value = InstituteService;
      break;

    default:
      router.push({ name: "not-found" });
      break;
  }
});

const enterTimeout = setTimeout(() => {
  showAlert.value = true;
}, 2000);

const leaveTimeout = setTimeout(() => {
  showAlert.value = false;
}, 7000);

onUnmounted(() => {
  clearTimeout(enterTimeout);
  clearTimeout(leaveTimeout);
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <Transition>
      <AlertBox
        class="fixed top-20 left-4 right-4 z-50 mx-auto w-[90vw] shadow-xl md:left-auto md:w-[50vw] lg:top-32 lg:w-auto"
        v-if="showAlert"
        :message="{
          type: 'warning',
          message: 'Click on the column name to sort.',
        }" />
    </Transition>
    <DisplayData
      :service="service"
      :resource="(resource as Resource)"
      :key="resource" />
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  right: -999px;
}
</style>
