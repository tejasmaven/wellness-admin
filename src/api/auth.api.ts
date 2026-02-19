import api from "./axios";

export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const meApi = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
