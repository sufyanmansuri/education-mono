import type { Status } from "@/types/Status";
import axios, { isAxiosError } from "axios";
import { ref } from "vue";

type institute = {
  _id: string;
  name: string;
};

export function getInstituteList() {
  const status = ref<Status>("loading");
  const data = ref<institute[]>();
  const error = ref();

  async function getData() {
    try {
      const res = await axios.get("/api/institutes/list");
      status.value = "success";
      data.value = res.data;
    } catch (e) {
      status.value = "error";
      if (isAxiosError(e)) {
        error.value = e.response?.data;
      }
    }
  }

  getData();

  return { status, data, error };
}
