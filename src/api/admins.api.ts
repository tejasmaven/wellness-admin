import api from "./axios";

export const listAdmins = async () => {
  const res = await api.get("/admins");
  return res.data;
};

export const createAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
  role_id: number;
}) => {
  const res = await api.post("/admins", payload);
  return res.data;
};

export const toggleAdminStatus = async (id: number) => {
  const res = await api.patch(`/admins/${id}/status`);
  return res.data;
};
