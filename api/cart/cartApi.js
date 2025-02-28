import apiClient from "../service/apiClient";

export const getCartItemsByUserId = async (userId) => {
  return apiClient.get(`/Cart/Index/${userId}`);
};

export const createOrUpdateCart = async (cartData) => {
  return apiClient.post(`/Cart/CreateOrUpdate`, cartData);
};
export const createOrUpdateMultipleCart = async (id, cartData) => {
  return apiClient.post(`/Cart/MultipleCreateOrUpdate/${id}`, cartData);
};

export const deleteCartItem = async (Id) => {
  return apiClient.delete(`/CartItems/Delete/${Id}`);
};

export const increaseCartItem = async (data) => {
  return apiClient.put(`/CartItems/IncreaseCartItemQuantity`, data);
};

export const decreaseCartItem = async (data) => {
  return apiClient.put(`/CartItems/DecreaseCartItemQuantity`, data);
};
