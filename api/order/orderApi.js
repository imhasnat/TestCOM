import apiClient from "../service/apiClient";
export const createOrUpdateCoupon = async (data) => {
  return apiClient.post(`/Orders/CreateAndUpdateCoupon`, data);
};

export const createOrder = async (data) => {
  return apiClient.post(`/Orders/CreateOrder`, data);
};

export const couponValidation = async (data) => {
  return apiClient.get(`/Orders/CouponValidation?code=${data}`);
};

export const getOrderByUserId = async (id) => {
  return apiClient.get(`/Orders/GetAllByUserId/${id}`);
};
