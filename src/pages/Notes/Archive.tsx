import { useEffect } from "react";
import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import { useLanguage } from "@/contexts/LanguageContext";
import NotesContent from "./components/NotesContent";
import NotesContentSkeleton from "./components/NotesContentSkeleton";

export default function Archive() {
  // Usar a store
  const { getArchivedNotes, loading } = useNotesStore();

  // Carregar dados da API com filtro de arquivadas
  const { fetchNotes } = useNotesApi();
  const { t } = useLanguage();

  // Carregar notas arquivadas ao montar o componente
  useEffect(() => {
    console.log("Archive page mounted, fetching archived notes");
    fetchNotes(true); // archived = true
  }, []);

  // Obter notas arquivadas
  const archivedNotes = getArchivedNotes();

  return (
    <div className="content-wrapper">
      <section className="notes-list">
        <h1 className="hwr">{t("notes.archivedTitle")}</h1>
        {loading ? (
          <NotesContentSkeleton />
        ) : (
          <NotesContent notes={archivedNotes} />
        )}
      </section>
    </div>
  );
}
