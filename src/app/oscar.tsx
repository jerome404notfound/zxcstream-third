"use client";

import { SpotLightItem, Spotlight } from "@/components/ui/main-spotlight";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MovieTypes {
  id: number;
  title?: string;
  tagline: string;
  name?: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  backdrop_path: string;
  overview: string;
  media_type: string;
  profile_path: string;
}

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OSCAR_ID = 1064213;

export default function Oscar() {
  const [movie, setMovie] = useState<MovieTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOscar() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${OSCAR_ID}?api_key=${apiKey}&language=en-US`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOscar();
  }, []);

  return (
    <Spotlight>
      <SpotLightItem className="h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] rounded-md w-[95%] sm:w-[92%] lg:w-[90%] xl:w-[85%] mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-20 shadow-md">
        <div className="relative h-full rounded-md overflow-hidden z-10">
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gray-900 rounded-md">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="text-gray-300 text-sm">Loading...</p>
              </div>
            </div>
          ) : (
            movie && (
              <>
                <img
                  loading="lazy"
                  className="absolute h-[200%] w-full object-cover brightness-[0.15] sm:brightness-[0.12] lg:brightness-10"
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={movie.title}
                  onError={(e) => {
                    e.currentTarget.src = "/fallback.jpg";
                  }}
                />
                <div className="relative z-10 h-full w-full flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8">
                  {/* Poster Image */}
                  <div className="w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] xl:w-[200px] flex-shrink-0 rounded-md overflow-hidden shadow-lg">
                    <img
                      loading="lazy"
                      className="h-full w-full object-cover"
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                      onError={(e) => {
                        e.currentTarget.src = "/fallback.jpg";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-gray-300 py-1 sm:py-2 md:py-3 flex flex-col justify-between">
                    <div className="space-y-1 sm:space-y-2 md:space-y-3">
                      <Badge className="text-[10px] sm:text-xs bg-yellow-600 hover:bg-yellow-700 text-white">
                        Oscar 97th Academy Awards Winner
                      </Badge>

                      <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold leading-tight">
                        {movie.title}
                      </h1>

                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 text-[10px] sm:text-xs">
                        <span>
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                        <span className="text-gray-500">|</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                          <span>
                            {String(movie.vote_average).slice(0, 3)}/10
                          </span>
                        </div>
                        <span className="text-gray-500">|</span>
                        <Badge
                          variant="outline"
                          className="text-[10px] sm:text-xs border-gray-600 text-gray-300"
                        >
                          Movie
                        </Badge>
                      </div>

                      <p className="text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 md:line-clamp-4 lg:line-clamp-none">
                        {movie.overview}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 xl:mt-9 w-fit text-xs sm:text-sm bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      Watch Now
                      <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </SpotLightItem>
    </Spotlight>
  );
}
