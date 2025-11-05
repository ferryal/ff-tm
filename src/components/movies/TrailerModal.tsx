import { useEffect } from "react";
import { X } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/tmdb";

interface TrailerModalProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

export const TrailerModal = ({
  videoKey,
  title,
  onClose,
}: TrailerModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close trailer"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={getYouTubeEmbedUrl(videoKey, true)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
