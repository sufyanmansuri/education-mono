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

const ApprovalService = {
  get: UserService.getPendingApprovals,
  approve: UserService.approve,
  remove: UserService.remove,
};

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
      service.value = ApprovalService;
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
    <div class="">
      <button
        class="group relative pl-5 hover:font-semibold"
        @click="router.back()">
        <span
          class="fa-solid fa-arrow-left absolute -left-0 top-1/2 -translate-y-1/2 transition-all group-hover:-left-1"></span
        >Go back
      </button>
    </div>
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
