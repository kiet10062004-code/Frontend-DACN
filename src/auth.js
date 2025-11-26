import axios from "axios";

export async function ensureAccessToken() {
  let token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (!token && !refreshToken) return null;

  if (token) return token;

  try {
    const res = await axios.post("https://backend-dacn-hmw1.onrender.com/api/token/refresh/", {
      refresh: refreshToken,
    });

    localStorage.setItem("access_token", res.data.access);
    return res.data.access;
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
}
