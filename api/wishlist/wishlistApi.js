import apiClient from "../service/apiClient";

export const getWishlistByWishlistId = async (wishlistId) => {
  return apiClient.get(`/Wishlists/GetById/${wishlistId}`);
};

export const getWishlistByUserId = async (userId) => {
  return apiClient.get(`/Wishlists/GetByUserId/${userId}`);
};

export const createOrUpdateMultipleWishlist = async (userId, data) => {
  return apiClient.post(`/Wishlists/MultipleCreateOrUpdate/${userId}`, data);
};

export const deleteWishlist = async (wishlistItemId) => {
  return apiClient.delete(`/Wishlists/DeleteWishlistItem/${wishlistItemId}`);
};
