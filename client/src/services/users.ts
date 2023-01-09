import type { Status } from "@/types/Status";
import type { RegisterForm } from "@/types/User";
import axios, { isAxiosError } from "axios";
import { ref } from "vue";

export const register = (form: RegisterForm) => {
  const status = ref<Status>("loading");
  const error = ref<{ status: number; error: { message: string } }>();

  async function getData() {
    try {
      await axios.post("/api/users/register", form);
      status.value = "success";
    } catch (e) {
      if (isAxiosError(e)) {
        status.value = "error";
        error.value = e.response?.data;
      }
    }
  }

  getData();

  return { status, error };
};
