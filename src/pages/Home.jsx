import { useEffect, useState } from "react";
import { Features } from "@/components/Features";
import { Hero } from "./Hero";
import { Footer } from "@/components/Footer";

export function Home() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("serverNoticeSeen");
    if (!seen) {
      setShowNotice(true);
    }
  }, []);

  const handleOk = () => {
    localStorage.setItem("serverNoticeSeen", "true");
    setShowNotice(false);
  };

  return (
    <div>
      {showNotice && (
        <div className="fixed top-0 left-0 w-full bg-yellow-300 text-black p-3 text-center z-50 shadow-md">
          ⚠️ This project is hosted on a free server. It may take 30–60 seconds to start (on first request).
          <button
            onClick={handleOk}
            className="ml-4 px-3 py-1 bg-black text-white rounded"
          >
            OK
          </button>
        </div>
      )}

      <Hero />
      <Features />
      <Footer />
    </div>
  );
}