<script setup lang="ts">
import type { Institute } from "@/types/Institute";

import { onMounted, ref, watch } from "vue";
import { debounce } from "@/utils/debounce";
import instituteService from "@/services/InstituteService";

import SpinnerIcon from "./icons/SpinnerIcon.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    field: any;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emit = defineEmits(["update:modelValue"]);

const data = ref<Institute[]>();
const value = ref();
const show = ref(false);
const loading = ref(true);
const query = ref<string>("");

const label = ref<HTMLLabelElement | null>(null);

// Get institutes from server
const get = async (query: string = "") => {
  loading.value = true;
  const res = await fetch(`/api/search-institutes?search=${query}`);
  const data = await res.json();
  loading.value = false;
  return data;
};

const setValue = (id: any, title: any) => {
  value.value = { id, title };
  emit("update:modelValue", id);
};

onMounted(async () => {
  data.value = await get();
});

const onClick = (e: MouseEvent) => {
  if (label.value !== null) {
    if (!label.value?.contains(e.target as Node)) {
      show.value = false;
    }
  }
};

watch(query, () => {
  debounce(async () => {
    data.value = await get(query.value);
  });
});

watch(show, () => {
  if (show.value) {
    document.addEventListener("click", onClick);
  } else document.removeEventListener("click", onClick);
});

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) value.value = "";
  }
);

onMounted(async () => {
  if (props.modelValue) {
    const { data, error } = await instituteService.getById(props.modelValue);
    if (!error) {
      value.value = { id: data._id, title: data.name };
    } else {
      alert("An error occurred while fetching institute details.");
    }
  }
});
</script>

<template>
  <div>
    <label class="relative" ref="label" :class="{ 'opacity-60': disabled }">
      <span>Institute</span>
      <input type="checkbox" class="absolute appearance-none" v-model="show" />
      <div
        class="flex w-full items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap border-2 border-black py-1 px-2 text-center"
        :class="{
          'border-red': field.$dirty && field.$invalid,
          'border-green': field.$dirty && !field.$invalid,
        }">
        <span v-if="modelValue && !value?.title" class="m-auto">
          <SpinnerIcon />
        </span>
        <span v-else>
          {{ value?.title || "Select institute" }}
        </span>
        <span class="fa-solid fa-angle-down"></span>
      </div>
      <Transition>
        <div
          class="absolute top-full z-50 mt-2 w-full border-2 border-black bg-white shadow-lg shadow-blue/30 peer-checked:opacity-100"
          v-if="show && !disabled">
          <div
            class="group flex items-center border-b-2 py-1 px-2 focus-within:border-blue">
            <span
              class="fa-solid fa-search group-focus-within:text-blue"></span>
            <input
              class="peer w-full px-2 outline-none"
              placeholder="Search..."
              v-model="query" />
          </div>
          <ul class="relative my-1">
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center bg-white p-3 text-3xl">
              <SpinnerIcon />
            </div>
            <template v-if="data && data.length > 0">
              <li
                v-for="item of data"
                :key="item._id"
                class="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap py-1 px-2 transition hover:bg-blue hover:text-white"
                @click="setValue(item._id, item.name)">
                {{ item.name }}
              </li>
            </template>
            <li v-else class="whitespace-nowrap p-2 px-4 transition">
              No results found
            </li>
          </ul>
        </div>
      </Transition>
    </label>
    <template v-if="field.$dirty && field.$invalid">
      <p v-for="error of field.$errors" :key="error.$uid" class="text-red">
        {{ error.$message }}
      </p>
    </template>
  </div>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.1s ease-out;
}

.v-enter-from,
.v-leave-to {
  top: 0px;
  opacity: 0;
}
</style>
