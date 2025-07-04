"use client";
import { useSimpleAdLink } from "@/lib/ad";
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
    >
      <div
        className="relative h-full w-full aspect-[9/13] overflow-hidden flex justify-center items-center rounded-md"
        onClick={useSimpleAdLink()}
      >
        {/* Skeleton Loading */}
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full bg-zinc-500 rounded-md" />
        )}

        <Image
          src={posterUrl || fallbackUrl}
          alt={movie.name || movie.title || "poster"}
          unoptimized={true}
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

        {imageLoaded && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Play size={30} className="text-white" />
          </div>
        )}
      </div>
    </Link>
  );
}
