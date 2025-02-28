import apiClient from "../service/apiClient";

export const getAllCategories = async () => {
  return apiClient.get("/Categories/GetAll");
};

export const getAllCategoryById = async (id) => {
  return apiClient.get(`/Categories/GetById/${id}`);
};

export const createCategory = async (CategoryData) => {
  return apiClient.post("/Categories/Create", CategoryData);
};

export const updateCategory = async (id) => {
  return apiClient.put(`/Categories/Update/${id}`);
};

export const deleteCategory = async (Id) => {
  return apiClient.delete(`/Categories/Delete/${Id}`);
};
