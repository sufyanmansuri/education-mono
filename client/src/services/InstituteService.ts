import type { FieldModifiers } from "@/types/FieldModifiers";
import axios from "axios";

const timestampModifier = (timestamp: string | number | Date) =>
  new Date(timestamp).toLocaleDateString();

const timestamps = {
  createdAt: timestampModifier,
  updatedAt: timestampModifier,
};

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

export async function getUsers(query: any) {
  let data, error;
  try {
    const res = await axios.get("/api/users", { params: query });
    if (res.status === 200) {
      const fieldModifiers: FieldModifiers = {
        ...timestamps,
        institute: (institute) => {
          return institute?.name;
        },
      };
      data = { ...res.data, fieldModifiers };
    }
  } catch (e) {
    error = e;
  }
  return { data, error };
}
