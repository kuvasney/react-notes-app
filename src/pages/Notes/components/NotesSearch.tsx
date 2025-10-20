import { useState } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface NotesSearchProps {
  onSearchChange: (searchTerm: string) => void;
}

export default function NotesSearch({ onSearchChange }: NotesSearchProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // O form submit não é necessário para busca em tempo real
    // mas pode ser útil para outras ações futuras
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    // Chama o callback do componente pai em tempo real
    onSearchChange(value);
  };

  const clearSearch = () => {
    setSearch("");
    onSearchChange("");
  };

  // Detectar tecla Esc
  useEscapeKey({
    onEscape: clearSearch,
    condition: search.length > 0,
  });

  return (
    <div className="notes-search">
      <form onSubmit={handleSearch}>
        <div className="input-container">
          <input
            type="text"
            placeholder="🔍 Buscar nas notas..."
            value={search}
            onChange={handleInputChange}
          />
          {search && (
            <button
              type="button"
              className="clear-button"
              onClick={clearSearch}
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
