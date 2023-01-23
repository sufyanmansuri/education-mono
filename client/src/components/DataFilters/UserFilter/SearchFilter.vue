<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const searchQuery = ref(props.modelValue);

const onInput = () => {
  emit("update:modelValue", searchQuery.value);
};
</script>
<template>
  <div>
    <label>
      <div>Search</div>
      <input
        type="search"
        @input="onInput"
        v-model.trim="searchQuery"
        class="mr-1 w-full border-2 px-2 py-1 focus:border-yellow focus:outline-2 focus:outline-offset-2 focus:outline-yellow/50"
        placeholder="Type something..." />
    </label>
  </div>
</template>
