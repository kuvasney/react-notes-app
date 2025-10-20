import { useState } from "react";
import { Note } from "@/types";
import { renderTextWithBreaks } from "@/utils/utils";
import "./NotesContent.scss";
import NotesForm from "./NotesForm";
import NotesSearch from "./NotesSearch";
import { useNotesApi } from "@/hooks/useNotesApi";

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
  const [searchTerm, setSearchTerm] = useState("");

  const { removeNote } = useNotesApi();

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

  const handleDelete = async (noteId: string) => {
    if (confirm("Tem certeza que deseja excluir esta nota?")) {
      try {
        await removeNote(noteId);
      } catch (error) {
        console.error("Erro ao deletar nota:", error);
        alert("Erro ao deletar a nota. Tente novamente.");
      }
    }
  };

  // Função para esconder formulário de criação
  const hideCreateForm = () => {
    setShowCreateForm(false);
  };

  // Função para filtrar notas baseada no termo de busca
  const filteredNotes = notes.filter((note) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      note.titulo.toLowerCase().includes(searchLower) ||
      note.conteudo.toLowerCase().includes(searchLower) ||
      note.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleSearchChange = (search: string) => {
    if (search.length === 0) setSearchTerm("");
    if (search.length < 3) return;
    setSearchTerm(search);
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
          </div>
          <NotesForm onSave={hideCreateForm} onCancel={hideCreateForm} />
        </div>
      )}

      {/* Formulário de edição */}
      {editingNote && (
        <div className="form-container">
          <div className="form-header">
            <h3>Edit Note</h3>
          </div>
          <NotesForm
            note={editingNote}
            onSave={cancelEdit}
            onCancel={cancelEdit}
          />
        </div>
      )}

      <NotesSearch onSearchChange={handleSearchChange} />

      <div className="notes-content">
        {/* Lista de notas */}
        {searchTerm.length > 0 && (
          <p>
            Sua busca por: {searchTerm} retornou {filteredNotes.length}{" "}
            restultados
          </p>
        )}
        <div className="notes-list">
          {filteredNotes.length === 0 ? (
            <div className="no-notes">
              {searchTerm
                ? "Nenhuma nota encontrada"
                : "Nenhuma nota disponível"}
            </div>
          ) : (
            filteredNotes.map((note) => (
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
                  <em>Created:</em>{" "}
                  {new Date(note.dataCriacao).toLocaleDateString()}; &nbsp;
                  <em>Last edited:</em>{" "}
                  {new Date(note.dataUltimaEdicao).toLocaleDateString()}
                </p>
                <button className="edit-button" onClick={editNote(note)}>
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="delete-button"
                  aria-label="Excluir nota"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
