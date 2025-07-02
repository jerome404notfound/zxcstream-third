"use client";
import { useState, useEffect } from "react";
import { MovieType } from "@/lib/getMovieData";

interface showlistType {
  id: string;
  media_type: string;
}
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export default function useFetchTmdb(showlist: showlistType[]) {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function fetchData() {
      try {
        if (showlist.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }
        setLoading(true);
        const results = await Promise.all(
          showlist.map(async (item) => {
            const res = await fetch(
              `https://api.themoviedb.org/3/${item.media_type}/${
                item.id
              }?api_key=${apiKey}&language=en-US${
                item.media_type === "movie"
                  ? "&append_to_response=release_dates"
                  : "&append_to_response=content_ratings"
              }`
            );
            const data = await res.json();
            return {
              ...data,
              media_type: item.media_type, // ✅ include media_type from showlist
            } as MovieType;
          })
        );
        setMovies(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [showlist]);

  return { movies, loading };
}
