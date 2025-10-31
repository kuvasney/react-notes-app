import { buildApiUrl, API_ENDPOINTS, API_CONFIG } from "@/config/api";

export const useUserApi = () => {
  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.register), {
      method: "POST",
      headers: API_CONFIG.headers,
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return response.json();
  };

  const loginUser = async (email: string, password: string) => {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.auth), {
      method: "POST",
      headers: API_CONFIG.headers,
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to login user");
    }

    return response.json();
  };

  return { registerUser, loginUser };
};
