<script setup lang="ts">
withDefaults(
  defineProps<{
    underlineColor?: "yellow" | "blue" | "red" | "none";
    text1: string;
    text2?: string;
  }>(),
  {
    underlineColor: "blue",
  }
);
</script>

<template>
  <h1 class="text-center text-4xl font-black text-black">
    <span v-if="text2">
      {{ text1
      }}<span
        class="font-outline text-white underline decoration-wavy decoration-2"
        :class="{
          'decoration-blue': underlineColor === 'blue',
          'decoration-yellow': underlineColor === 'yellow',
        }"
        >{{ text2 }}
      </span>
    </span>
    <span
      v-else
      class="underline decoration-wavy decoration-2"
      :class="{
        'decoration-blue': underlineColor === 'blue',
        'decoration-red': underlineColor === 'red',
        'decoration-yellow': underlineColor === 'yellow',
        'decoration-transparent': underlineColor === 'none',
      }">
      {{ text1 }}
    </span>
  </h1>
</template>
