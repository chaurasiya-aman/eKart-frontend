import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "@/utils/GlobalLoadingOverlay.css";

const SHOW_DELAY_MS = 300;

export default function GlobalLoadingOverlay() {
  const pendingRequests = useSelector(
    (state) => state.loading.pendingRequests,
  );
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (pendingRequests === 0) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      setIsVisible(false);
      return;
    }

    if (!isVisible && timerRef.current === null) {
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setIsVisible(true);
      }, SHOW_DELAY_MS);
    }
  }, [isVisible, pendingRequests]);

  useEffect(
    () => () => window.clearTimeout(timerRef.current),
    [],
  );

  if (!isVisible) return null;

  return (
    <div className="global-loading-overlay">
      <div className="global-loading-card" role="status" aria-live="polite">
        <span className="global-loading-spinner" aria-hidden="true" />
        <p className="global-loading-title">Please wait</p>
        <p className="global-loading-message">
          The server can take a moment to respond. We’re working on your request.
        </p>
      </div>
    </div>
  );
}
