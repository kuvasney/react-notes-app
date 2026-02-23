import { useState } from "react";
import { useNotesApi } from "../hooks/useNotesApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { Note } from "@/types";
import { FiUserPlus, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import Modal from "@/components/Modal/Modal";
import { useUserStore } from "../stores/userStore";

export default function AddCollaborator({ note }: { note?: Note }) {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const { addcollaborator } = useNotesApi();
  const { user } = useUserStore();
  const { t } = useLanguage();
  const userEmail = user?.email || "";

  async function addUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      email: email.trim(),
      noteId: note?.id,
    };

    try {
      await addcollaborator(payload);
      setIsSuccess(true);
      setErrorMessage("");
      setEmail(email); // Guarda o email para mostrar na mensagem de sucesso
    } catch (error: any) {
      setIsSuccess(false);

      // Verifica o status HTTP do erro
      if (error.status === 404) {
        // Verifica se é usuário ou nota não encontrada pela mensagem
        if (
          error.message?.includes("User not found") ||
          error.data?.error === "User not found"
        ) {
          setErrorMessage(t("collaborators.errors.userNotFound", { email }));
        } else if (error.message?.includes("Note not found")) {
          setErrorMessage(t("collaborators.errors.noteNotFound"));
        } else {
          setErrorMessage(
            error.message || t("collaborators.errors.resourceNotFound"),
          );
        }
      } else if (error.status === 409) {
        setErrorMessage(t("collaborators.errors.alreadyCollaborator"));
      } else {
        setErrorMessage(error.message || t("collaborators.errors.addError"));
      }
    }
  }

  if (note?.collaborators.includes(userEmail)) {
    return null;
  }

  return (
    <>
      <button
        className="no-button"
        title={t("collaborators.add")}
        onClick={() => setShowModal(true)}
      >
        <FiUserPlus />
      </button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="add-collaborator">
          <h2 className="hwr">
            <FiUserPlus /> {t("collaborators.title")}
          </h2>
          <form onSubmit={(e) => addUser(e)}>
            <div className="input-container">
              <label>{t("collaborators.emailLabel")}</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <button type="submit">{t("collaborators.addButton")}</button>
            </div>
            {errorMessage && (
              <p className="error">
                <FiAlertCircle /> {errorMessage}
              </p>
            )}
            {isSuccess && (
              <p className="success">
                <FiCheckCircle /> {t("collaborators.success", { email })}
              </p>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
}
