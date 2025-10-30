import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import "./LoginForm.scss";

// Mock de usuários para teste
const MOCK_USERS = [
  { email: "kuvasney@gmail.com", password: "123456" },
  { email: "user@teste.com", password: "senha123" },
];

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  // Redireciona se já estiver logado
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/notes", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verifica credenciais mock
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Login sucesso - usa o hook de autenticação
      login(email);

      // Verifica se há redirecionamento pendente
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");

      navigate(redirectPath || "/notes");
    } else {
      setError("Email ou senha inválidos");
    }

    setIsLoading(false);
  };

  return (
    <section className="login">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="input-container">
          {error && (
            <div className="error">
              <FiAlertCircle /> {error}
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
