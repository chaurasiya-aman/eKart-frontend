const STATUS_MESSAGES = {
  400: "Some of the information is missing or invalid. Check the form and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to do that.",
  404: "We couldn't find the requested information.",
  409: "This change conflicts with the current information. Refresh and try again.",
  413: "The selected file or request is too large.",
  422: "Some of the information is invalid. Check the form and try again.",
  429: "Too many requests were made. Please wait a moment and try again.",
};

const isUsefulMessage = (message) =>
  typeof message === "string" &&
  message.trim() &&
  !/^internal server error$/i.test(message.trim()) &&
  !/^request failed with status code \d+$/i.test(message.trim()) &&
  !/(MongoServerError|MongooseError|CastError|ValidationError|ECONNREFUSED|\bat [^\n]+\([^)]+:\d+:\d+\))/i.test(message);

export const getErrorMessage = (error, fallback = "We couldn't complete your request. Please try again.") => {
  const data = error?.response?.data;
  const serverMessage = data?.message || data?.error;

  if (isUsefulMessage(serverMessage)) return serverMessage.trim();
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((item) => item.message || item).filter(Boolean).join(" ");
  }

  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return "The request took too long. Check your connection and try again.";
  }
  if (!error?.response) {
    return "We couldn't reach the server. Check your internet connection and try again.";
  }

  return STATUS_MESSAGES[error.response.status] || fallback;
};
