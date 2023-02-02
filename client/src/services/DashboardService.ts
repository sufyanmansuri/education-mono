import axios from "axios";

export async function get() {
  let data, error;
  try {
    const res = await axios.get("/api/admin/dashboard");
    data = res.data;
  } catch (e) {
    error = e;
  }

  return { data, error };
}
export default { get };
