import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "@/redux/errorSlice";

const Error = ({ title: propTitle, message: propMessage, code: propCode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { title: reduxTitle, message: reduxMessage, code: reduxCode } = useSelector(
    (state) => state.error
  );

  const title = reduxTitle || propTitle;
  const message = reduxMessage || propMessage;
  const code = reduxCode || propCode;

  if (!title) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-2 bg-red-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center space-y-5">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-600 w-10 h-10" />
          </div>
        </div>

        {code && (
          <p className="text-sm text-gray-500 font-medium">
            Error Code: {code}
          </p>
        )}

        <h2 className="text-2xl font-bold text-red-500">{title}</h2>
        <p className="text-gray-600 text-sm">{message}</p>

        <div className="flex justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              dispatch(clearError());
              navigate("/");
            }}
            className="cursor-pointer bg-green-400 hover:bg-green-300 text-white "
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};


export default Error;
