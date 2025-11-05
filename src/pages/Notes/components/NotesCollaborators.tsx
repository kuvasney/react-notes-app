import { Note } from "@/types/Note";
import { useNotesApi } from "@/hooks/useNotesApi";
import { useUserStore } from "@/stores/userStore";
import { FiUser, FiUserMinus, FiUsers } from "react-icons/fi";

export default function NotesCollaborators({ note }: { note: Note }) {
  const collaborators = note.colaboradores || [];
  const noteId = note.id;

  const { removecollaborator, fetchNotes } = useNotesApi();
  const { user } = useUserStore();

  async function handleRemovecollaborator(email: string) {
    if (noteId) {
      await removecollaborator({ email, noteId });
      await fetchNotes();
    }
  }

  if (collaborators.length === 0) {
    return null;
  }

  return (
    <div className="notes-collaborators">
      <FiUsers />
      <ul className="collaborators-list">
        {collaborators.map((collaborator) => (
          <li key={collaborator} className="collaborator-email">
            {collaborator}
            {user?.email !== collaborator && (
              <button
                className="no-button"
                title="Remove collaborator"
                onClick={() => handleRemovecollaborator(collaborator)}
              >
                <FiUserMinus />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
