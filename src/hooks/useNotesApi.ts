import { useEffect } from "react";
import { useNotesStore } from "@/stores/notesStore";

export const useNotesApi = () => {
  const { setNotes, setLoading, setError, loading, initialized } =
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
    isInitialized: initialized,
  };
};
