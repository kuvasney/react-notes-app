import React, { useState } from "react";
import { Note } from "@/types";
import { renderTextWithBreaks } from "@/utils/utils";
import "./NotesContent.scss";
import NotesForm from "./NotesForm";
import NotesSearch from "./NotesSearch";
import AddCollaborator from "@/components/AddCollaborator";
import NotesCollaborators from "./NotesCollaborators";
import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import { FiTrash2, FiEdit2, FiStar, FiArchive } from "react-icons/fi";
import { useLocation } from "react-router-dom";

interface NotesContentProps {
  notes: Note[];
  loading?: boolean;
}

export default function NotesContent({
  notes,
  loading = false,
}: NotesContentProps) {
  // Estado para controlar qual nota está sendo editada
  const { showCreateForm, setShowCreateForm, editingNote, setEditingNote } =
    useNotesStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterByTag, setFilterByTag] = useState(false);

  const {
    removeNote,
    reorderNotes,
    editNote: updateNoteApi,
    refetch,
  } = useNotesApi();

  const location = useLocation();
  const isArchivePage = location.pathname.includes("notes/archive");

  if (loading) return <div>Carregando...</div>;

  // Função para iniciar edição de uma nota
  const editNote = (note: Note) => () => {
    setEditingNote(note);
    setShowCreateForm(false); // Esconder formulário de criação
  };

  // Função para cancelar edição
  const cancelEdit = () => {
    setEditingNote(null);
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
    if (filterByTag) {
      return note.tags?.some((tag) => tag.toLowerCase().includes(searchLower));
    } else {
      return (
        note.titulo.toLowerCase().includes(searchLower) ||
        note.conteudo.toLowerCase().includes(searchLower) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
  });

  const handleSearchChange = (search: string) => {
    if (search.length === 0) {
      setSearchTerm("");
      setFilterByTag(false);
      return;
    }
    // Para busca manual (digitação), exige pelo menos 3 caracteres
    // Para clique em tags, permite qualquer tamanho
    setFilterByTag(false);
    setSearchTerm(search);
  };

  const handleSearchByTagChange = (search: string) => {
    setFilterByTag(true);
    setSearchTerm(search);
  };

  let draggedElement: number | null = null;
  let draggedOverElement: number | null = null;

  const dragStartHandler = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    draggedElement = index;
    // console.log("element", e, "index", index);
    // e.dataTransfer.setData("text", e.currentTarget.id);
    // e.dataTransfer.setData("index", index.toString());
  };

  const dragoverHandler = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    draggedOverElement = index;
    e.preventDefault();
  };

  const dropOverHandler = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (
      draggedElement !== null &&
      draggedOverElement !== null &&
      draggedElement !== draggedOverElement
    ) {
      // Cria uma cópia do array de todas as notas (não apenas filteredNotes)
      const allNotes = [...notes];

      // Encontra os índices reais no array completo baseado nos IDs das notas filtradas
      const draggedNoteId = filteredNotes[draggedElement].id;
      const targetNoteId = filteredNotes[draggedOverElement].id;

      const realDraggedIndex = allNotes.findIndex(
        (note) => note.id === draggedNoteId
      );
      const realTargetIndex = allNotes.findIndex(
        (note) => note.id === targetNoteId
      );

      // Remove o elemento da posição original
      const [draggedNote] = allNotes.splice(realDraggedIndex, 1);

      // Ajusta o índice de destino se necessário
      // Se arrastar de cima para baixo, o índice diminui após remover
      const adjustedTargetIndex =
        realDraggedIndex < realTargetIndex
          ? realTargetIndex - 1
          : realTargetIndex;

      // Insere o elemento na nova posição
      allNotes.splice(adjustedTargetIndex, 0, draggedNote);

      const notesIndex = allNotes
        .map((note) => note._id)
        .filter((id): id is string => id !== undefined);

      // Atualiza o estado com a nova ordem
      await reorderNotes(notesIndex);
      await refetch(isArchivePage);

      // Reset das variáveis
      draggedElement = null;
      draggedOverElement = null;
    }
  };

  const setPinned = async (note: Note) => {
    const updatedNote = {
      ...note,
      pinned: !note.pinned,
      dataUltimaEdicao: new Date().toISOString(),
    };

    try {
      await updateNoteApi(updatedNote);
    } catch (error) {
      console.error("Erro ao alterar status de fixação:", error);
    }
  };

  const setArchived = async (note: Note) => {
    const updatedNote = {
      ...note,
      archived: !note.archived,
      dataUltimaEdicao: new Date().toISOString(),
    };

    try {
      await updateNoteApi(updatedNote);
    } catch (error) {
      console.error("Error archiving note");
    }
  };

  return (
    <>
      {/* Formulário de criação */}
      {showCreateForm && (
        <div>
          <div className="form-header">
            <h3>Create New Note</h3>
          </div>
          <NotesForm onSave={hideCreateForm} onCancel={hideCreateForm} />
        </div>
      )}
      {/* Formulário de edição */}
      {editingNote && (
        <div>
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
          <p className="search-result">
            {filterByTag ? "Filtro por tag:" : "Sua busca por:"}{" "}
            <span className={`${filterByTag ? "tag" : ""}`}>{searchTerm}</span>{" "}
            retornou {filteredNotes.length} resultados{" "}
            <button onClick={() => handleSearchChange("")}>Limpar busca</button>
          </p>
        )}
        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma nota encontrada. Crie sua primeira nota!</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="no-notes">
              {searchTerm
                ? "Nenhuma nota encontrada"
                : "Nenhuma nota disponível"}
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <div
                key={note.id}
                id={note.id}
                className="note"
                draggable="true"
                onDragStart={(e) => dragStartHandler(e, index)}
                onDragOver={(e) => dragoverHandler(e, index)}
                onDrop={dropOverHandler}
                style={{ backgroundColor: note.cor || "transparent" }}
              >
                <div
                  className="wrapper-buttons"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <AddCollaborator note={note} />
                  <button
                    title="Pin this note"
                    className={`pin-icon no-button ${
                      note.pinned ? "active" : ""
                    }`}
                    onClick={() => setPinned(note)}
                  >
                    <FiStar />
                  </button>
                  <button
                    title="Archive this note"
                    className={`archive-icon no-button ${
                      note.archived ? "active" : ""
                    }`}
                    onClick={() => setArchived(note)}
                  >
                    <FiArchive />
                  </button>
                </div>
                <h3>{note.titulo}</h3>
                <p>{renderTextWithBreaks(note.conteudo)}</p>
                <div className="tags">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag"
                      onClick={() => handleSearchByTagChange(tag)}
                    >
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
                <div
                  className="wrapper-buttons"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button className="edit-button" onClick={editNote(note)}>
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="delete-button"
                    aria-label="Excluir nota"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <NotesCollaborators note={note} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
