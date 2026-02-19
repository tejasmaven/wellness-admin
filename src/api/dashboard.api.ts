import api from "./axios";

export const getDashboardStats = async () => {
  const res = await api.get("/admins/dashboard-stats");
  return res.data;
};
