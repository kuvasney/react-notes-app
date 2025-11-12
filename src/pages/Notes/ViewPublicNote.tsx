import React, { useState, useEffect } from "react";
import { useNotesApi } from "@/hooks/useNotesApi";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Note } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "react-router-dom";
import "../Notes/components/NotesContent.scss";
import PublicLabel from "../../components/PublicLabel";

export default function ViewPublicNote() {
  const { t } = useLanguage();
  const { getPublicNoteById } = useNotesApi();
  const noteId = useParams().id;
  const [loadedNote, setLoadedNote] = useState<Note | null>(null);

  // Atualizar meta tags quando a nota carregar
  usePageMeta({
    title: loadedNote
      ? `${loadedNote.title} - Take Note`
      : "Take Note - Public Note",
    description: loadedNote
      ? loadedNote.content.substring(0, 155) + "..."
      : "View public note shared on Take Note - Your notes, simple and secure.",
  });

  if (!noteId) {
    return <div>{t("notes.note.notFound")}</div>;
  }

  async function getNote() {
    if (noteId) {
      setLoadedNote(await getPublicNoteById(noteId));
    }
  }

  useEffect(() => {
    getNote();
  }, [noteId]);

  if (!loadedNote) {
    return <div>Nota não encontrada</div>;
  }

  return (
    <section className="notes-page">
      <div className="public-note-container">
        <div
          key={loadedNote.id}
          id={loadedNote.id}
          className="note note-view-public"
          style={{ backgroundColor: loadedNote.color || "transparent" }}
        >
          <PublicLabel shareToken={loadedNote.shareToken} />
          <h3 className="note-title">{loadedNote.title}</h3>
          <div className="note-content">
            {loadedNote.content.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < loadedNote.content.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          <div className="tags">
            {loadedNote.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <p className="date">
            <em>{t("notes.actions.created")}</em>{" "}
            {loadedNote.createdAt &&
              new Date(loadedNote.createdAt).toLocaleDateString()}
            ; &nbsp;
            <em>{t("notes.actions.lastEdited")}</em>{" "}
            {loadedNote.updatedAt &&
              new Date(loadedNote.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="view-site">
        <p>
          Crie suas próprias notas com{" "}
          <a href="https://takenote.rafael.abc.br" className="hwr">
            Take Note!
          </a>
        </p>
      </div>
    </section>
  );
}
