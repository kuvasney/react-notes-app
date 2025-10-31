import { NavLink } from "react-router-dom";
import LoginForm from "./components/LoginForm";

export default function Home() {
  return (
    <div className="content-wrapper">
      <LoginForm />
      <p>
        Don't have an account? <NavLink to="/register">Register here</NavLink>.
      </p>
    </div>
  );
}
