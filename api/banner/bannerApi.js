import apiClient from "../service/apiClient";

export const getAllBanners = async () => {
  return apiClient.get("/Banners/GetAll");
};

export const getAllBannerById = async (id) => {
  return apiClient.get(`/Banners/GetById/${id}`);
};

export const createBanner = async (bannerData) => {
  return apiClient.post("/Banners/Create", bannerData);
};

export const updateBanner = async (id) => {
  return apiClient.put(`/Banners/Update/${id}`);
};

export const deleteBanner = async (Id) => {
  return apiClient.delete(`/Banners/Delete/${Id}`);
};
