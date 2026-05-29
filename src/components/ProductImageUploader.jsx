import { useRef } from "react";
import { UploadCloud, X } from "lucide-react";

export default function ProductImageUploader({ images = [], onChange }) {
  const fileRef = useRef();

  const handleFiles = (files) => {
    const remaining = 5 - images.length;

    const validFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .filter((file) => file.size <= 5 * 1024 * 1024);

    const newImgs = validFiles.slice(0, remaining).map((file) => ({
      url: URL.createObjectURL(file),
      file,
      name: file.name,
    }));

    onChange([...images, ...newImgs]);
  };

  const remove = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-5 sm:p-6 text-center cursor-pointer hover:bg-gray-50 transition"
      >
        <UploadCloud className="mx-auto w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-3" />

        <p className="text-sm sm:text-base text-gray-700 font-medium">
          Click to upload product images
        </p>

        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          First image will be default · Max 5 images
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-xl border border-gray-200"
            >
              <img
                src={img.url}
                alt=""
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border bg-white"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{img.name}</p>

                {i === 0 && (
                  <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                    Default
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => remove(i)}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
