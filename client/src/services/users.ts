import type { Status } from "@/types/Status";
import type { RegisterForm } from "@/types/User";
import axios, { isAxiosError } from "axios";
import { ref } from "vue";

export const getUserTitles = () => {
  const status = ref<Status>("loading");
  const data = ref<string[]>();
  const error = ref();

  async function getData() {
    try {
      const res = await axios.get("/api/titles");
      data.value = res.data;
      status.value = "success";
    } catch (e) {
      if (isAxiosError(e)) {
        status.value = "error";
        error.value = e.response?.data;
      }
    }
  }

  getData();

  return { status, data, error };
};

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
