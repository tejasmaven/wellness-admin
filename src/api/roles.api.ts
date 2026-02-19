import api from "./axios";

export const getRoles = async () => {
  const res = await api.get("/roles");
  return res.data;
};

export const createRole = async (data: { name: string }) => {
  const res = await api.post("/roles", data);
  return res.data;
};

export const deleteRole = async (id: number) => {
  const res = await api.delete(`/roles/${id}`);
  return res.data;
};

export const updateRolePermissions = async (
  roleId: number,
  permissionIds: number[]
) => {
  const res = await api.put(`/roles/${roleId}/permissions`, {
    permissionIds
  });
  return res.data;
};
