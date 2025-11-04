import { useEffect } from "react";
import { useNotesStore } from "@/stores/notesStore";
import { buildApiUrl, API_ENDPOINTS, API_CONFIG } from "@/config/api";
import type { Note } from "@/types/Note";
import {
  transformMongoNotes,
  transformMongoNote,
  transformNoteForMongo,
} from "@/utils/apiTransforms";
import { useAuth } from "./useAuth";

export const useNotesApi = () => {
  const {
    setNotes,
    addNote,
    updateNote,
    deleteNote,
    setIndexNotes,
    setLoading,
    setError,
    initialized,
  } = useNotesStore();

  // const { isLoggedIn } = useAuth();

  const fetchNotes = async (archived = false) => {
    try {
      setLoading(true);
      setError(null);

      // Timeout para evitar requests infinitos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.notes + `?archived=${archived}`),
        {
          headers: API_CONFIG.headers,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro ao carregar notas: ${response.status}`);
      }

      const data = await response.json();

      // Extrair notas da nova estrutura da API
      const notes = data.notes || data; // Suporta tanto {notes: []} quanto [] direto

      // Transforma dados do MongoDB (_id -> id) se necessário
      const transformedNotes = Array.isArray(notes)
        ? transformMongoNotes(notes)
        : [];

      setNotes(transformedNotes); // Isso automaticamente marca como initialized: true

      // criar o array de indexNotes
      const notesIds: string[] = transformedNotes.map((note) => note.id);
      setIndexNotes(notesIds);

      // console.log("Notas carregadas da API:", {
      //   total: data.pagination?.total || notes.length,
      //   notes: transformedNotes,
      // });
    } catch (error) {
      console.error("Erro ao buscar notas:", error);

      if (error instanceof Error && error.name === "AbortError") {
        setError("Timeout na requisição - API não respondeu");
        // } else if (
        //   error instanceof Error &&
        //   error.message === "Erro ao carregar notas: 401"
        // ) {
        // if (isLoggedIn) {
        //   alert(
        //     "Seu tempo de sessão expirou. Clique em OK para retornar à tela inicial."
        //   );
        //   localStorage.removeItem("isLoggedIn");
        //   window.location.href = "/";
        // }
        // setError("token inválido ou expirado");
      } else {
        setError(error instanceof Error ? error.message : "Erro desconhecido");
      }

      // Mesmo com erro, marca como inicializado para evitar retry infinito
      setNotes([]);
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

  const reorderNotes = async (newIndexNotes: string[]) => {
    setIndexNotes(newIndexNotes);

    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.reorder), {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify({ noteIds: newIndexNotes }), // Apenas o array
      });

      if (!response.ok) {
        throw new Error("Erro ao reordenar notas");
      }

      console.log("Notas reordenadas com sucesso");
    } catch (error) {
      console.error("Erro ao reordenar notas:", error);
      setError(error instanceof Error ? error.message : "Erro ao reordenar");
    }
  };

  // Carregar notas apenas se não foi inicializado
  useEffect(() => {
    if (!initialized) {
      fetchNotes();
    }
  }, [initialized]); // ← Remove 'loading' das dependências

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
