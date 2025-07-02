"use client";
import { useEffect, useState } from "react";
interface MovieType {
  id: number;
  title?: string;
  tagline: string;
  name?: string;
  vote_average: number;
  poster_path: string;
  still_path: string;
  overview: string;
  media_type: string;
  runtime: string;
  episode_number: string;
}
interface EpisodeListProps {
  id: string;
  season: string;
}

export default function useEpisode({ id, season }: EpisodeListProps) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const [episode, setEpisode] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function episodeFetch() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${apiKey}&language=en-US`
        );
        const data = await res.json();
        setEpisode(data.episodes || []);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
        setEpisode([]);
      } finally {
        setLoading(false);
      }
    }
    episodeFetch();
  }, [id, season, apiKey]);

  return { episode, loading };
}
