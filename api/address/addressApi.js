import apiClient from "../service/apiClient";

export const getAddressByUserId = async (userId) => {
  return apiClient.get(`/Addresses/GetAllByUserId/${userId}`);
};

export const createORUpdateMultipleAddressForUser = async (data) => {
  return apiClient.post(`/Addresses/CreateAndUpdateMultiple`, data);
};

export const updateAddressByUserId = async (userId, data) => {
  return apiClient.put(`/Addresses/Update/${userId}`, data);
};

export const deleteAddress = async (id) => {
  return apiClient.delete(`/Addresses/Update/${id}`);
};
