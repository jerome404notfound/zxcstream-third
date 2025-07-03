"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useEffect } from "react";
import { useMemo } from "react";

import { Film, Tv, LibraryBig } from "lucide-react";
import { MovieType } from "@/lib/getMovieData";
import ReusableSwiper from "./reusablePosterSwiper";

export default function Ten() {
  const [weekly, setWeekly] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(true);

  const [media, setMedia] = useState<string>("all");
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const mediaOptions = useMemo(
    () => [
      { label: "All", value: "all", icon: <LibraryBig /> },
      { label: "Movie", value: "movie", icon: <Film /> },
      { label: "TV", value: "tv", icon: <Tv /> },
    ],
    []
  );
  useEffect(() => {
    async function fetchWeekly() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/${media}/week?api_key=${apiKey}`
        );
        const data = await res.json();
        setWeekly(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeekly();
  }, [media, apiKey]);
  return (
    <ReusableSwiper
      title="TOP 20"
      data={weekly}
      loading={loading}
      media={media}
      setMedia={setMedia}
      mediaOptions={mediaOptions}
      numbering={true}
    />
  );
}
