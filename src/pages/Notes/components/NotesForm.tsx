import { useState } from "react";
import "./NotesContent.scss";

export default function NotesForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  };

  return (
    <div className="notes-form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <textarea
            placeholder="Your note here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
          ></textarea>
        </div>

        <div className="input-container">
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isLoading}
          >
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
