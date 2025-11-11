import React, { useState, useEffect } from "react";
import { useNotesApi } from "@/hooks/useNotesApi";
import { Note } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "react-router-dom";
import { FiUnlock } from "react-icons/fi";
import "../Notes/components/NotesContent.scss";

export default function ViewPublicNote() {
  const { t } = useLanguage();
  const { getPublicNoteById } = useNotesApi();
  const noteId = useParams().id;
  const [loadedNote, setLoadedNote] = useState<Note | null>(null);

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
      <div className="">
        <div
          key={loadedNote.id}
          id={loadedNote.id}
          className="note note-view-public"
          style={{ backgroundColor: loadedNote.cor || "transparent" }}
        >
          <div className="public-label">
            <FiUnlock /> {t("notes.public")}
          </div>
          <h3 className="note-title">{loadedNote.titulo}</h3>
          <div className="note-content">
            {loadedNote.conteudo.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < loadedNote.conteudo.split("\n").length - 1 && <br />}
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
            {new Date(loadedNote.dataCriacao).toLocaleDateString()}; &nbsp;
            <em>{t("notes.actions.lastEdited")}</em>{" "}
            {new Date(loadedNote.dataUltimaEdicao).toLocaleDateString()}
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
