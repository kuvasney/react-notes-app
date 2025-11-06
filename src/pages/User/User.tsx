import { useState } from "react";
import { useUserApi } from "@/hooks/useUserApi";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();

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
      <h2 className="hwr">
        {user.username} {t("user.page.title")}
      </h2>
      {user ? (
        <div className="wrapper-form">
          <form className="form-user" onSubmit={handleUserUpdate}>
            <div className="input-container">
              <label>{t("user.form.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label>{t("user.form.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label className="input-password">
                {t("user.form.changePassword")}
                <ToggleVisibility
                  isVisible={isPasswordVisible}
                  onToggle={setIsPasswordVisible}
                />
              </label>

              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="wrapper-buttons">
              <button type="submit" disabled={isLoading}>
                {isLoading ? t("common.saving") : t("user.form.editButton")}
              </button>
              {isLoading && <p>{t("user.form.updating")}</p>}
              {error && (
                <p className="error">
                  <FiAlertCircle /> {error}
                </p>
              )}
              {isSuccess && (
                <p className="success">
                  <FiCheckCircle /> {t("user.form.success")}
                </p>
              )}
            </div>
          </form>
        </div>
      ) : (
        <p>{t("user.form.noInfo")}</p>
      )}
    </div>
  );
}
