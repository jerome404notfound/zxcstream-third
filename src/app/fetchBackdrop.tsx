import { useEffect, useState } from "react";
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
interface ImageTypes {
  iso_639_1: string;
  file_path: string;
}
export default function TmdbBackdrop({
  id,
  mediaType,
}: {
  id: string;
  mediaType: string;
}) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      const res = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${id}/images?api_key=${apiKey}`
      );
      const data = await res.json();
      console.log(data);
      const normal = data.backdrops.find(
        (meow: ImageTypes) => meow.iso_639_1 === null
      );

      const imageUrl = normal
        ? `https://image.tmdb.org/t/p/w1280${normal.file_path}`
        : null;

      setImage(imageUrl);
    }
    fetchImage();
  }, []);

  return image ? (
    <img
      className="mask-gradient pointer-events-none"
      src={image}
      alt="TMDB Logo"
    />
  ) : null;
}
