import { FiUnlock } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import Share from "./Share";

export default function ({ shareToken }: { shareToken?: string }) {
  const { t } = useLanguage();

  return (
    <div className="public-label">
      <Share
        link={
          shareToken
            ? `${window.location.origin}/public-note/${shareToken}`
            : ""
        }
      />
      <FiUnlock /> {t("notes.public")}
    </div>
  );
}
