export interface SaveProgressType {
  id: string;
  media_type: string;
  title: string;
  currentTime: number;
  duration: number;
  backdrop: string;
  isComplete: boolean;
  season?: string;
  episode?: string;
  releaseDate: string;
  serverName: string;
}

export function SaveProgress({
  id,
  media_type,
  title,
  currentTime,
  duration,
  backdrop,
  isComplete,
  season,
  episode,
  releaseDate,
  serverName,
}: SaveProgressType) {
  if (!id || !media_type || !title || currentTime === 0 || duration === 0)
    return;

  const watchingData = {
    id,
    media_type,
    backdrop,
    serverName,
    releaseDate,
    title,
    duration,
    currentTime,
    isComplete,
    season: season || null,
    episode: episode || null,
  };

  const insertLocal = JSON.parse(localStorage.getItem("recentlyWatch") || "[]");

  const filteredId = insertLocal.filter(
    (item: SaveProgressType) => item.id !== id
  );

  const combineUpdate = [watchingData, ...filteredId];

  localStorage.setItem("recentlyWatch", JSON.stringify(combineUpdate));
  window.dispatchEvent(new Event("storage-update"));
}
