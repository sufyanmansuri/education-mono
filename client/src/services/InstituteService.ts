import type { FieldModifiers } from "@/types/FieldModifiers";

import axios from "axios";
import { timestamps } from "../utils/timestampModifiers";

export async function get(query: any) {
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

export async function getInstituteList(query: string) {
  let data, error;
  try {
    const res = await axios.get("/api/search-institutes", {
      params: { search: query },
    });
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export async function remove(instituteId: string) {
  let data, error;
  try {
    const res = await axios.delete(`/api/admin/institutes/${instituteId}`);
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export async function types() {
  let data, error;
  try {
    const res = await axios.get("/api/types");
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export async function levels() {
  let data, error;
  try {
    const res = await axios.get("/api/levels");
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export default { get, remove, getInstituteList, types, levels };
