"use client";
import { SwiperSlide, Swiper } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, Controller } from "swiper/modules";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchTmdb from "../../lib/fetchMovie";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Info, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

let showlist = [
  { id: "886083", media_type: "movie" },
  { id: "945961", media_type: "movie" },
  { id: "297608", media_type: "movie" },
  { id: "615453", media_type: "movie" },
  { id: "66732", media_type: "tv" },
  { id: "1214509", media_type: "movie" },
  // { id: "60625", media_type: "tv" },
  // { id: "219246", media_type: "tv" },
  { id: "508947", media_type: "movie" },
  // { id: "235930", media_type: "tv" },
  { id: "1425045", media_type: "movie" },
  // { id: "1153714", media_type: "movie" },
  // { id: "1151031", media_type: "movie" },
];

showlist = showlist.sort(() => Math.random() - 0.5);

export default function SwiperBackdrops() {
  const { movies, loading } = useFetchTmdb(showlist);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="relative ">
      <Swiper
        modules={[Navigation, Pagination, Controller]}
        controller={{ control: thumbSwiper }}
        onSwiper={setMainSwiper}
        pagination={{ type: "progressbar" }}
        slidesPerView={"auto"}
        spaceBetween={10}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="relative lg:h-[75vh] h-[53vh] w-full"
      >
        {loading ? (
          <SwiperSlide className="swiper-slide relative overflow-hidden">
            <div className="absolute w-full lg:w-1/2 lg:bottom-15 bottom-0 right-[unset] lg:left-20  z-10 text-white zxc flex justify-center">
              <div className=" flex-col items-start gap-1 hidden lg:flex w-full">
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
          </SwiperSlide>
        ) : (
          movies.map((meow) => (
            <SwiperSlide
              key={meow.id}
              className="swiper-slide relative overflow-hidden"
            >
              <div className="absolute  w-[calc(100%-40px)] lg:w-1/2 bottom-15 left-5 lg:left-20 z-10 text-white   flex-col  hidden lg:flex">
                <span className="lg:text-5xl text-3xl tracking-[-5px] lg:tracking-[-9px]  zxczxc  mt-1 mb-2 lg:mt-2 lg:mb-4 drop-shadow-sm drop-shadow-black/50 lg:-translate-x-1.5">
                  {(meow.title || meow.name)?.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-red-800">
                    {(meow.title || meow.name)?.split(" ").pop()}
                  </span>
                </span>
                <div className="flex gap-3">
                  <Badge className="px-3 py-1 text-sm" variant="outline">
                    {meow.media_type === "movie" ? "Movie" : "TV"}
                  </Badge>
                  <Badge className="px-3 py-1 text-sm" variant="outline">
                    {meow.media_type === "movie"
                      ? meow.release_date?.slice(0, 4) || "N/A"
                      : meow.first_air_date?.slice(0, 4) || "N/A"}
                  </Badge>
                  <Badge className="px-3 py-1 text-sm" variant="outline">
                    {meow.media_type === "movie"
                      ? meow.release_dates?.results
                          ?.find((r) => r.iso_3166_1 === "US")
                          ?.release_dates?.find((r) => r.type === 3)
                          ?.certification || "NR"
                      : meow.content_ratings?.results?.find(
                          (r) => r.iso_3166_1 === "US"
                        )?.rating || "NR"}
                  </Badge>
                </div>
                <p className=" text-xs lg:text-base line-clamp-3  mt-3">
                  {/* Replace tagline with overview */}
                  {meow.overview || "No description available."}
                </p>
                <div className="mt-5 space-x-2">
                  <Link
                    href={`/watch/${meow.media_type}/${meow.id}${
                      meow.media_type === "tv" ? "/1/1" : ""
                    }`}
                    prefetch={true}
                    scroll={false}
                  >
                    <Button className="bg-zinc-950/80 hover:bg-zinc-900 border-red-700 border-1 text-white">
                      <Play />
                      Play Now
                    </Button>
                  </Link>
                  <Link
                    href={`${meow.media_type}/${meow.id}`}
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

              <div className="absolute bottom-0 transform translate-x-[50%] right-[50%] lg:hidden grid grid-cols-3 gap-3 z-20 landingBtns">
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
                        ?.release_dates?.find((r) => r.type === 3)
                        ?.certification || "NR"
                    : meow.content_ratings?.results?.find(
                        (r) => r.iso_3166_1 === "US"
                      )?.rating || "NR"}
                </Badge>
                <Link
                  href={`/${meow.media_type}/${meow.id}`}
                  className="w-full  col-span-3 "
                  prefetch={true}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs w-full"
                  >
                    <Play />
                    Watch Now
                  </Button>
                </Link>
              </div>

              <Image
                className="absolute h-full w-full object-cover object-[center_40%] mask-gradient backdrop opacity-backrop blur-[2px] lg:blur-[0]"
                src={`https://image.tmdb.org/t/p/original/${meow.backdrop_path}`}
                unoptimized={true}
                fill
                priority
                alt="Lazy loaded"
              />
            </SwiperSlide>
          ))
        )}
        <div className="swiper-pagination"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </Swiper>
      <div className="absolute bottom-20 lg:hidden z-10  w-full overflow-hidden  pointer-events-none">
        <Swiper
          modules={[Controller, EffectCards]}
          controller={{ control: mainSwiper }}
          onSwiper={setThumbSwiper}
          effect={"cards"}
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={30}
     
          className="h-full w-full"
        >
          {loading ? (
            <SwiperSlide className=" !flex justify-center items-center">
              <Skeleton className="aspect-[9/13] !w-[170px]   bg-zinc-500" />
            </SwiperSlide>
          ) : (
            movies.map((meow) => (
              <SwiperSlide
                key={meow.id}
                className="aspect-[9/13] !w-[170px] swiper-slide relative"
              >
                <Image
                  className="absolute h-full w-full object-cover object-center rounded-lg"
                  src={`https://image.tmdb.org/t/p/w500/${meow.poster_path}`}
                  alt={meow.name || meow.title || "BACKDROP"}
                  width={170}
                  unoptimized={true}
                  height={245}
                />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
}
