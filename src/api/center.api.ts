import api from "./axios";

export const createCenter = async (data: any) => {
  // Matches POST "/"
  const res = await api.post("/centers", data); 
  return res.data;
};

export const getPendingCenters = async () => {
  // Matches GET "/pending"
  const res = await api.get("/centers/pending");
  return res.data;
};

export const verifyCenterStatus = async (id: number, status: "VERIFIED" | "REJECTED") => {
  const res = await api.patch(`/centers/${id}/verify`, { status });
  return res.data;
};

export const getVerifiedCenters = async () => {
  const res = await api.get("/centers/verified");
  return res.data;
};