import { useNotesQueryApi } from "../../hooks/useNotesQueryApi";
import { useLanguage } from "@/contexts/LanguageContext";
import NotesContent from "./components/NotesContent";
import NotesContentSkeleton from "./components/NotesContentSkeleton";
import NotesNavigator from "../../components/NotesNavigator";

export default function Notes() {
  const { notes, isNotesLoading } = useNotesQueryApi();
  const { t } = useLanguage();

  // Obter notas ativas
  const activeNotes = notes;
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
        {isNotesLoading ? (
          <NotesContentSkeleton />
        ) : (
          <NotesContent notes={activeNotes} />
        )}
      </section>
    </div>
  );
}
