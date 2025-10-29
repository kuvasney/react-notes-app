import { useState, useEffect } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useNotesApi } from "@/hooks/useNotesApi";
import { Note } from "@/types";
import "./NotesContent.scss";

interface NotesFormProps {
  note?: Note; // Prop opcional para edição
  onSave?: () => void; // Callback após salvar
  onCancel?: () => void; // Callback para cancelar
}

export default function NotesForm({ note, onSave, onCancel }: NotesFormProps) {
  const [title, setTitle] = useState(note?.titulo || "");
  const [content, setContent] = useState(note?.conteudo || "");
  const [color, setColor] = useState(note?.cor || "#fff475"); // Cor padrão amarela
  const [tags, setTags] = useState(note?.tags?.join(", ") || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { saveNote, editNote } = useNotesApi();

  // Detectar se estamos editando ou criando
  const isEditing = Boolean(note?.id);

  // Gerar ID único para a nova nota
  const generateId = () =>
    `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validações básicas
      if (!title.trim()) {
        throw new Error("Título é obrigatório");
      }

      if (!content.trim()) {
        throw new Error("Conteúdo é obrigatório");
      }

      // Processar tags (separadas por vírgula)
      const processedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Criar/atualizar objeto da nota
      const noteData: Note = {
        id: isEditing ? note!.id : generateId(),
        titulo: title.trim(),
        conteudo: content.trim(),
        dataCriacao: isEditing ? note!.dataCriacao : new Date().toISOString(),
        dataUltimaEdicao: new Date().toISOString(),
        archived: isEditing ? note!.archived : false,
        cor: color,
        tags: processedTags,
        pinned: isEditing ? note!.pinned : false,
        lembretes: isEditing ? note!.lembretes : [],
        colaboradores: isEditing ? note!.colaboradores : [],
      };

      // Salvar nota (criar ou atualizar)
      if (isEditing) {
        await editNote(noteData);
      } else {
        await saveNote(noteData);
      }

      // Se estiver criando uma nova nota, limpar formulário
      if (!isEditing) {
        setTitle("");
        setContent("");
        setColor("#fff475");
        setTags("");
      }

      console.log(
        `Nota ${isEditing ? "atualizada" : "criada"} com sucesso:`,
        noteData
      );

      // Chamar callback de sucesso se fornecido
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar nota");
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
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <textarea
            placeholder="Your note here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
          ></textarea>
        </div>

        <div className="input-container">
          <label>Note color:</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isLoading}
          >
            <option value="#fff475">🟡 Amarelo (Padrão)</option>
            <option value="#aecbfa">🔵 Azul</option>
            <option value="#ccff90">🟢 Verde</option>
            <option value="#f28b82">🔴 Vermelho</option>
            <option value="#d7aefb">🟣 Roxo</option>
            <option value="#e8eaed">⚪ Cinza</option>
          </select>
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Put your tags here separated by commas"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Note" : "Create Note"}
        </button>
      </form>
    </div>
  );
}
