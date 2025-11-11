import {
  buildApiUrl,
  API_ENDPOINTS,
  getAuthHeaders,
  apiFetch,
} from "@/config/api";
import { User } from "../types";

export const useUserApi = () => {
  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await apiFetch(
      buildApiUrl(API_ENDPOINTS.users + "/register"),
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ username, email, password }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return response.json();
  };

  const loginUser = async (email: string, password: string) => {
    const response = await apiFetch(buildApiUrl(API_ENDPOINTS.auth), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to login user");
    }

    return response.json();
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    const response = await apiFetch(
      buildApiUrl(`${API_ENDPOINTS.users}/${userId}`),
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  };

  const passwordForgot = async (email: string) => {
    const response = await apiFetch(
      buildApiUrl(API_ENDPOINTS.users + "/forgot-password"),
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reset password");
    }
    return response.json();
  };

  const passwordReset = async (token: string, newPassword: string) => {
    const response = await apiFetch(
      buildApiUrl(API_ENDPOINTS.users + "/reset-password"),
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ token, newPassword }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reset password");
    }
    return response.json();
  };

  return { registerUser, loginUser, updateUser, passwordForgot, passwordReset };
};
