<script setup lang="ts">
import { ref, watch } from "vue";

defineProps<{
  label?: string;
}>();

const show = ref(false);
const element = ref<HTMLElement>();

// Hide menu if clicked outside of it
const onClick = (e: MouseEvent) => {
  if (element.value && !element.value.contains(e.target as Node)) {
    show.value = false;
  }
};

watch(show, () => {
  if (show.value) {
    document.addEventListener("click", onClick);
  } else document.removeEventListener("click", onClick);
});
</script>

<template>
  <div class="relative" ref="element">
    <label class="cursor-pointer text-left">
      {{ label }}
      <input type="checkbox" class="absolute appearance-none" v-model="show" />
      <slot name="header"></slot>
    </label>
    <Transition>
      <div
        class="absolute top-full z-50 mt-2 w-full border-2 border-black bg-white shadow-lg shadow-blue/30 peer-checked:opacity-100"
        v-if="show">
        <slot name="body"></slot>
      </div>
    </Transition>
    <slot name="footer"></slot>
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
