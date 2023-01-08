<script setup lang="ts">
defineProps<{
  placeholder?: string;
  label: string;
  modelValue: string;
  field: any;
}>();
const emit = defineEmits(["update:modelValue"]);

function handleInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLSelectElement).value);
}
</script>

<template>
  <div>
    <label>
      <div>{{ label }}</div>
      <select
        class="h-9 w-full border-2 bg-white px-2 py-1 outline-none"
        :value="modelValue"
        @input="handleInput"
        :class="{
          'border-red': field.$dirty && field.$invalid,
          'border-green': field.$dirty && !field.$invalid,
        }"
      >
        <option disabled selected value="">{{ placeholder }}</option>
        <slot></slot>
      </select>
    </label>
    <template v-if="field.$dirty && field.$invalid">
      <p v-for="error of field.$errors" :key="error.$uid" class="text-red">
        {{ error.$message }}
      </p>
    </template>
  </div>
</template>
