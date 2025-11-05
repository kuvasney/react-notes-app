import { useEffect, useState } from "react";
import { useUserApi } from "@/hooks/useUserApi";
import ToggleVisibility from "@/components/ToggleVisibility/ToggleVisibility";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useUserStore } from "../../stores/userStore";

export default function User() {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const [name, setName] = useState(user ? user.username : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const { updateUser } = useUserApi();
  const { setUser } = useUserStore();

  const handleUserUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name.trim()) {
      setName(user ? user.username : "");
    }
    if (!email.trim()) {
      setEmail(user ? user.email : "");
    }

    const userObject = {
      username: name.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    try {
      await updateUser(user.id, userObject);
      user.username = userObject.username;
      user.email = userObject.email;
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser({
        ...user,
        username: userObject.username,
        email: userObject.email,
      });

      setPassword("");
      setSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="hwr">{user ? user.username : "User"}'s page</h1>
      {user ? (
        <div className="wrapper-form">
          <form className="form-user" onSubmit={handleUserUpdate}>
            <div className="input-container">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label>Change Password:</label>
              <ToggleVisibility
                isVisible={isPasswordVisible}
                onToggle={setIsPasswordVisible}
              />
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="wrapper-buttons">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Edit user"}
              </button>
              {isLoading && <p>Updating user...</p>}
              {error && (
                <p className="error-message">
                  <FiAlertCircle /> {error}
                </p>
              )}
              {isSuccess && (
                <p className="success-message">
                  <FiCheckCircle /> User updated successfully!
                </p>
              )}
            </div>
          </form>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
}
