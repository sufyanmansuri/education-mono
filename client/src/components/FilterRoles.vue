<script setup lang="ts">
import { ref, watch } from "vue";
import DropdownMenu from "./DropdownMenu.vue";

const props = defineProps<{
  modelValue: Role[];
}>();

const emit = defineEmits(["update:modelValue"]);

type Role = "super-admin" | "institute-admin" | "teacher";

const selected = ref<Role[]>(props.modelValue);
const roles: Role[] = ["super-admin", "institute-admin", "teacher"];
const search = ref<string>("");

watch(
  () => props.modelValue,
  () => {
    selected.value = props.modelValue;
  }
);
watch(selected, () => {
  emit("update:modelValue", selected.value);
});
</script>
<template>
  <DropdownMenu label="Roles">
    <template v-slot:header>
      <div class="overflow-x-auto border-2 p-1 outline-offset-2">
        <div
          v-if="selected?.length"
          class="flex max-h-16 flex-nowrap gap-2 p-0.5 text-sm">
          <!-- <div
            class="whitespace-nowrap rounded-full bg-yellow/30 p-1 px-3 text-black">
            <span class=""> Select more... </span>
          </div> -->
          <div
            class="flex items-center gap-2 rounded-full bg-yellow px-3 text-black"
            v-for="selection in selected"
            :key="selection">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">
              {{ selection }}
            </span>
          </div>
        </div>
        <p v-else class="px-2">Select Roles</p>
      </div>
    </template>
    <template v-slot:body>
      <div class="grid grid-cols-1 gap-2 p-2 accent-yellow">
        <div
          class="group flex items-center border-b-2 px-2 outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-yellow/50">
          <span class="fa-solid fa-search"></span>
          <input
            placeholder="Search..."
            type="search"
            v-model="search"
            class="w-full px-2 py-1 outline-none" />
        </div>
        <ul class="">
          <li v-for="role of roles" :key="role">
            <label class="flex gap-2">
              <input
                type="checkbox"
                name="institute"
                :value="role"
                v-model="selected" />
              {{ role }}
            </label>
          </li>
        </ul>
      </div>
    </template>
  </DropdownMenu>
</template>
