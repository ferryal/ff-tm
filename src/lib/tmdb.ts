const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getTMDBImageUrl = (
  path: string | null,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string => {
  if (!path) {
    return "https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image";
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getYouTubeUrl = (key: string): string => {
  return `https://www.youtube.com/watch?v=${key}`;
};

export const getYouTubeEmbedUrl = (
  key: string,
  autoplay: boolean = true
): string => {
  const autoplayParam = autoplay ? "&autoplay=1" : "";
  return `https://www.youtube.com/embed/${key}?mute=0${autoplayParam}`;
};

export const getYouTubeThumbnail = (key: string): string => {
  return `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;
};

export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getYear = (dateString: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).getFullYear().toString();
};
