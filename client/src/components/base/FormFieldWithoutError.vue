<script setup lang="ts">
withDefaults(
  defineProps<{
    placeholder?: string;
    label: string;
    type?: string;
    autofocus?: boolean;
    modelValue: string;
    field: any;
  }>(),
  { type: "text", autofocus: false, invalid: false }
);

const emit = defineEmits(["update:modelValue", "blur"]);

// Handle inputs
const handleInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};
</script>

<template>
  <div>
    <label>
      <div>{{ label }}</div>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        class="w-full border-2 px-2 py-1 outline-offset-2 outline-yellow/50 transition"
        @blur="field.$touch"
        :class="{
          'border-red':
            field.$dirty && field.$model.length > 0 && field.$invalid,
          'border-green': field.$dirty && !field.$invalid,
        }"
        @input="handleInput"
        :autofocus="autofocus" />
    </label>
  </div>
</template>
