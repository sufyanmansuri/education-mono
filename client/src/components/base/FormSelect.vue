<script setup lang="ts">
withDefaults(
  defineProps<{
    placeholder?: string;
    label: string;
    modelValue: string;
    field: any;
    accent?: "yellow" | "blue";
  }>(),
  { accent: "yellow" }
);
const emit = defineEmits(["update:modelValue"]);

function handleInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLSelectElement).value);
}
</script>

<template>
  <div>
    <label>
      <span>{{ label }}</span>
      <select
        class="h-9 w-full border-2 bg-white px-2 py-1 outline-offset-2 outline-yellow/50"
        :value="modelValue"
        @input="handleInput"
        :class="{
          'border-red': field.$dirty && field.$invalid,
          'border-green': field.$dirty && !field.$invalid,
          'focus:border-blue': !field.$dirty && accent === 'blue',
          'focus:border-yellow': !field.$dirty && accent === 'yellow',
        }">
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
