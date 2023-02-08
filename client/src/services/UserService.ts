import type { FieldModifiers } from "@/types/FieldModifiers";

import axios from "axios";
import { timestamps } from "../utils/timestampModifiers";

export async function get(query: any) {
  let data, error;

  try {
    const res = await axios.get("/api/admin/users", { params: query });
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

export async function getPendingApprovals(query: any) {
  let data, error;

  try {
    const res = await axios.get("/api/admin/users", {
      params: { ...query, unApproved: true },
    });

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

export async function getById(userId: string) {
  let data, error;
  try {
    const res = await axios.get(`/api/admin/users/${userId}`);
    data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

type UserUpdate = {
  _id: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  approved?: boolean;
  verified?: boolean;
  institute?: string;
  role?: string;
};
export async function update(userId: string, user: UserUpdate) {
  let data, error;
  try {
    const res = await axios.put(`/api/admin/users/${userId}`, user);
    data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export async function resetPassword(email: string) {
  let data, error;
  try {
    const res = await axios.post("/api/auth/reset-password", { email });
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

type LoginForm = {
  email: string;
  password: string;
};
export async function loginUser(form: LoginForm) {
  let data, error;
  try {
    const res = await axios.post("/api/auth/login", form);
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}

export async function setPassword(password: string, token: string) {
  let data, error;
  try {
    const res = await axios.put(
      "/api/auth/set-password",
      { password },
      { params: { token } }
    );
    if (res.status === 200) return (data = res.data);
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export async function logoutUser() {
  let data, error;
  try {
    const res = await axios.delete("/api/auth/logout");
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}

type RegisterForm = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  institute: string;
};
export async function register(form: RegisterForm) {
  let data, error;
  try {
    const res = await axios.post("/api/auth/register", form);
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export async function getTitles() {
  let data, error;
  try {
    const res = await axios.get("/api/titles");
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}

export async function verifyToken(token: string) {
  let data, error;
  try {
    const res = await axios.get("/api/auth/token/check", { params: { token } });
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}

export async function remove(userId: string) {
  let data, error;
  try {
    const res = await axios.delete(`/api/admin/users/${userId}`);
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}

type User = {
  title: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  institute?: string;
};
export async function create(user: User) {
  let data, error;
  try {
    const res = await axios.post("/api/admin/users", user);
    data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}

export async function approve(id: string) {
  let data, error;
  try {
    const res = await axios.put(`/api/admin/users/approve/${id}`);
    data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}

type UpdateProfile = {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
};
export async function updateProfile(form: UpdateProfile) {
  let data, error;
  try {
    const res = await axios.put("/api/auth/profile", form);
    data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}

export async function getLoginActivity() {
  let data, error;
  try {
    const res = await axios.get("/api/auth/login-activity");
    data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}

export default {
  approve,
  get,
  getById,
  getTitles,
  getLoginActivity,
  create,
  loginUser,
  logoutUser,
  register,
  verifyToken,
  update,
  updateProfile,
  setPassword,
  remove,
  resetPassword,
  getPendingApprovals,
};
