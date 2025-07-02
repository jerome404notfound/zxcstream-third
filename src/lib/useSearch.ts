// import { useEffect, useState } from "react";
// import { MovieType } from "./getMovieData";
// interface SearchTypes {
//   query: string;
//   value: string;
//   page: number;
// }

// const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// export default function useSearch({ query, value, page }: SearchTypes) {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<MovieType[]>([]);

//   useEffect(() => {
//     if (query.trim() === "") {
//       setResult([]);
//       return;
//     }

//     setLoading(true);
//     const debounceTimer = setTimeout(() => {
//       const fetchData = async () => {
//         try {
//           const endpoint = `https://api.themoviedb.org/3/search/${value}?query=${encodeURIComponent(
//             query
//           )}&page=${page}&api_key=${apiKey}&include_adult=false`;

//           const response = await fetch(endpoint);
//           const data = await response.json();
//           setResult(data.results);
//         } catch (error) {
//           console.error(error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchData();
//     }, 1000);

//     return () => clearTimeout(debounceTimer);
//   }, [query, value, page]);

//   return { result, loading };
// }

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { MovieType } from "@/lib/getMovieData";

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export function useInfiniteSearch(query: string | null) {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);
  const requestInProgress = useRef(false);

  const fetchMovies = useCallback(
    async (pageNum: number, isNewSearch = false) => {
      if (!query || requestInProgress.current) return;

      requestInProgress.current = true;
      setLoading(true);
      setError(null);

      try {
        const endpoint = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          query
        )}&page=${pageNum}&api_key=${apiKey}&include_adult=false`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();

        const filtered = data.results.filter(
          (movie: MovieType) =>
            movie.poster_path &&
            movie.vote_average > 3 &&
            movie.vote_count > 100
        );

        if (filtered.length === 0) {
          setHasMore(false);
        }

        if (isNewSearch) {
          setMovies(filtered);
          setPage(1);
          setHasMore(true);
        } else {
          setMovies((prev) => [...prev, ...filtered]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        requestInProgress.current = false;
      }
    },
    [query]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore && query) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  }, [loading, hasMore, query, page, fetchMovies]);

  // Initial search when query changes
  useEffect(() => {
    if (query) {
      setMovies([]);
      setError(null);
      setHasMore(true);
      fetchMovies(1, true);
    }
  }, [query, fetchMovies]);

  // Intersection Observer setup
  useEffect(() => {
    if (!query) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore, query]);

  return {
    movies,
    loading,
    error,
    hasMore,
    observerRef,
    retry: () => fetchMovies(page),
  };
}

// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { MovieType } from "@/lib/getMovieData";
// import { Button } from "@/components/ui/button";
// import { MovieCard } from "@/app/card";
// import { Funnel, ListFilter } from "lucide-react";
// import Link from "next/link";
// import { useInfiniteSearch } from "@/lib/useSearch";
// import { Skeleton } from "@/components/ui/skeleton";
// const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
// export default function InterceptionSearch() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("q");
//   const { movies, loading, error, hasMore, observerRef, retry } =
//     useInfiniteSearch(query);

//   return (
//     <div className="overflow-auto h-screen w-full">
//       <div className="grid lg:grid-cols-6 grid-cols-3 w-[90%] mx-auto lg:gap-5 gap-2 lg:mt-30  mt-15">
//         <div className="flex justify-between items-center col-span-6">
//           <span className="space-x-2 flex">
//             <p> Search results for:</p>
//             <p className="text-blue-800"> {query}</p>
//           </span>

//           <Button variant="outline">
//             <ListFilter /> Filter
//           </Button>
//         </div>
//         {movies.map((meow) => (
//           <MovieCard movie={meow} key={meow.id} />
//         ))}
//       </div>
//       {loading && (
//         <>
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Skeleton key={`skeleton-${index}`} />
//           ))}
//         </>
//       )}

//       {!hasMore && movies.length > 0 && (
//         <div className="col-span-6 text-center py-8">
//           <p className="text-gray-500">No more results to show</p>
//         </div>
//       )}

//       {/* No Results */}
//       {!loading && movies.length === 0 && !error && (
//         <div className="col-span-6 text-center py-12">
//           <p className="text-gray-500 text-lg">No movies found for "{query}"</p>
//           <p className="text-gray-400 text-sm mt-2">
//             Try a different search term
//           </p>
//         </div>
//       )}
//       <div ref={observerRef} className="col-span-6 h-4" aria-hidden="true" />
//     </div>
//   );
// }
