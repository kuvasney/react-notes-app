import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotesStore } from "@/stores/notesStore";
import { useNotesApi } from "@/hooks/useNotesApi";
import {
  FiRefreshCw,
  FiPlusCircle,
  FiFileText,
  FiArchive,
} from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotesNavigator() {
  const { isLoggedIn } = useAuth();
  const isAuthenticated =
    isLoggedIn || localStorage.getItem("isLoggedIn") === "true";
  const [isNotes, setIsNotes] = useState(location.pathname === "/notes");
  const [isArchive, setIsArchive] = useState(
    location.pathname === "/notes/archive"
  );
  const { setShowCreateForm } = useNotesStore();
  const { fetchNotes } = useNotesApi();

  const { t } = useLanguage();

  useEffect(() => {
    setIsNotes(location.pathname === "/notes");
    setIsArchive(location.pathname === "/notes/archive");
  }, [location.pathname, isLoggedIn]);

  function refetchNotes(archived: boolean) {
    fetchNotes(archived);
  }

  function openCreateNote() {
    scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setShowCreateForm(true);
  }

  return (
    <section className="notes-navigator">
      <div className="wrapper-buttons">
        {isAuthenticated && (
          <>
            {!isArchive && (
              <NavLink
                to="/notes/archive"
                className="button-link"
                title={t("navigation.archivedNotes")}
              >
                <FiArchive />
              </NavLink>
            )}

            {!isNotes && (
              <NavLink
                to="/notes"
                className="button-link"
                title={t("navigation.notes")}
              >
                <FiFileText />
              </NavLink>
            )}
            {isNotes && (
              <>
                <button
                  className="create-note-button"
                  onClick={() => openCreateNote()}
                  title={t("navigation.createNote")}
                >
                  <FiPlusCircle />
                </button>
                <button
                  onClick={() => refetchNotes(!isNotes)}
                  title={t("navigation.reloadNotes")}
                >
                  <FiRefreshCw />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
