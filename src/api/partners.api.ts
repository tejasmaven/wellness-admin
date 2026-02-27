import api from "./axios";

export const getPartners = async () => {
  const res = await api.get("/partners");
  return res.data;
};

export const createPartner = async (data:any) => {
  const res = await api.post("/partners", data);
  return res.data;
};

export const updatePartner = async (id:number,data:any) => {
  await api.put(`/partners/${id}`, data);
};

export const togglePartnerStatus = async (id:number,status:string) => {
  await api.patch(`/partners/${id}/status`, { status });
};