import { useEffect } from "react";

interface UseEscapeKeyOptions {
  /**
   * Callback executado quando ESC é pressionado
   */
  onEscape: () => void;

  /**
   * Condição para ativar o listener (opcional)
   * Se não fornecida, sempre estará ativo
   */
  condition?: boolean;

  /**
   * Se deve prevenir o comportamento padrão (opcional)
   * Default: false
   */
  preventDefault?: boolean;
}

/**
 * Hook para detectar quando a tecla ESC é pressionada
 *
 * @param options - Opções de configuração
 *
 * @example
 * // Uso básico
 * useEscapeKey({ onEscape: () => setModalOpen(false) });
 *
 * @example
 * // Com condição
 * useEscapeKey({
 *   onEscape: clearSearch,
 *   condition: search.length > 0
 * });
 */
export function useEscapeKey({
  onEscape,
  condition = true,
  preventDefault = false,
}: UseEscapeKeyOptions) {
  useEffect(() => {
    // Se a condição for false, não adicionar o listener
    if (!condition) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (preventDefault) {
          event.preventDefault();
        }
        onEscape();
      }
    };

    // Adicionar event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup: remover event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEscape, condition, preventDefault]);
}
