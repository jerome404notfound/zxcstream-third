"use client";
import { useEffect, useState } from "react";

interface PartsType {
  id: string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  media_type: string;
  release_date: string;
  vote_average: number;
}

interface CollectionType {
  id: string;
  name: string;
  parts: PartsType[];
}

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function useCollection(id?: string) {
  const [collection, setCollection] = useState<CollectionType | null>(null);

  useEffect(() => {
    async function fetchCollection() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/collection/${id}?api_key=${apiKey}&language=en-US&append_to_response=images&include_image_language=en,null`
        );

        const data = await res.json();
        console.log(id);
        setCollection(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (id) fetchCollection();
  }, [id]);

  return { collection };
}
