"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useEffect, useMemo } from "react";
import { Clock, Calendar, Star } from "lucide-react";
import { MovieType } from "@/lib/getMovieData";
import ReusableSwiper from "./reusablePosterSwiper";
export default function ClassicMovies() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(true);
  const [decade, setDecade] = useState<string>("1980");
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const decadeOptions = useMemo(
    () => [
      { label: "80s", value: "1980", icon: <Clock /> },
      { label: "90s", value: "1990", icon: <Calendar /> },
      { label: "2000s", value: "2000", icon: <Star /> },
    ],
    []
  );

  useEffect(() => {
    async function fetchClassicMovies() {
      try {
        setLoading(true);
        const endYear = parseInt(decade) + 9;
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${decade}-01-01&primary_release_date.lte=${endYear}-12-31&sort_by=vote_average.desc&vote_count.gte=1000`
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
    fetchClassicMovies();
  }, [decade, apiKey]);
  return (
    <ReusableSwiper
      title="Classic"
      data={movies}
      loading={loading}
      media={decade}
      setMedia={setDecade}
      mediaOptions={decadeOptions}
      numbering={false}
    />
  );
}
