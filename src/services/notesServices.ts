import {
  buildApiUrl,
  API_ENDPOINTS,
  getAuthHeaders,
  apiFetch,
} from "@/config/api";

import { transformNoteForMongo } from "@/utils/apiTransforms";

import type { Note } from "@/types/Note";

export interface NotesResponse {
  notes: Note[];
  pagination: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const fetchNotes = async (archived: boolean): Promise<NotesResponse> => {
  const response = await apiFetch(
    buildApiUrl(API_ENDPOINTS.notes + `?archived=${archived}`),
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Erro ao carregar notas: ${response.statusText}`);
  }

  return response.json();
};

export const createNote = async (newNote: Note): Promise<Note> => {
  const response = await apiFetch(buildApiUrl(API_ENDPOINTS.notes), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(transformNoteForMongo(newNote)),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar na API");
  }

  return response.json();
};

export const updateNote = async (noteToEdit: Note): Promise<Note> => {
  const response = await apiFetch(
    buildApiUrl(`${API_ENDPOINTS.notes}/${noteToEdit._id}`),
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(transformNoteForMongo(noteToEdit)),
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao editar na API");
  }

  return response.json();
};

export const deleteNote = async (noteId: string) => {
  const response = await apiFetch(
    buildApiUrl(`${API_ENDPOINTS.notes}/${noteId}`),
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao deletar nota");
  }
};
