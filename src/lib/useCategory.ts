"use client";
import { useEffect, useState } from "react";
import { MovieType } from "@/lib/getMovieData";
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export type StateSetter<T> = T | ((prev: T) => T);

export function useCategory({
  media_type,
  category,
}: {
  media_type: string;
  category: string;
}) {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [keywordId, setKeywordId] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [fromYear, setFromYear] = useState<number>(0);
  const [toYear, setToYear] = useState<number>(0);
  const [voteMin, setVoteMin] = useState<number>(0); // TMDB min is 0
  const [voteMax, setVoteMax] = useState<number>(0); // TMDB max is 10
  const genreParam = selectedGenres.join(",");
  const companyParam = selectedCompanies.join(",");
  const networkParam = selectedNetworks.join(",");

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [
    genreParam,
    companyParam,
    networkParam,
    keywordId,
    toYear,
    fromYear,
    voteMin,
    voteMax,
  ]);
  useEffect(() => {
    async function fetchPopular() {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        const endpoint = `https://api.themoviedb.org/3/discover/${media_type}?api_key=${apiKey}&sort_by=${
          category === "popular"
            ? "popularity.desc&vote_count.gte=200"
            : category === "top-rated"
            ? "vote_average.desc&vote_count.gte=200"
            : category === "coming-soon"
            ? media_type === "movie"
              ? "primary_release_date.asc&primary_release_date.gte=" +
                new Date().toISOString().split("T")[0]
              : "first_air_date.asc&first_air_date.gte=" +
                new Date().toISOString().split("T")[0]
            : ""
        }
          &language=en-US&page=${page}${
          genreParam ? `&with_genres=${genreParam}` : ""
        }${
          media_type === "movie"
            ? companyParam
              ? `&with_companies=${companyParam}`
              : ""
            : networkParam
            ? `&with_networks=${networkParam}`
            : ""
        }${keywordId ? `&with_keywords=${keywordId}` : ""}${
          selectedRegion ? `&with_origin_country=${selectedRegion}` : ""
        }${
          fromYear && toYear
            ? media_type === "movie"
              ? `&primary_release_date.gte=${fromYear}-01-01&primary_release_date.lte=${toYear}-12-31`
              : `&first_air_date.gte=${fromYear}-01-01&first_air_date.lte=${toYear}-12-31`
            : ""
        }${
          voteMin && voteMax
            ? `&vote_average.gte=${voteMin}&vote_average.lte=${voteMax}`
            : ""
        }`;

        console.log(endpoint);
        const res = await fetch(endpoint);
        const data = await res.json();
        setTotalPages(data.total_pages);
        const media = data.results.map((movie: MovieType) => ({
          ...movie,
          media_type,
        }));
        if (page === 1) {
          setMovies(media);
        } else {
          setMovies((prev) => [...prev, ...media]);
        }
      } catch (error) {
        console.error(error, "error");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    fetchPopular();
  }, [
    page,
    genreParam,
    companyParam,
    networkParam,
    apiKey,
    keywordId,
    selectedRegion,
    fromYear,
    toYear,
    voteMin,
    voteMax,
  ]);

  return {
    movies,
    loading,
    loadingMore,
    pagination: {
      totalPages,
      page,
      setPage,
    },
    filters: {
      selectedGenres,
      setSelectedGenres,
      selectedCompanies,
      setSelectedCompanies,
      selectedNetworks,
      setSelectedNetworks,
      keywordId,
      setKeywordId,
      selectedRegion,
      setSelectedRegion,
      fromYear,
      setFromYear,
      toYear,
      setToYear,
      voteMin,
      setVoteMin,
      voteMax,
      setVoteMax,
    },
  };
}
