import { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";

export default function Tooltip({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="tooltip"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FiHelpCircle />
      {hovered && <div className="tooltip-content">{children}</div>}
    </div>
  );
}
