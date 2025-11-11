import { useParams } from "react-router-dom";
import { useNotesApi } from "@/hooks/useNotesApi";
import { useState, useEffect } from "react";
import { Note } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import NotesCollaborators from "./components/NotesCollaborators";

export default function ViewNote() {
  const { t } = useLanguage();
  const { getNoteById } = useNotesApi();
  const noteId = useParams().id;
  const [loadedNote, setLoadedNote] = useState<Note | null>(null);

  if (!noteId) {
    return <div>{t("notes.note.notFound")}</div>;
  }

  async function getNote() {
    if (noteId) {
      setLoadedNote(await getNoteById(noteId));
    }
  }

  useEffect(() => {
    getNote();
  }, [noteId]);

  if (!loadedNote) {
    return <div>Nota não encontrada</div>;
  }

  return (
    <div
      key={loadedNote.id}
      id={loadedNote.id}
      className="note"
      style={{ backgroundColor: loadedNote.cor || "transparent" }}
    >
      <h3>
        <input
          type="text"
          value={loadedNote.titulo}
          id={`note-title`}
          className="input-title"
          readOnly
        />
      </h3>
      <textarea
        className="note-content-textarea"
        value={loadedNote.conteudo}
        rows={6}
      />
      <div className="tags">
        {loadedNote.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <p className="date">
        <em>{t("notes.actions.created")}</em>{" "}
        {new Date(loadedNote.dataCriacao).toLocaleDateString()}; &nbsp;
        <em>{t("notes.actions.lastEdited")}</em>{" "}
        {new Date(loadedNote.dataUltimaEdicao).toLocaleDateString()}
      </p>
      <NotesCollaborators note={loadedNote} />
    </div>
  );
}
