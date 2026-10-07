import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { clearError } from "@/redux/errorSlice";
import "@/utils/GlobalErrorModal.css";

export default function GlobalErrorModal() {
  const dispatch = useDispatch();
  const { title, message, code } = useSelector((state) => state.error);
  const isOpen = Boolean(title || message || code);

  useEffect(() => {
    if (isOpen) toast.dismiss();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") dispatch(clearError());
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="global-error-backdrop">
      <section
        className="global-error-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="global-error-title"
        aria-describedby="global-error-message"
      >
        <div className="global-error-modal__icon" aria-hidden="true">
          <AlertTriangle />
        </div>
        {code && <span className="global-error-modal__code">Error {code}</span>}
        <h2 id="global-error-title" className="global-error-modal__title">
          {title || "Something went wrong"}
        </h2>
        <p id="global-error-message" className="global-error-modal__message">
          {message || "Please try again in a moment."}
        </p>
        <button
          type="button"
          className="global-error-modal__button"
          onClick={() => dispatch(clearError())}
          autoFocus
        >
          OK
        </button>
      </section>
    </div>
  );
}
