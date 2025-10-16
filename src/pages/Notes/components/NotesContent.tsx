import { Note } from "@/types";
import { renderTextWithBreaks } from "@/utils/utils";
import "./NotesContent.scss";
import NotesForm from "./NotesForm";

interface NotesContentProps {
  notes: Note[];
  loading?: boolean;
}

export default function NotesContent({
  notes,
  loading = false,
}: NotesContentProps) {
  if (loading) return <div>Carregando...</div>;

  if (notes.length === 0) {
    return (
      <div className="notes-content">
        <div className="empty-state">
          <p>Nenhuma nota encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-content">
      {notes.map((note) => (
        <div
          key={note.id}
          className="note"
          style={{ backgroundColor: note.cor || "transparent" }}
        >
          <h3>{note.titulo}</h3>
          <p>{renderTextWithBreaks(note.conteudo)}</p>
          <div className="tags">
            {note.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <p className="date">
            <em>Created:</em> {new Date(note.dataCriacao).toLocaleDateString()};
            &nbsp;
            <em>Last edited:</em>{" "}
            {new Date(note.dataUltimaEdicao).toLocaleDateString()}
          </p>
        </div>
      ))}
      <NotesForm />
    </div>
  );
}
