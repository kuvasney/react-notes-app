import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import NotesContent from "./components/NotesContent";
import NotesContentSkeleton from "./components/NotesContentSkeleton";
import { NavLink } from "react-router-dom";

export default function Notes() {
  // Usar a store
  const { getActiveNotes, loading } = useNotesStore();

  // Carregar dados da API (SEMPRE executar)
  useNotesApi();

  // Obter notas ativas
  const activeNotes = getActiveNotes();

  const { refetch: refetchNotes } = useNotesApi();

  return (
    <div className="content-wrapper">
      <h1>Notes</h1>
      <button className="btn btn-secondary" onClick={refetchNotes}>
        Reload Notes
      </button>
      <section className="notes-list">
        {loading ? (
          <NotesContentSkeleton />
        ) : (
          <NotesContent notes={activeNotes} />
        )}
      </section>
      <NavLink to="/notes/archive" className="btn btn-primary">
        Archived notes
      </NavLink>
    </div>
  );
}
