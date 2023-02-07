<script setup lang="ts">
import type { FieldModifiers } from "@/types/FieldModifiers";
import type { Resource } from "@/types/Resource";
import { useRoute } from "vue-router";

const props = defineProps<{
  fieldModifiers: FieldModifiers;
  items: any[];
  isOverflowing: boolean;
  fields: string[];
}>();

const emit = defineEmits<{
  (e: "remove", item: any): void;
  (e: "edit", id: string): void;
  (e: "approve", item: any): void;
}>();

const route = useRoute();
const { resource } = route.params as { resource: Resource };

function formatText(value: any, field: string) {
  if (
    props.fieldModifiers &&
    Object.prototype.hasOwnProperty.call(props.fieldModifiers, field)
  ) {
    return props.fieldModifiers[field](value);
  }
  return value;
}

const handleRemove = (item: any) => {
  emit("remove", item);
};
const handleEdit = (id: string) => {
  emit("edit", id);
};
const handleApprove = (item: any) => {
  emit("approve", item);
};
</script>
<template>
  <tbody>
    <tr v-for="item in items" :key="item._id" class="table-row">
      <td
        class="relative whitespace-nowrap border-2 px-4 py-2"
        :class="{ 'lg:max-w-0': !isOverflowing }"
        v-for="field in fields"
        :key="field">
        <div
          class=""
          :class="{
            'overflow-x-hidden text-ellipsis ': !isOverflowing,
            'flex justify-center': typeof item[field] === 'boolean',
          }">
          <span
            v-if="typeof item[field] === 'boolean'"
            class="fa-solid text-3xl"
            :class="[
              item[field]
                ? 'fa-square-check text-green'
                : 'fa-square-xmark text-red',
            ]"></span>
          <span v-else :title="formatText(item[field], field)">
            {{ formatText(item[field], field) }}
          </span>
        </div>
      </td>
      <td
        class="overflow-x-auto whitespace-nowrap border-2 py-1 text-center"
        :class="{ 'lg:max-w-0': !isOverflowing }">
        <div v-if="resource !== 'pending-approvals'">
          <button
            class="mx-1 border-2 px-2 py-1"
            type="button"
            @click="handleEdit(item._id)">
            <span class="fa-solid fa-pen"></span>
            <span class="sr-only">Edit</span>
          </button>
          <button
            class="mx-1 border-2 bg-red px-2 py-1"
            @click="handleRemove(item)">
            <span class="fa-solid fa-trash"></span>
            <span class="sr-only">Delete</span>
          </button>
        </div>

        <div v-else>
          <button
            type="button"
            @click="handleApprove(item)"
            :disabled="!item?.verified"
            :title="!item?.verified ? 'Account is not verified.' : ''"
            class="group mx-1 my-1 border-2 px-3 py-1 transition-all enabled:hover:bg-green/50 disabled:opacity-50">
            <span
              class="fa-solid fa-lock mr-1 group-enabled:group-hover:hidden"></span>
            <span
              class="fa-solid fa-lock-open mr-1 hidden group-enabled:group-hover:inline"></span>
            Approve
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</template>
