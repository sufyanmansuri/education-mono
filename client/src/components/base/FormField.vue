<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | number;
    field: any;
    type?: string;
    label: string;
    placeholder?: string;
    accent?: "yellow" | "blue";
    autofocus?: boolean;
    disabled?: boolean;
  }>(),
  { type: "text", autofocus: false, accent: "yellow", disabled: false }
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
      <span>
        {{ label }}
      </span>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        class="w-full border-2 px-2 py-1 outline-offset-2 outline-yellow/50 transition disabled:opacity-50"
        :disabled="disabled"
        @input="handleInput"
        @blur="field.$touch"
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
