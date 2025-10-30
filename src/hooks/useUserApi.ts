export const useUserApi = () => {
  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return response.json();
  };

  return { registerUser };
};
