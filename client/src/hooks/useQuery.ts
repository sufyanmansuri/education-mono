import axios, { isAxiosError, type AxiosRequestConfig } from "axios";
import { ref } from "vue";

export const useQuery = (key: string, config: AxiosRequestConfig) => {
  const state = ref<{
    status: "loading" | "success" | "error";
    data?: any;
    error?: any;
  }>({ status: "loading" });

  (async () => {
    try {
      const res = await axios(config);
      state.value = { status: "success", data: res.data };
    } catch (e) {
      if (isAxiosError(e)) {
        state.value = { status: "error", error: e.response?.data };
      }
    }
  })();
  return { [key]: state };
};
