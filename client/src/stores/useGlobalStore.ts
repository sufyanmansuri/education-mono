import { ref } from "vue";

const global = ref({
  loading: false,
});

export const useGlobalStore = () => {
  return { global };
};
