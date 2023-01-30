<script setup lang="ts">
import type { Resource } from "@/types/Resource";

import AlertBox from "@/components/base/AlertBox.vue";
import InstituteService from "@/services/InstituteService";
import UserService from "@/services/UserService";
import { ref, watchEffect, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import DisplayData from "@/components/DisplayData/DisplayData.vue";
import { computed } from "vue";
import ClassService from "@/services/ClassService";

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const service = ref();
const showAlert = ref(false);

watchEffect(() => {
  switch (resource.value) {
    case "users":
      service.value = UserService;
      break;

    case "institutes":
      service.value = InstituteService;
      break;

    case "classes":
      service.value = ClassService;
      break;

    case "pending-approvals":
      service.value = UserService;
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
        class="fixed top-0 right-1/2 z-50 mx-auto w-[90vw] translate-x-1/2 shadow-xl md:w-[50vw] lg:top-10 lg:w-auto"
        v-if="showAlert"
        :message="{
          type: 'warning',
          message: 'Click on the column name to sort.',
        }" />
    </Transition>
    <DisplayData :service="service" :key="resource" />
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  top: -300px;
}
</style>
