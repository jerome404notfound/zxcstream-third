"use client";
import { useGlobalAdLink } from "@/lib/ad";
import type { MovieType } from "@/lib/getMovieData";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export function MovieCard({ movie }: { movie: MovieType }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : null;

  const fallbackUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOxgXTO4Kc4XORUFvZembSzymC7B6RYupJLQ&s";

  return (
    <Link
      href={`/${movie.media_type}/${movie.id}`}
      prefetch={true}
      className="relative group h-full w-full flex flex-col gap-1"
      onClick={useGlobalAdLink()}
    >
      <div className="relative h-full w-full aspect-[9/13] overflow-hidden flex justify-center items-center rounded-md">
        {/* Skeleton Loading */}
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full bg-zinc-500 rounded-md" />
        )}

        {/* Image */}
        <Image
          src={posterUrl || fallbackUrl}
          alt={movie.name || movie.title || "poster"}
          width={300}
          height={417}
          className={`object-cover group-hover:scale-105 transition-all duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
          }}
          loading="lazy"
        />

        {/* Rating Badge - only show when image is loaded */}
        {/* {imageLoaded && (
          <div className="absolute top-1.5 right-1.5 bg-black/50 rounded-full p-0.5">
            <CircularProgress value={movie.vote_average} />
          </div>
        )} */}

        {/* Hover Overlay - only show when image is loaded */}
        {imageLoaded && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Play size={30} className="text-white" />
          </div>
        )}
      </div>
    </Link>
  );
}
