<script setup lang="ts">
withDefaults(
  defineProps<{
    placeholder?: string;
    label: string;
    type?: string;
    autofocus?: boolean;
    modelValue: string;
    field: any;
    accent: "yellow" | "blue";
  }>(),
  { type: "text", autofocus: false }
);

const emit = defineEmits(["update:modelValue"]);

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
        class="w-full border-2 px-2 py-1 outline-none transition"
        @input="handleInput"
        :autofocus="autofocus"
        :class="{
          'border-red': field.$dirty && field.$invalid,
          'border-green': field.$dirty && !field.$invalid,
          'focus:border-blue': !field.$dirty && accent === 'blue',
          'focus:border-yellow': !field.$dirty && accent === 'yellow',
        }" />
    </label>
    <template v-if="field.$dirty && field.$invalid">
      <p v-for="error of field.$errors" :key="error.$uid" class="text-red">
        {{ error.$message }}
      </p>
    </template>
  </div>
</template>
