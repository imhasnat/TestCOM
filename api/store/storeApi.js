import apiClient from "../service/apiClient";

export const createStore = async (storeData) => {
  return apiClient.post("/Store/Create/", storeData);
};

export const getStoreById = async (id) => {
  return apiClient.get(`/Store/GetById/${id}`);
};

export const getAllStore = async () => {
  return apiClient.get("/Store/GetAll");
};

export const getStoreConfigById = async (id) => {
  return apiClient.get(`/Store/GetStoreConfigById/${id}`);
};

export const updateStore = async (id, storeData) => {
  return apiClient.put(`/Store/Update/${id}`, storeData);
};

export const deleteStore = async (Id) => {
  return apiClient.delete(`/Store/Delete/${Id}`);
};

export const updateStoreConfig = async (id, configData) => {
  return apiClient.post(`/Store/UpdateStoreConfig/${id}`, configData);
};

export const createStoreProductField = async (storeFieldData) => {
  return apiClient.post("/Store/CreateStoreProductField/", storeFieldData);
};

export const createAndUpdateStoreProductField = async (storeFieldData) => {
  return apiClient.post(
    "/Store/CreateandUpdateStoreProductField/",
    storeFieldData
  );
};

export const getStoreProductFieldBySotreId = async (id) => {
  return apiClient.get(`/Store/GetStoreProductFieldBySotreId/${id}`);
};

export const deleteStoreProductField = async (id) => {
  return apiClient.delete(`/Store/DeleteStoreProductField/${id}`);
};
