"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useEffect, useMemo } from "react";
import { Clock, Zap, Coffee, Hourglass } from "lucide-react";
import type { MovieType } from "@/lib/getMovieData";
import ReusableSwiper from "./reusablePosterSwiper";

export default function RuntimeMovies() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(true);
  const [runtime, setRuntime] = useState<string>("quick");
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const runtimeOptions = useMemo(
    () => [
      {
        label: "Quick Watch",
        value: "quick",
        icon: <Zap />,
        range: "with_runtime.lte=90",
        description: "Under 90 min",
      },
      {
        label: "Coffee Break",
        value: "coffee",
        icon: <Coffee />,
        range: "with_runtime.gte=90&with_runtime.lte=120",
        description: "90-120 min",
      },
      {
        label: "Standard",
        value: "standard",
        icon: <Clock />,
        range: "with_runtime.gte=120&with_runtime.lte=150",
        description: "2-2.5 hours",
      },
      {
        label: "Epic",
        value: "epic",
        icon: <Hourglass />,
        range: "with_runtime.gte=150",
        description: "2.5+ hours",
      },
    ],
    []
  );

  useEffect(() => {
    async function fetchRuntimeMovies() {
      try {
        setLoading(true);
        const selectedRuntime = runtimeOptions.find((r) => r.value === runtime);
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${selectedRuntime?.range}&sort_by=vote_average.desc&vote_count.gte=500`
        );
        const data = await res.json();
        const media = data.results.map((movie: MovieType) => ({
          ...movie,
          media_type: "movie",
        }));
        setMovies(media);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchRuntimeMovies();
  }, [runtime, apiKey]);

  return (
    <ReusableSwiper
      title=""
      data={movies}
      loading={loading}
      media={runtime}
      setMedia={setRuntime}
      mediaOptions={runtimeOptions}
      numbering={false}
    />
  );
}
