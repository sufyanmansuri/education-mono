<script setup lang="ts">
import { formatPascalCase } from "@/utils/formatPascalCase";
import { ref } from "vue";

const props = defineProps<{
  selected: string[];
  fields: string[];
}>();
const emit = defineEmits(["change"]);

const showColumnMenu = ref(false);
const columns = ref(props.selected);

const handleChange = () => {
  emit("change", columns.value);
  showColumnMenu.value = false;
};
</script>

<template>
  <div :aria-checked="showColumnMenu" class="group relative">
    <button
      type="button"
      @click="showColumnMenu = !showColumnMenu"
      value=""
      class="border-2 bg-white p-2 outline-none group-aria-checked:w-72 group-aria-checked:border-b-white">
      Select fields <span class="fa-solid fa-angle-down"></span>
    </button>
    <div
      class="absolute top-10 left-1/2 z-20 hidden h-0 w-0 -translate-x-1/2 border-t-0 bg-white transition-all group-checked:visible group-aria-checked:block group-aria-checked:h-auto group-aria-checked:w-full group-aria-checked:border-2 group-aria-checked:border-t-0">
      <div class="p-3">
        <div class="mx-2 grid grid-cols-2 whitespace-nowrap accent-yellow">
          <label v-for="field in fields" :key="field">
            <input type="checkbox" v-model="columns" :value="field" />
            {{ formatPascalCase(field) }}
          </label>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="
              () => {
                columns = selected;
                showColumnMenu = false;
              }
            ">
            <span class="px-8 py-2">Cancel</span>
          </button>
          <button class="border-2 bg-green/50" @click="handleChange">
            <span class="px-8 py-2">Done</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
