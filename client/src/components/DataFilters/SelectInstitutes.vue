<script setup lang="ts">
import { getInstituteList } from "@/services/InstituteService";
import type { Institute } from "@/types/Institute";
import { debounce } from "@/utils/debounce";
import { onMounted, ref, watch } from "vue";
import DropdownMenu from "@/components/DropdownMenu.vue";
import SpinnerIcon from "@/components/icons/SpinnerIcon.vue";

const props = defineProps<{
  modelValue: { _id: string; name: string }[];
}>();

const emit = defineEmits(["update:modelValue"]);

const institutes = ref<Institute[]>();
const selected = ref<Institute[]>(props.modelValue);
const search = ref<string>("");
const loading = ref(true);

const fetchInstitutes = async () => {
  loading.value = true;
  const { data, error } = await getInstituteList(search.value);
  if (!error) {
    institutes.value = data;
  }
  loading.value = false;
};
onMounted(fetchInstitutes);

watch(
  () => props.modelValue,
  () => {
    selected.value = props.modelValue;
  }
);
watch(search, () => {
  debounce(fetchInstitutes);
});
watch(selected, () => {
  emit("update:modelValue", selected.value);
});
</script>
<template>
  <DropdownMenu label="Institutes">
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
            :key="selection._id">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">
              {{ selection.name }}
            </span>
          </div>
        </div>
        <p v-else class="px-2">Select Institutes</p>
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
        <ul class="relative">
          <div
            class="absolute inset-0 z-50 flex items-center justify-center bg-opaque p-3 py-2 text-3xl"
            v-if="loading">
            <SpinnerIcon />
          </div>

          <template v-if="institutes && institutes.length > 0">
            <li v-for="institute of institutes" :key="institute._id">
              <label class="flex gap-2">
                <input
                  type="checkbox"
                  name="institute"
                  :value="institute"
                  v-model="selected" />
                {{ institute.name }}
              </label>
            </li>
          </template>
          <li v-else class="whitespace-nowrap p-2 px-4 transition">
            No results found
          </li>
        </ul>
      </div>
    </template>
  </DropdownMenu>
</template>
