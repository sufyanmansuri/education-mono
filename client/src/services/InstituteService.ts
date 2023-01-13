import type { FieldModifiers } from "@/types/FieldModifiers";
import axios from "axios";
import { timestamps } from "./timestampModifiers";

export async function getInstitutes(query: any) {
  let data, error;
  try {
    const res = await axios.get("/api/institutes", { params: query });
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
