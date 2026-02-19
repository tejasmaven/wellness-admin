import api from "./axios";

export const getPermissions = async () => {
  const res = await api.get("/permissions");
  return res.data;
};

export const createPermission = async (data: any) => {
  const res = await api.post("/permissions", data);
  return res.data;
};

export const updatePermission = async (id: number, data: any) => {
  const res = await api.put(`/permissions/${id}`, data);
  return res.data;
};

export const deletePermission = async (id: number) => {
  const res = await api.delete(`/permissions/${id}`);
  return res.data;
};
