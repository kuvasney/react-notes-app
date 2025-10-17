import { useEffect } from "react";
import { useNotesStore } from "@/stores/notesStore";
import type { Note } from "@/types/Note";

export const useNotesApi = () => {
  const { setNotes, addNote, setLoading, setError, loading, initialized } =
    useNotesStore();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/notes");

      if (!response.ok) {
        throw new Error("Erro ao carregar notas");
      }

      const data = await response.json();
      setNotes(data); // Isso automaticamente marca como initialized: true
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (newNote: Note) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar na API");
      }

      addNote(newNote);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Carregar notas apenas se não foi inicializado e não está carregando
  useEffect(() => {
    const shouldFetch = !initialized && !loading;

    if (shouldFetch) {
      fetchNotes();
    }
  }, [initialized, loading]);

  return {
    fetchNotes,
    refetch: fetchNotes,
    saveNote,
    isInitialized: initialized,
  };
};
