import React, { useState } from "react";
import { Note } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import NotesForm from "./NotesForm";
import NotesSearch from "./NotesSearch";
import AddCollaborator from "@/components/AddCollaborator";
import NotesCollaborators from "./NotesCollaborators";
import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import {
  FiTrash2,
  FiEdit2,
  FiStar,
  FiArchive,
  FiSave,
  FiX,
  FiUnlock,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import "./NotesContent.scss";

interface NotesContentProps {
  notes: Note[];
  loading?: boolean;
}

interface EditingNote {
  title: string;
  content: string;
  tags: string;
  color: string;
  isPublic: boolean;
  shareToken: string;
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
  const [editingNoteTitle, setEditingNoteTitle] = useState("");
  const [editingNoteContent, setEditingNoteContent] = useState("");
  const [editingTags, setEditingTags] = useState("");
  const [editingColor, setEditingColor] = useState("");
  const [editingIsPublic, setEditingIsPublic] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    removeNote,
    reorderNotes,
    editNote: updateNoteApi,
    refetch,
    regenerateShareToken,
  } = useNotesApi();

  const { t } = useLanguage();

  let noteObject: EditingNote = {
    title: editingNoteTitle,
    content: editingNoteContent,
    tags: editingTags,
    color: editingColor,
    isPublic: editingIsPublic,
    shareToken: editingNote?.shareToken || "",
  };

  const location = useLocation();
  const isArchivePage = location.pathname.includes("notes/archive");

  // Detectar tecla Esc
  useEscapeKey({
    onEscape: setEditingNote.bind(null, null),
    condition: Boolean(editingNote), // Só ativa se houver callback de cancelar
  });

  if (loading) return <div>{t("common.loading")}</div>;

  // Função para iniciar edição de uma nota
  const editNote = (note: Note) => () => {
    setEditingNote(note);
    // Inicializar estados com os valores da nota
    setEditingNoteTitle(note.titulo);
    setEditingNoteContent(note.conteudo);
    setEditingTags(note.tags.join(", "));
    setEditingColor(note.cor);
    setEditingIsPublic(note.isPublic || false);
    setShowCreateForm(false); // Esconder formulário de criação
  };

  // Função para cancelar edição
  const cancelEdit = () => {
    setEditingNote(null);
  };

  const handleDelete = async (noteId: string) => {
    if (confirm(t("notes.deleteConfirm"))) {
      try {
        await removeNote(noteId);
      } catch (error) {
        alert(t("notes.deleteError"));
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

  const updateNote = async (note: Note) => {
    setError("");
    setIsLoading(true);

    const isShareableNote = note.isPublic && note.shareToken;

    try {
      // Validações básicas
      if (!noteObject.title.trim()) {
        throw new Error(t("notes.form.titleRequired"));
      }

      if (!noteObject.content.trim()) {
        throw new Error(t("notes.form.contentRequired"));
      }

      // Processar tags (separadas por vírgula)
      const processedTags = noteObject.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (noteObject.isPublic && !isShareableNote) {
        const shareResponse = await regenerateShareToken(note.id);
      }

      // Criar/atualizar objeto da nota
      const noteData: Partial<Note> = {
        id: note.id,
        titulo: noteObject.title.trim(),
        conteudo: noteObject.content.trim(),
        dataUltimaEdicao: new Date().toISOString(),
        cor: noteObject.color,
        tags: processedTags,
        isPublic: noteObject.isPublic,
      };

      await updateNoteApi(noteData as Note);
      setEditingNote(null);

      // Chamar callback de sucesso se fornecido
    } catch (err) {
      setError(err instanceof Error ? err.message : t("notes.form.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Formulário de criação */}
      {isLoading && <div>{t("common.saving")}</div>}
      {showCreateForm && (
        <div>
          <div className="form-header">
            <h3>{t("notes.createNote")}</h3>
          </div>
          <NotesForm onSave={hideCreateForm} onCancel={hideCreateForm} />
        </div>
      )}
      <NotesSearch onSearchChange={handleSearchChange} />
      <div className="notes-content">
        {searchTerm.length > 0 && (
          <>
            <p className="search-result">
              {filterByTag
                ? t("notes.search.filterByTag")
                : t("notes.search.searchBy")}{" "}
              <span className={`${filterByTag ? "tag" : ""}`}>
                {searchTerm}
              </span>{" "}
              {t("notes.search.returned")} {filteredNotes.length}{" "}
              {t("notes.search.results")}
            </p>
            <div className="input-container">
              <button onClick={() => handleSearchChange("")}>
                {t("notes.search.clearSearch")}
              </button>
            </div>
          </>
        )}

        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>{t("notes.emptyState")}</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="no-notes">
              {searchTerm ? t("notes.list.noResults") : t("notes.list.noNotes")}
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <div
                key={note.id}
                id={note.id}
                className={`note ${note.isPublic ? "public-note" : ""}`}
                draggable="false"
                onDragStart={(e) => dragStartHandler(e, index)}
                onDragOver={(e) => dragoverHandler(e, index)}
                onDrop={dropOverHandler}
                style={{ backgroundColor: note.cor || "transparent" }}
              >
                {note.isPublic && (
                  <div className="public-label">
                    <FiUnlock /> {t("notes.public")}
                  </div>
                )}
                <div
                  className="wrapper-buttons"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {!note.isPublic && <AddCollaborator note={note} />}
                  <button
                    title={
                      note.pinned
                        ? t("notes.actions.unpin")
                        : t("notes.actions.pin")
                    }
                    className={`pin-icon no-button ${
                      note.pinned ? "active" : ""
                    }`}
                    onClick={() => setPinned(note)}
                  >
                    <FiStar />
                  </button>
                  <button
                    title={
                      note.archived
                        ? t("notes.actions.unarchive")
                        : t("notes.actions.archive")
                    }
                    className={`archive-icon no-button ${
                      note.archived ? "active" : ""
                    }`}
                    onClick={() => setArchived(note)}
                  >
                    <FiArchive />
                  </button>
                </div>
                <h3>
                  <input
                    type="text"
                    value={
                      editingNote?._id === note._id
                        ? editingNoteTitle
                        : note.titulo
                    }
                    id={`note-title-${index}`}
                    className="input-title"
                    readOnly={editingNote?._id !== note._id}
                    onChange={(e) => setEditingNoteTitle(e.target.value)}
                  />
                </h3>
                {editingNote?._id === note._id ? (
                  <textarea
                    className="note-content-textarea"
                    value={editingNoteContent}
                    onChange={(e) => setEditingNoteContent(e.target.value)}
                    rows={6}
                  />
                ) : (
                  <div className="note-content">
                    {note.conteudo.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < note.conteudo.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {editingNote?._id !== note._id && (
                  <>
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
                  </>
                )}
                {editingNote?._id === note._id && (
                  <>
                    <div className="input-container">
                      <input
                        type="text"
                        id={`tags-${index}`}
                        value={editingTags}
                        className="tag"
                        onChange={(e) => setEditingTags(e.target.value)}
                      />
                    </div>
                    <div className="input-container">
                      <select
                        value={editingColor}
                        onChange={(e) => setEditingColor(e.target.value)}
                        id="color-select"
                      >
                        <option value="#fff475">
                          {t("notes.colors.yellow")}
                        </option>
                        <option value="#aecbfa">
                          {t("notes.colors.blue")}
                        </option>
                        <option value="#ccff90">
                          {t("notes.colors.green")}
                        </option>
                        <option value="#f28b82">{t("notes.colors.red")}</option>
                        <option value="#d7aefb">
                          {t("notes.colors.purple")}
                        </option>
                        <option value="#e8eaed">
                          {t("notes.colors.gray")}
                        </option>
                      </select>
                    </div>
                  </>
                )}
                {editingNote?._id === note._id && (
                  <div className="input-container inline-container">
                    <label htmlFor="public-note">
                      {t("notes.form.isPublic")}
                    </label>
                    <input
                      type="checkbox"
                      id="public-note"
                      checked={editingIsPublic}
                      onChange={(e) => setEditingIsPublic(e.target.checked)}
                    />
                  </div>
                )}
                <p className="date">
                  <em>{t("notes.actions.created")}</em>{" "}
                  {new Date(note.dataCriacao).toLocaleDateString()}; &nbsp;
                  <em>{t("notes.actions.lastEdited")}</em>{" "}
                  {new Date(note.dataUltimaEdicao).toLocaleDateString()}
                </p>
                <div
                  className="wrapper-buttons"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {editingNote?._id !== note._id && (
                    <button
                      className="edit-button"
                      title={t("notes.editNote")}
                      onClick={editNote(note)}
                    >
                      <FiEdit2 />
                    </button>
                  )}
                  {editingNote?._id === note._id && (
                    <button
                      onClick={() => updateNote(note)}
                      title={t("common.save")}
                    >
                      <FiSave />
                    </button>
                  )}
                  {editingNote?._id === note._id && (
                    <button
                      onClick={() => cancelEdit()}
                      title={t("common.cancel")}
                    >
                      <FiX />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="delete-button"
                    title={t("notes.deleteNote")}
                    aria-label={t("notes.deleteNote")}
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
