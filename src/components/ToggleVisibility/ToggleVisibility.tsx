import { FiEye, FiEyeOff } from "react-icons/fi";

interface Props {
  isVisible?: boolean;
  onToggle?: (isVisible: boolean) => void;
}

export default function ToggleVisibility({ isVisible, onToggle }: Props) {
  if (isVisible !== undefined && onToggle) {
    // Comportamento controlado pelo pai
    const togglePasswordVisibility = () => {
      onToggle(!isVisible);
    };

    return (
      <span className="toggle-password" onClick={togglePasswordVisibility}>
        {isVisible ? <FiEyeOff /> : <FiEye />}
      </span>
    );
  }
}
