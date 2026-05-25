import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "@/redux/errorSlice";

const Error = ({ title: propTitle, message: propMessage, code: propCode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    title: reduxTitle,
    message: reduxMessage,
    code: reduxCode,
  } = useSelector((state) => state.error);

  const title = reduxTitle || propTitle || "Something Went Wrong";
  const message =
    reduxMessage ||
    propMessage ||
    "An unexpected error occurred.";
  const code = reduxCode || propCode || 500;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-3xl mb-6">
          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
        </div>

        {code && (
          <span className="inline-block text-xs font-semibold bg-red-100 text-red-500 px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Error {code}
          </span>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
          {title}
        </h1>

        <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              dispatch(clearError());
              navigate("/");
            }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;