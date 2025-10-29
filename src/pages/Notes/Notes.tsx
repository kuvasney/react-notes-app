import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import NotesContent from "./components/NotesContent";
import NotesContentSkeleton from "./components/NotesContentSkeleton";

export default function Notes() {
  // Usar a store
  const { getActiveNotes, loading } = useNotesStore();

  // Carregar dados da API (SEMPRE executar)
  useNotesApi();

  // Obter notas ativas
  const activeNotes = getActiveNotes();
  activeNotes.sort((a, b) => {
    // Notas fixadas primeiro
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className="content-wrapper">
      <h1 className="hwr">Notes</h1>

      <section className="notes-list">
        {loading ? (
          <NotesContentSkeleton />
        ) : (
          <NotesContent notes={activeNotes} />
        )}
      </section>
    </div>
  );
}
