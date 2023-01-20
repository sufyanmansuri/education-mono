<script setup lang="ts">
import { ref, watch } from "vue";
import DropdownMenu from "@/components/DropdownMenu.vue";

const props = defineProps<{
  modelValue: Role[];
}>();

const emit = defineEmits(["update:modelValue"]);

type Role = "super-admin" | "institute-admin" | "teacher";

const selected = ref<Role[]>(props.modelValue);
const roles: Role[] = ["super-admin", "institute-admin", "teacher"];

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
