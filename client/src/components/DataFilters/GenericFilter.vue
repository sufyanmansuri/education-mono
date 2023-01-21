<script setup lang="ts">
import { ref, watch } from "vue";
import DropdownMenu from "@/components/DropdownMenu.vue";

const props = defineProps<{
  modelValue: any[];
  options: any[];
  placeholder?: string;
  label: string;
}>();

const emit = defineEmits(["update:modelValue"]);
const selected = ref(props.modelValue);

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
  <DropdownMenu :label="label">
    <template v-slot:header>
      <div class="overflow-x-auto border-2 p-1 outline-offset-2">
        <div
          v-if="selected?.length"
          class="flex max-h-16 flex-nowrap gap-2 p-0.5 text-sm">
          <div
            class="flex items-center gap-2 rounded-full bg-yellow px-3 text-black"
            v-for="selection in selected"
            :key="selection">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">
              {{ selection }}
            </span>
          </div>
        </div>
        <p v-else class="px-2">{{ placeholder }}</p>
      </div>
    </template>
    <template v-slot:body>
      <div class="grid grid-cols-1 gap-2 p-2 accent-yellow">
        <ul class="">
          <li v-for="option of options" :key="option">
            <label class="flex gap-2">
              <input
                type="checkbox"
                name="institute"
                :value="option"
                v-model="selected" />
              {{ option }}
            </label>
          </li>
        </ul>
      </div>
    </template>
  </DropdownMenu>
</template>
