import { useEffect } from "react";
import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import { useLanguage } from "@/contexts/LanguageContext";
import NotesContent from "./components/NotesContent";
import NotesContentSkeleton from "./components/NotesContentSkeleton";
import NotesNavigator from "../../components/NotesNavigator";

export default function Notes() {
  // Usar a store
  const { getActiveNotes, loading } = useNotesStore();

  // Carregar dados da API (SEMPRE executar)
  const { fetchNotes } = useNotesApi();
  const { t } = useLanguage();

  useEffect(() => {
    fetchNotes();
  }, []);

  // Obter notas ativas
  const activeNotes = getActiveNotes();
  if (activeNotes.length > 0) {
    activeNotes.sort((a, b) => {
      // Notas fixadas primeiro
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }

  return (
    <div className="content-wrapper">
      <h2 className="section-title hwr">{t("notes.title")}</h2>
      <NotesNavigator />
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
