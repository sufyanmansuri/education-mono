import type { FieldModifiers } from "@/types/FieldModifiers";
import { timestamps } from "@/utils/timestampModifiers";
import axios from "axios";

export const get = async (query: any) => {
  let data, error;
  try {
    const res = await axios.get("/api/admin/classes", { params: query });
    const fieldModifiers: FieldModifiers = {
      ...timestamps,
      institute: (institute) => {
        return institute?.name;
      },
    };
    data = { ...res.data, fieldModifiers };
  } catch (e) {
    error = e;
  }

  return { data, error };
};

export const remove = async (classId: string) => {
  let data, error;
  try {
    const res = await axios.delete(`/api/admin/classes/${classId}`);
    data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
};

export const getKeyStages = async () => {
  let data, error;
  try {
    const res = await axios.get("/api/key-stages");
    data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
};

export const getExamBoards = async () => {
  let data, error;
  try {
    const res = await axios.get("/api/exam-boards");
    data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
};

type ClassForm = {
  name: string;
  institute: string;
  keyStage?: string;
  noOfStudents?: number;
  yearGroup: string;
  examBoard: string;
};
export const create = async (form: ClassForm) => {
  let data, error;
  try {
    const res = await axios.post("/api/admin/classes", form);
    data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
};

export const update = async (id: string, form: Partial<ClassForm>) => {
  let data, error;
  try {
    const res = await axios.put(`/api/admin/classes/${id}`, form);
    data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
};

export const getById = async (id: string) => {
  let data, error;
  try {
    const res = await axios.get(`/api/admin/classes/${id}`);
    data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
};

export default {
  create,
  get,
  remove,
  getKeyStages,
  getExamBoards,
  update,
  getById,
};
