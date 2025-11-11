import { useState } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useNotesApi } from "@/hooks/useNotesApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { Note } from "@/types";
import Tooltip from "@/components/Tooltip";
import "./NotesContent.scss";

interface NotesFormProps {
  note?: Note; // Prop opcional para edição
  onSave?: () => void; // Callback após salvar
  onCancel?: () => void; // Callback para cancelar
}

export default function NotesForm({ note, onSave, onCancel }: NotesFormProps) {
  const [title, setTitle] = useState(note?.titulo || "");
  const [content, setContent] = useState(note?.conteudo || "");
  const [color, setColor] = useState(note?.cor || "#e8eaed");
  const [tags, setTags] = useState(note?.tags?.join(", ") || "");
  const [isPublic, setIsPublic] = useState(note?.isPublic || false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { saveNote, editNote } = useNotesApi();
  const { t } = useLanguage();

  // Detectar se estamos editando ou criando
  const isEditing = Boolean(note?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validações básicas
      if (!title.trim()) {
        throw new Error(t("notes.form.titleRequired"));
      }

      if (!content.trim()) {
        throw new Error(t("notes.form.contentRequired"));
      }

      // Processar tags (separadas por vírgula)
      const processedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Criar/atualizar objeto da nota
      const noteData: Partial<Note> = {
        titulo: title.trim(),
        conteudo: content.trim(),
        dataUltimaEdicao: new Date().toISOString(),
        cor: color,
        tags: processedTags,
        isPublic: isPublic,
      };

      if (isEditing) {
        // Editando: manter todos os campos existentes e ID
        Object.assign(noteData, {
          id: note!.id,
          _id: note!._id,
          dataCriacao: note!.dataCriacao,
          archived: note!.archived,
          pinned: note!.pinned,
          lembretes: note!.lembretes,
          colaboradores: note!.colaboradores,
          isPublic: note!.isPublic,
        });
      } else {
        // Criando: definir valores padrão, mas NÃO definir ID
        Object.assign(noteData, {
          dataCriacao: new Date().toISOString(),
          archived: false,
          pinned: false,
          lembretes: [],
          colaboradores: [],
        });
        // ID será gerado pelo MongoDB
      }

      // Salvar nota (criar ou atualizar)
      if (isEditing) {
        await editNote(noteData as Note);
      } else {
        await saveNote(noteData as Note);
      }

      // Se estiver criando uma nova nota, limpar formulário
      if (!isEditing) {
        setTitle("");
        setContent("");
        setColor("#fff475");
        setTags("");
        setIsPublic(false);
      }

      // Chamar callback de sucesso se fornecido
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("notes.form.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    onCancel?.();
  };

  // Detectar tecla Esc
  useEscapeKey({
    onEscape: () => onCancel?.(),
    condition: Boolean(onCancel), // Só ativa se houver callback de cancelar
  });

  return (
    <div className="notes-form" style={{ backgroundColor: color }}>
      <button className="cancel-button" onClick={cancelEdit}>
        ✕
      </button>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            placeholder={t("notes.form.titlePlaceholder")}
            className="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <textarea
            placeholder={t("notes.form.contentPlaceholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
          ></textarea>
        </div>

        <div className="input-container inline-container">
          <label htmlFor="color-select">{t("notes.form.color")}</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isLoading}
            id="color-select"
          >
            <option value="#fff475">🟡</option>
            <option value="#aecbfa">🔵</option>
            <option value="#ccff90">🟢</option>
            <option value="#f28b82">🔴</option>
            <option value="#d7aefb">🟣</option>
            <option value="#e8eaed">⚪</option>
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="tags">{t("notes.form.tags")}</label>
          <input
            type="text"
            placeholder={t("notes.form.tagsPlaceholder")}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isLoading}
            id="tags"
          />
        </div>
        <div className="checkbox-container inline-container tooltip-container">
          <label htmlFor="public-note">{t("notes.form.isPublic")}</label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={isLoading}
            id="public-note"
          />
          <Tooltip>{t("notes.publicTooltip")}</Tooltip>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading
            ? t("common.saving")
            : isEditing
            ? t("notes.form.updateButton")
            : t("notes.form.createButton")}
        </button>
      </form>
    </div>
  );
}
