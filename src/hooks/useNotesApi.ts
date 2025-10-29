import { useEffect } from "react";
import { useNotesStore } from "@/stores/notesStore";
import { buildApiUrl, API_ENDPOINTS, API_CONFIG } from "@/config/api";
import type { Note } from "@/types/Note";
import {
  transformMongoNotes,
  transformMongoNote,
  transformNoteForMongo,
} from "@/utils/apiTransforms";

export const useNotesApi = () => {
  const {
    setNotes,
    addNote,
    updateNote,
    deleteNote,
    reorderNotes,
    setLoading,
    setError,
    loading,
    initialized,
  } = useNotesStore();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(buildApiUrl(API_ENDPOINTS.notes));

      if (!response.ok) {
        throw new Error("Erro ao carregar notas");
      }

      const data = await response.json();

      // Extrair notas da nova estrutura da API
      const notes = data.notes || data; // Suporta tanto {notes: []} quanto [] direto

      // Transforma dados do MongoDB (_id -> id) se necessário
      const transformedNotes = Array.isArray(notes)
        ? transformMongoNotes(notes)
        : [];

      setNotes(transformedNotes); // Isso automaticamente marca como initialized: true
      console.log("Notas carregadas da API:", {
        total: data.pagination?.total || notes.length,
        notes: transformedNotes,
      });
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

      const response = await fetch(buildApiUrl(API_ENDPOINTS.notes), {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify(transformNoteForMongo(newNote)),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar na API");
      }

      // Pega a resposta da API que deve conter o _id gerado pelo MongoDB
      const savedNote = await response.json();

      // Transforma e adiciona a nota com o ID correto do MongoDB
      const transformedNote = transformMongoNote(savedNote);
      addNote(transformedNote);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const editNote = async (newNote: Note) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        buildApiUrl(`${API_ENDPOINTS.notes}/${newNote.id}`),
        {
          method: "PUT",
          headers: API_CONFIG.headers,
          body: JSON.stringify(transformNoteForMongo(newNote)),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar na API");
      }

      updateNote(newNote.id, newNote);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const removeNote = async (noteId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        buildApiUrl(`${API_ENDPOINTS.notes}/${noteId}`),
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar nota");
      }

      deleteNote(noteId);
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
    editNote,
    removeNote,
    reorderNotes,
    isInitialized: initialized,
  };
};
