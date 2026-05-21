import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children, actionLabel, onAction, actionVariant = "primary" }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-107.5 bg-white rounded-t-4xl p-6 pb-10 animate-slide-up z-10">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
          <X size={15} className="text-gray-500" />
        </button>
        {title && <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">{title}</h2>}
        <div className="mb-5">{children}</div>
        {actionLabel && (
          <Button variant={actionVariant} onClick={onAction}>{actionLabel}</Button>
        )}
      </div>
    </div>
  );
};

export default Modal;