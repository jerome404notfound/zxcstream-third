import Link from "next/link";
import { SaveProgressType } from "./@modal/(.)watch/save-progress";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

export default function BackdropCard({ movie }: { movie: SaveProgressType }) {
  const releaseDate = new Date(movie.releaseDate).getFullYear() || "N/A";
  const progress =
    movie.duration && movie.duration > 0
      ? (movie.currentTime / movie.duration) * 100
      : 0;

  const posterUrl = movie.backdrop
    ? `https://image.tmdb.org/t/p/w1280/${movie.backdrop}`
    : null;
  const fallbackUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOxgXTO4Kc4XORUFvZembSzymC7B6RYupJLQ&s";

  return (
    <Link
      href={`watch/${movie.media_type}/${movie.id}${
        movie.media_type === "tv" ? `/${movie.season}/${movie.episode}` : ""
      }?server=${movie.serverName}`}
      prefetch={true}
      scroll={false}
      className="relative h-full w-full flex flex-col gap-1 lg:aspect-[11/8] aspect-[10/8]"
    >
      <div className="relative h-full w-full  overflow-hidden flex justify-center items-center  rounded-md">
        <Image
          src={posterUrl || fallbackUrl}
          alt={movie.title || "poster"}
          width={300}
          height={417}
          className=" object-cover"
        />
      </div>
      <Progress value={progress} className="w-full" />
      <div className="flex justify-between gap-2 mt-1">
        <h1 className="truncate text-xs font-light lg:text-sm">
          {movie.title || "N/A"}
        </h1>
        {movie.media_type === "movie"
          ? releaseDate && (
              <p className=" text-xs font-light lg:text-sm">{releaseDate}</p>
            )
          : movie.season &&
            movie.episode && (
              <p className=" text-xs font-light lg:text-sm">
                S{movie.season}E{movie.episode}
              </p>
            )}
      </div>
    </Link>
  );
}
