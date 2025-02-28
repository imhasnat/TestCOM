import apiClient from "../service/apiClient";

export const getAllBrands = async () => {
  return apiClient.get("/Brands/GetAll");
};

export const getAllBrandById = async (id) => {
  return apiClient.get(`/Brands/GetById/${id}`);
};

export const createBrand = async (brandData) => {
  return apiClient.post("/Brands/Create", brandData);
};

export const updateBrand = async (id) => {
  return apiClient.put(`/Brands/Update/${id}`);
};

export const deleteBrand = async (Id) => {
  return apiClient.delete(`/Brands/Delete/${Id}`);
};
