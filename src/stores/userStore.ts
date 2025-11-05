import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@/types";

interface UserState {
  // Estado
  user: User | null;

  // Ações
  setUser: (user: User | null) => void;
  getUser: () => User | null;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      user: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user") || "null")
        : null,

      // Ações
      setUser: (user) => set({ user }),

      // Seletores
      getUser: () => get().user,
    }),
    {
      name: "user-store", // Nome que aparecerá no DevTools
      // Serializar apenas em desenvolvimento
      serialize: import.meta.env.DEV,
      // Limitar número de actions no histórico
      actionType: import.meta.env.DEV ? "user" : undefined,
    }
  )
);
