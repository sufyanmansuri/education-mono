import type { FieldModifiers } from "@/types/FieldModifiers";
import axios from "axios";
import { timestamps } from "../utils/timestampModifiers";

export async function getInstitutes(query: any) {
  let data, error;
  try {
    const res = await axios.get("/api/admin/institutes", { params: query });
    if (res.status === 200) {
      const fieldModifiers: FieldModifiers = {
        ...timestamps,
        address: (address) => {
          return Object.values(address).join(", ");
        },
      };
      data = { ...res.data, fieldModifiers };
    }
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export async function getInstituteList() {
  let data, error;
  try {
    const res = await axios.get("/api/institutes");
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}
