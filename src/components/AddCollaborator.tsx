import { useState } from "react";
import { useNotesApi } from "../hooks/useNotesApi";
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
          setErrorMessage(
            `Can't find email "${email}". You can invite this person!`
          );
        } else if (error.message?.includes("Note not found")) {
          setErrorMessage("Note not found.");
        } else {
          setErrorMessage(error.message || "Resource not found.");
        }
      } else if (error.status === 409) {
        setErrorMessage("This user is already a collaborator.");
      } else {
        setErrorMessage(error.message || "Error adding collaborator.");
      }
    }
  }

  if (note?.colaboradores.includes(userEmail)) {
    return null;
  }

  return (
    <>
      <button className="no-button" onClick={() => setShowModal(true)}>
        <FiUserPlus />
      </button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="add-collaborator">
          <h2 className="hwr">
            <FiUserPlus /> Add collaborators
          </h2>
          <form onSubmit={(e) => addUser(e)}>
            <div className="input-container">
              <label>Collaborator email:</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <button type="submit">Add</button>
            </div>
            {errorMessage && (
              <p className="error">
                <FiAlertCircle /> {errorMessage}
              </p>
            )}
            {isSuccess && (
              <p className="success">
                <FiCheckCircle /> User {email} added successfully!
              </p>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
}
