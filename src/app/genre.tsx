"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useEffect, useMemo } from "react";
import { Zap, Heart, Laugh, Skull } from "lucide-react";
import type { MovieType } from "@/lib/getMovieData";
import ReusableSwiper from "./reusablePosterSwiper";
export default function GenreMovies() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState<string>("28");
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const genreOptions = useMemo(
    () => [
      { label: "Action", value: "28", icon: <Zap /> },
      { label: "Romance", value: "10749", icon: <Heart /> },
      { label: "Comedy", value: "35", icon: <Laugh /> },
      { label: "Horror", value: "27", icon: <Skull /> },
    ],
    []
  );

  useEffect(() => {
    async function fetchGenreMovies() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&sort_by=popularity.desc`
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
    fetchGenreMovies();
  }, [genre, apiKey]);

  return (
    <ReusableSwiper
      title=""
      data={movies}
      loading={loading}
      media={genre}
      setMedia={setGenre}
      mediaOptions={genreOptions}
      numbering={false}
    />
  );
}
