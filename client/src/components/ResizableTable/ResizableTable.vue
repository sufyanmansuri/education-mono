<script setup lang="ts">
import type { FieldModifiers } from "@/types/FieldModifiers";
import type { ServiceFunction } from "@/types/ServiceFunction";
import type { Resource } from "@/types/Resource";

import { ref, computed, type Component } from "vue";
import { useRouter } from "vue-router";
import { useQueryStore } from "@/stores/useQueryStore";

import TableHeaders from "./TableHeaders.vue";
import TableBody from "./TableBody.vue";
import ConfirmDelete from "@/components/ConfirmDelete.vue";
import UserEditForm from "@/components/Forms/UserEditForm.vue";

const props = defineProps<{
  items: any[];
  fieldModifiers: FieldModifiers;
  remove: ServiceFunction;
}>();

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const table = ref<HTMLTableElement | null>(null);
const editFormId = ref<string>();
const showAlert = ref(false);
const markedForRemoval = ref();

const { query, setSort } = useQueryStore();

const markForRemoval = (item: any) => {
  showAlert.value = true;
  markedForRemoval.value = item;
};

const handleCancel = () => {
  showAlert.value = false;
  markedForRemoval.value = undefined;
};

const handleConfirm = async () => {
  showAlert.value = false;
  const { error } = await props.remove(markedForRemoval.value._id);
  if (error) {
    alert("An unexpected error occurred.");
  } else {
    query.value[resource.value].fetch = true;
  }
};

const handleEdit = (id: string) => {
  editFormId.value = id;
};

type ComponentList = {
  [f in Resource]: Component;
};

const EditForms: ComponentList = {
  users: UserEditForm,
};
</script>

<template>
  <table
    class="theme theme-yellow w-full border-collapse overflow-y-auto border-b-0"
    ref="table">
    <TableHeaders
      :table-height="table?.offsetHeight"
      :fields="query[resource].fields"
      :sort="{ field: query[resource].sortBy, order: query[resource].order }"
      @sort-change="(field: string)=>setSort(resource, field)" />
    <TableBody
      :field-modifiers="fieldModifiers"
      :items="items"
      :fields="query[resource].fields"
      @remove="markForRemoval"
      @edit="handleEdit" />
    <TransitionGroup>
      <ConfirmDelete
        v-if="showAlert"
        :item="markedForRemoval"
        @confirm="handleConfirm"
        @cancel="handleCancel" />
      <component
        v-if="editFormId"
        :is="EditForms[resource]"
        @close="editFormId = undefined"
        :id="editFormId" />
    </TransitionGroup>
  </table>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  transform: scale(1.1);
  opacity: 0;
}
</style>
