import { Routes, Route } from "react-router-dom";

import "./App.scss";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Header from "./components/Layout/Header";
import Register from "./pages/Register";
import Archive from "./pages/Notes/Archive";
import ProtectedRoute from "./components/ProtectedRoute";
import User from "./pages/User";

function App() {
  return (
    <div className="wrapper-content">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/archive"
            element={
              <ProtectedRoute>
                <Archive />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
