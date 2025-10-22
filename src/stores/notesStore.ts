import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Note } from "@/types";

interface NotesState {
  // Estado
  notes: Note[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Ações
  setNotes: (notes: Note[]) => void;
  setInitialized: (initialized: boolean) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  reorderNotes: (reorderedNotes: Note[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Seletores computados
  getActiveNotes: () => Note[];
  getArchivedNotes: () => Note[];
  getPinnedNotes: () => Note[];
}

export const useNotesStore = create<NotesState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      notes: [],
      loading: false,
      error: null,
      initialized: false,

      // Ações
      setNotes: (notes) => set({ notes, initialized: true }),
      setInitialized: (initialized) => set({ initialized }),

      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),

      updateNote: (id, updatedNote) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  ...updatedNote,
                  dataUltimaEdicao: new Date().toISOString(),
                }
              : note
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),

      reorderNotes: (reorderedNotes) => set({ notes: reorderedNotes }),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          notes: [],
          initialized: false,
          loading: false,
          error: null,
        }),

      // Seletores
      getActiveNotes: () => get().notes.filter((note) => !note.archived),
      getArchivedNotes: () => get().notes.filter((note) => note.archived),
      getPinnedNotes: () =>
        get().notes.filter((note) => note.fixada && !note.archived),
    }),
    {
      name: "notes-store", // Nome que aparecerá no DevTools
      // Serializar apenas em desenvolvimento
      serialize: import.meta.env.DEV,
      // Limitar número de actions no histórico
      actionType: import.meta.env.DEV ? "notes" : undefined,
    }
  )
);
