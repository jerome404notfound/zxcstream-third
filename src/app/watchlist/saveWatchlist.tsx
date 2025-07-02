export interface SaveWatchlistType {
  id: string;
  title: string;
  media_type: string;
  backdrop: string;
  year: string;
}

export function SaveWatchlist({
  id,
  title,
  media_type,
  backdrop,
  year,
}: SaveWatchlistType) {
  if (!id || !media_type || !backdrop || !year) return;
  const watchlistData = {
    id,
    title,
    media_type,
    backdrop,
    year,
  };

  const insertWatchlist = JSON.parse(
    localStorage.getItem("watchlistData") || "[]"
  );

  const filteredWatchlist = insertWatchlist.filter(
    (item: SaveWatchlistType) => item.id !== id
  );

  const combineData = [watchlistData, ...filteredWatchlist];
  localStorage.setItem("watchlistData", JSON.stringify(combineData));
}
