import { useState } from "react";
import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import { Note } from "@/types";
import "./NotesContent.scss";

export default function NotesForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#fff475"); // Cor padrão amarela
  const [error, setError] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Acessar a store para adicionar nova nota
  const { addNote } = useNotesStore();
  const { saveNote } = useNotesApi();

  // Gerar ID único para a nova nota
  const generateId = () => `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Criar objeto da nota
      const newNote: Note = {
        id: generateId(),
        titulo: title.trim(),
        conteudo: content.trim(),
        dataCriacao: new Date().toISOString(),
        dataUltimaEdicao: new Date().toISOString(),
        archived: false,
        cor: color,
        tags: processedTags,
        fixada: false,
        lembretes: [],
        colaboradores: []
      };

      // Simular chamada para API (você pode substituir por fetch real)
      await saveNote(newNote);

      // Limpar formulário após sucesso
      setTitle("");
      setContent("");
      setColor("#fff475");
      setTags("");

      console.log("Nota criada com sucesso:", newNote);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar nota");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="notes-form">
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
          <label>Cor da nota:</label>
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
          {isLoading ? "Saving..." : "Save Note"}
        </button>
      </form>
    </div>
  );
}
