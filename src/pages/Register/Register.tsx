import { NavLink } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
    return (
        <div className="content-wrapper">
            <h1 className="hwr">Create your Take Note Account</h1>
            <RegisterForm />
            <p>Already have an account? <NavLink to="/">Login here</NavLink>.</p>
        </div>
    )
}
