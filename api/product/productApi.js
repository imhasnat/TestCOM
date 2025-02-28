import apiClient from "../service/apiClient";

export const createProduct = async (productData) => {
  return apiClient.post("/Products/Create", productData);
};

export const getProductsById = async (id) => {
  return apiClient.get(`/Products/GetById/${id}`);
};

export const getProductsByCategoryId = async (id, pageNumber) => {
  return apiClient.get(`/Products/GetByCategoryId/${id}/${pageNumber}/4`);
};

export const getProductsByBrandId = async (id, pageNumber) => {
  return apiClient.get(`/Products/GetByBrandId/${id}/${pageNumber}/4`);
};

export const getAllProducts = async () => {
  return apiClient.get("/Products/GetAll");
};

export const updateProduct = async (id, data) => {
  return apiClient.put(`/Products/Update/${id}`, data);
};

export const deleteProduct = async (Id) => {
  return apiClient.delete(`/Products/Delete/${Id}`);
};

export const getProductFieldsByCategoryId = async (id) => {
  return apiClient.get(`/Products/GetProductFieldsByCategoryId/${id}`);
};

export const getAllProductDetailByProductId = async (id) => {
  return apiClient.get(`/Products/GetAllProductDetailByProductId/${id}`);
};

export const getRandomProducts = async (num) => {
  return apiClient.get(`/Products/GetRandomProduct/${num}`);
};

export const getFeatureProducts = async (num) => {
  return apiClient.get(`/Products/GetFeatureProduct/${num}`);
};

export const getAllFeatureProducts = async (num) => {
  return apiClient.get(`/Products/GetAllFeatureProduct/${num}`);
};

export const getLatestProducts = async (num) => {
  return apiClient.get(`/Products/GetLatestProduct/${num}`);
};

export const getStoreConfigById = async (id) => {
  return apiClient.get(`/Products/GetStoreConfigById/${id}`);
};

export const filterProducts = async (filterData) => {
  return apiClient.post(`/Products/FilterProduct/`, filterData);
};

export const createAndUpdateProductDetails = async (data) => {
  return apiClient.post(`/Products/CreateandUpdateDetails/`, data);
};

export const getProductGallery = async (id) => {
  return apiClient.get(`/Products/GetProductGallery/${id}`);
};

export const createProductGallery = async (id, data) => {
  return apiClient.post(`/Products/createProductGallery/${id}`, data);
};

export const deleteSingleImage = async (id) => {
  return apiClient.delete(`/Products/DeleteSingleImage/${id}`);
};

export const searchProductsx = async (param, data) => {
  return apiClient.post(`/Products/SearchProducts/${param}`, data);
};

export const searchProducts = async (data) => {
  return apiClient.post(`/Products/SearchProducts/`, data);
};
