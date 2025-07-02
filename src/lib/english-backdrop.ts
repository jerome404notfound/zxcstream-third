import { useEffect, useState } from "react";

type TMDBImage = {
  iso_639_1: string | null;
  file_path: string;
};
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export default function useEnglishBackdrop({
  id,
  media_type,
}: {
  id: string;
  media_type: string;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchImage() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${id}/images?api_key=${apiKey}`
        );
        const data = await res.json();
        const englishBackdrop = data.backdrops.find(
          (i: TMDBImage) => i.iso_639_1 === "en"
        );

        setImage(englishBackdrop?.file_path);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchImage();
  }, [id, media_type]);

  return { image, loading };
}
