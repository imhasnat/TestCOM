import apiClient from "../service/apiClient";

export const userRegistration = async (registerData) => {
  return apiClient.post("/Admin/Register", registerData);
};

export const userLogin = async (loginData) => {
  return apiClient.post("/Admin/Login", loginData);
};
