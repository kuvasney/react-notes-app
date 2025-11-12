import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiShare2 } from "react-icons/fi";

export default function ({
  link,
  shareToken: token,
}: {
  link?: string;
  shareToken?: string;
}) {
  const { t } = useLanguage();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: link || window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        const input = document.getElementById(
          `share-link-input-${token || ""}`
        ) as HTMLInputElement;
        input.select();
        input.setSelectionRange(0, 99999); // Para dispositivos móveis

        await navigator.clipboard.writeText(input.value);
        feedback(t("common.linkCopied"));
      } catch (error) {
        console.error("Erro ao copiar o link:", error);
      }
    }
  };

  function feedback(message: string) {
    setFeedbackMessage(message);
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3000);
  }

  return (
    <>
      <FiShare2 onClick={shareLink} />
      {feedbackMessage && (
        <div className="share-feedback">{feedbackMessage}</div>
      )}
      <input
        type="text"
        readOnly
        value={link || ""}
        style={{ position: "absolute", left: "-9999px" }}
        id={`share-link-input-${token || ""}`}
      />
    </>
  );
}
