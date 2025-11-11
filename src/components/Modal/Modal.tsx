import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiXCircle } from "react-icons/fi";
import "./Modal.scss";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ show, onClose, children }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      // Abre o modal
      setIsVisible(true);
      // Pequeno delay para trigger da animação
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      // Fecha o modal com animação
      setIsAnimating(false);
      // Aguarda a animação terminar antes de remover do DOM
      const timeout = setTimeout(() => setIsVisible(false), 300); // 300ms = duração da transição
      return () => clearTimeout(timeout);
    }
  }, [show]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className={`modal-container ${isAnimating ? "show" : ""}`}
      draggable="false"
    >
      <div className="modal-background" onClick={onClose} />
      <button className="modal-close" title="Close Modal" onClick={onClose}>
        <FiXCircle />
      </button>
      <div className="modal-content">
        <button className="modal-close" title="Close Modal" onClick={onClose}>
          <FiXCircle />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
