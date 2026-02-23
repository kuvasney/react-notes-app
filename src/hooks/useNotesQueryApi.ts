import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/services/notesServices";

import type { Note } from "@/types/Note";

interface NotesResponse {
  notes: Note[];
  pagination: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const useNotesQueryApi = (archived = false) => {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["notes", archived],
    queryFn: () => fetchNotes(archived),
  });

  const saveNoteMutation = useMutation({
    mutationFn: createNote,
    // utilizando o optmistic update usando setQueryData
    onMutate: async (newNote: Note) => {
      await queryClient.cancelQueries({ queryKey: ["notes", archived] });

      const previous = queryClient.getQueryData<NotesResponse>([
        "notes",
        archived,
      ]);

      const optimisticNote = { ...newNote, _id: `temp-${Date.now()}` };

      queryClient.setQueryData<NotesResponse>(["notes", archived], (old) => ({
        notes: [optimisticNote, ...(old?.notes ?? [])],
        pagination: old?.pagination ?? {},
      }));

      return { previous };
    },
    onError: (_err, _newNote, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notes", archived], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", archived] });
    },
  });

  const editNoteMutation = useMutation({
    mutationFn: (note: Note) => {
      console.log("note", note);
      return updateNote(note);
    },
    onSuccess: () => {
      invalidateNotes();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      invalidateNotes();
    },
  });

  const invalidateNotes = () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return {
    notes: (notesQuery.data?.notes ?? []) as Note[],
    pagination: notesQuery.data?.pagination,
    isNotesLoading: notesQuery.isLoading,
    isNotesError: notesQuery.isError,
    invalidateNotes,
    saveNote: saveNoteMutation.mutate,
    isSavingNote: saveNoteMutation.isPending,
    isErrorSavingNote: saveNoteMutation.isError,
    editNote: editNoteMutation.mutate,
    isEditingNote: editNoteMutation.isPending,
    isErrorEditingNote: editNoteMutation.isError,
    removeNote: deleteNoteMutation.mutate,
    isErrorDeletingNote: deleteNoteMutation.isError,
  };
};
