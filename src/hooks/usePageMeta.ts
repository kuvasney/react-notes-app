import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description?: string;
}

export const usePageMeta = ({ title, description }: PageMetaProps) => {
  useEffect(() => {
    // Atualizar o título da página
    document.title = title;

    // Atualizar ou criar a meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');

      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }

      metaDescription.setAttribute("content", description);
    }

    // Cleanup: restaurar título padrão ao desmontar (opcional)
    return () => {
      document.title = "Take Note";
    };
  }, [title, description]);
};
