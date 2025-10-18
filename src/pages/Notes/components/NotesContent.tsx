import { useState } from "react";
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
  // Estado para controlar qual nota está sendo editada
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  // Função para iniciar edição de uma nota
  const editNote = (note: Note) => () => {
    setEditingNote(note);
    setShowCreateForm(false); // Esconder formulário de criação
  };

  // Função para cancelar edição
  const cancelEdit = () => {
    setEditingNote(null);
  };

  // Função para mostrar formulário de criação
  const showCreateNoteForm = () => {
    setShowCreateForm(true);
    setEditingNote(null); // Esconder edição se estiver ativa
  };

  // Função para esconder formulário de criação
  const hideCreateForm = () => {
    setShowCreateForm(false);
  };

  return (
    <>
    {/* Botão para criar nova nota */}
      {!showCreateForm && !editingNote && (
        <button className="create-note-button" onClick={showCreateNoteForm}>
          ➕ Create New Note
        </button>
      )}

      {/* Formulário de criação */}
      {showCreateForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>Create New Note</h3>
            <button className="cancel-button" onClick={hideCreateForm}>
              ✕ Cancel
            </button>
          </div>
          <NotesForm onSave={hideCreateForm} />
        </div>
      )}

      {/* Formulário de edição */}
      {editingNote && (
        <div className="form-container">
          <div className="form-header">
            <h3>Edit Note</h3>
            <button className="cancel-button" onClick={cancelEdit}>
              ✕ Cancel
            </button>
          </div>
          <NotesForm note={editingNote} onSave={cancelEdit} />
        </div>
      )}

    <div className="notes-content">
      {/* Lista de notas */}
      <div className="notes-list">
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
            <button className="edit-button" onClick={editNote(note)}>
              ✏️
            </button>
          </div>
        ))}

      </div>
    </div>
    </>
  );
}
