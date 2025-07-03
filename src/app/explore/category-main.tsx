"use client";
import { MovieType } from "@/lib/getMovieData";
import dynamic from "next/dynamic";
import { MovieCard } from "../../components/card-poster";
import { Button } from "@/components/ui/button";
import { Info, LoaderCircleIcon, Play, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
const CategoryFilter = dynamic(() => import("./category-filter"), {
  loading: () => <p>loading</p>,
});
import { CategoryFilterProps } from "./category-filter";
export interface CategoryProps extends CategoryFilterProps {
  movies: MovieType[];
  loading: boolean;
  loadingMore: boolean;
  category: string;
  totalPages: number;
  page: number;
}
export default function ReusableCategory({
  movies,
  loading,
  loadingMore,
  category,
  totalPages,
  page,
  media_type,
  setPage,
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
}: CategoryProps) {
  const SkeletonLoading = () => {
    return (
      <div className="absolute w-full lg:w-1/2 lg:bottom-15 bottom-0 right-[unset] lg:right-25  z-20 text-white zxc flex justify-center">
        <div className=" flex-col items-end gap-1 hidden lg:flex w-full">
          <Skeleton className="h-5 w-40 lg:h-8 lg:w-70 bg-zinc-500" />
          <Skeleton className="h-8 w-54 lg:h-15 lg:w-full  bg-zinc-500" />
          <Skeleton className="w-[90%] h-4 lg:h-5 lg:w-full  bg-zinc-500" />
          <Skeleton className="w-1/2 h-4 lg:h-5 lg:w-90  bg-zinc-500" />
          <Skeleton className="h-6 w-6 lg:h-8 lg:w-8 bg-zinc-500" />
        </div>
        <div className=" grid grid-cols-3 w-[180px] gap-3 lg:hidden">
          <Skeleton className="h-5 w-full  bg-zinc-500" />
          <Skeleton className="h-5 w-full  bg-zinc-500" />
          <Skeleton className="h-5 w-full  bg-zinc-500" />
          <Skeleton className="h-8 w-full col-span-3  bg-zinc-500" />
        </div>
      </div>
    );
  };

  const HeroComponent = () => {
    return movies?.slice(0, 1).map((meow) => (
      <div key={meow.id} className=" overflow-hidden bg-amber-300">
        <div className="absolute w-[calc(100%-40px)] lg:w-1/2 bottom-15 right-5 lg:right-25 z-10 text-white   flex-col items-end hidden lg:flex">
          <span className="lg:text-5xl text-3xl tracking-[-5px] lg:tracking-[-9px] font-bold zxczxc text-right mt-1 mb-2 lg:mt-2 lg:mb-4 drop-shadow-lg drop-shadow-black/50">
            {(meow.title || meow.name)?.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-yellow-500">
              {(meow.title || meow.name)?.split(" ").pop()}
            </span>
          </span>
          <p className="text-right text-xs lg:text-base line-clamp-3 zxc">
            {meow.overview || "No description available."}
          </p>
          <div className="mt-5 space-x-2">
            <Link
              href={`/watch/${media_type}/${meow.id}${
                media_type === "tv" ? "/1/1" : ""
              }`}
              prefetch={true}
              scroll={false}
            >
              <Button variant="secondary">
                <Play />
                Play Now
              </Button>
            </Link>
            <Link
              href={`/${media_type}/${meow.id}`}
              prefetch={true}
              scroll={false}
            >
              <Button variant="outline">
                <Info />
                More Info
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 transform translate-x-[50%] right-[50%] lg:hidden grid grid-cols-3 gap-3 z-20 ">
          <Badge className="w-full" variant="outline">
            {meow.media_type === "movie" ? "Movie" : "TV"}
          </Badge>
          <Badge className="w-full" variant="outline">
            {meow.media_type === "movie"
              ? meow.release_date?.slice(0, 4) || "N/A"
              : meow.first_air_date?.slice(0, 4) || "N/A"}
          </Badge>
          <Badge className="w-full" variant="outline">
            {meow.media_type === "movie"
              ? meow.release_dates?.results
                  ?.find((r) => r.iso_3166_1 === "US")
                  ?.release_dates?.find((r) => r.type === 3)?.certification ||
                "NR"
              : meow.content_ratings?.results?.find(
                  (r) => r.iso_3166_1 === "US"
                )?.rating || "NR"}
          </Badge>
          <Link
            href={`/${media_type}/${meow.id}`}
            className="w-full  col-span-3 "
            prefetch={true}
          >
            <Button variant="outline" size="sm" className="text-xs w-full">
              <Play />
              Watch Now
            </Button>
          </Link>
        </div>

        <Image
          className="absolute h-full w-full object-cover object-[center_40%] mask-gradient blur-[2px] lg:blur-[0] opacity-70"
          src={`https://image.tmdb.org/t/p/original/${meow.backdrop_path}`}
          alt="Lazy loaded"
          priority
          fill
        />
      </div>
    ));
  };

  const MobileHeroComponent = () => {
    return (
      <div className="absolute bottom-20 lg:hidden z-10  w-full overflow-hidden  pointer-events-none flex items-center ">
        <div className="h-full w-full flex justify-center items-center">
          {loading ? (
            <div className=" flex justify-center items-center">
              <Skeleton className="aspect-[9/13] !w-[170px]   bg-zinc-500" />
            </div>
          ) : (
            movies?.slice(0, 1).map((meow) => (
              <div
                key={meow.id}
                className="aspect-[9/13] !w-[170px] swiper-slide relative"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${meow.poster_path}`}
                  alt="Lazy loaded"
                  fill
                  className="object-cover object-center rounded-lg"
                  sizes="170px"
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  return (
    <main>
      <div className="relative lg:h-[75vh] h-[53vh] w-full ">
        {loading ? <SkeletonLoading /> : <HeroComponent />}
        <MobileHeroComponent />
      </div>

      <div className="space-y-4 mt-9   w-[95%] lg:w-[90%] mx-auto">
        <div className="flex items-center justify-between w-full ">
          <h1 className="lg:text-2xl text-xl whitespace-nowrap  font-bold flex gap-2">
            <p className="text-foreground relative font-semibold text-[1.1rem] lg:text-2xl  lg:border-l-4 border-l-2 border-blue-800 lg:pl-6 pl-3 flex items-center gap-2">
              {category?.charAt(0).toUpperCase() + category?.slice(1)}
              &nbsp;
              {media_type === "movie" ? "Movies" : "TV Shows"}
            </p>
          </h1>

          <CategoryFilter
            media_type={media_type}
            setPage={setPage}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
            selectedNetworks={selectedNetworks}
            setSelectedNetworks={setSelectedNetworks}
            keywordId={keywordId}
            setKeywordId={setKeywordId}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            fromYear={fromYear}
            setFromYear={setFromYear}
            toYear={toYear}
            setToYear={setToYear}
            voteMin={voteMin}
            setVoteMin={setVoteMin}
            voteMax={voteMax}
            setVoteMax={setVoteMax}
          />
        </div>
        <div className="grid lg:grid-cols-6 grid-cols-3 w-full lg:gap-5  gap-1">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-[2/3] w-full bg-zinc-500"
                />
              ))
            : movies?.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} />
              ))}
          <Button
            variant="outline"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loadingMore || page >= totalPages}
            className="h-full w-full aspect-[2/3] flex-col "
          >
            <Plus />
            <div className="flex gap-1">
              {loadingMore ? (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              ) : null}
              {page >= totalPages
                ? "No more results."
                : loadingMore
                ? "Loading..."
                : "Load More"}
            </div>
            <p>
              {page} / {totalPages}
            </p>
          </Button>
          {loadingMore && (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-full w-full bg-zinc-500" />
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
