import { AlertTriangle, Home, RefreshCw, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "@/redux/errorSlice";
import "@/utils/ErrorPage.css";

const Error = ({ title: propTitle, message: propMessage, code: propCode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    title: reduxTitle,
    message: reduxMessage,
    code: reduxCode,
  } = useSelector((state) => state.error);

  const title = reduxTitle || propTitle || "Something went wrong";
  const message = reduxMessage || propMessage || "An unexpected error occurred.";
  const code = reduxCode || propCode || 500;
  const isNotFound = code === 404;

  const goHome = () => {
    dispatch(clearError());
    navigate("/");
  };

  return (
    <main className="error-page">
      <section className="error-card" aria-labelledby="error-title">
        <div className={`error-card__icon${isNotFound ? " error-card__icon--not-found" : ""}`} aria-hidden="true">
          {isNotFound ? <SearchX /> : <AlertTriangle />}
        </div>

        <p className="error-card__eyebrow">
          {isNotFound ? "Page not found" : "Something went wrong"}
        </p>
        {code && <span className="error-card__code">Error {code}</span>}

        <h1 id="error-title" className="error-card__title">
          {title}
        </h1>
        <p className="error-card__message">{message}</p>

        <div className="error-card__actions">
          <button
            type="button"
            onClick={goHome}
            className="error-card__button error-card__button--primary"
          >
            <Home aria-hidden="true" />
            Back to home
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="error-card__button error-card__button--secondary"
          >
            <RefreshCw aria-hidden="true" />
            Reload page
          </button>
        </div>
      </section>
    </main>
  );
};

export default Error;
