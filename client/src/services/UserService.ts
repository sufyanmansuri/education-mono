import axios from "axios";

type ResetPassword = {
  email: string;
};
export async function resetPassword(form: ResetPassword) {
  let data, error;
  try {
    const res = await axios.post("/api/users/reset-password", form);
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
    const res = await axios.post("/api/users/login", form);
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
      "/api/users/set-password",
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
    const res = await axios.delete("/api/users/logout");
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
    const res = await axios.post("/api/users/register", form);
    if (res.status === 200) data = res.data;
  } catch (e) {
    error = e;
  }
  return { data, error };
}
