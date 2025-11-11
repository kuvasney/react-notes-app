import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import type { ErrorInfo } from "react";

import "./App.scss";
import Home from "./pages/Home";
import ViewNote from "./pages/Notes/ViewNote";
import ViewPublicNote from "./pages/Notes/ViewPublicNote";
import Notes from "./pages/Notes";
import Header from "./components/Layout/Header";
import Register from "./pages/Register";
import Archive from "./pages/Notes/Archive";
import ResetPassword from "./pages/User/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import User from "./pages/User";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ErrorFallback } from "./components/ErrorBoundary";

function App() {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log do erro para serviço de monitoramento (Sentry, LogRocket, etc.)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Aqui você pode enviar para um serviço de log externo
    // logErrorToService(error, errorInfo);
  };

  const handleReset = () => {
    // Limpar estados ou cache se necessário
    console.log("Error boundary reset");
  };

  return (
    <LanguageProvider>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={handleError}
        onReset={handleReset}
      >
        <div className="wrapper-content">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/note/:id"
                element={
                  <ProtectedRoute>
                    <ViewNote />
                  </ProtectedRoute>
                }
              />
              <Route path="/public-note/:id" element={<ViewPublicNote />} />
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
      </ErrorBoundary>
    </LanguageProvider>
  );
}

export default App;
