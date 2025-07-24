"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useCollection from "@/lib/collectionFetch";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import EnglishBackdropMeta from "./english-backdrop-meta";
import { WatchlistButton } from "@/app/watchlist/watchlist-button";
import { toast } from "sonner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  MonitorPlay,
  MonitorX,
  Play,
  PlayCircle,
  Share2,
  Star,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GetMovieData from "@/lib/getMovieData";
import { Badge } from "@/components/ui/badge";
import TmdbEpisode from "./tmdb-episode";
import Image from "next/image";
import { useState } from "react";

export default function DrawerMetadata({
  id,
  media_type,
  setOpen,
}: // setNavigate,
{
  id: string;
  media_type: string;
  setOpen: (open: boolean) => void;
  // setNavigate: (navigate: boolean) => void;
}) {
  const { show, loading } = GetMovieData({ id, media_type });

  const trailerKey = show?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const logoImage = show?.images?.logos[0]?.file_path;
  const { collection } = useCollection(show?.belongs_to_collection?.id);
  const [trailer, setTrailer] = useState(false);

  const router = useRouter();
  return (
    <div className="overflow-y-auto meow">
      {loading ? (
        <div className="h-full w-full">
          <div className="relative aspect-[16/8] flex justify-center items-center overlay">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-blue-800"></div>
          </div>
          <div className="h-full w-full lg:px-10 px-3 py-5 flex flex-col lg:flex-row gap-10">
            <span className="lg:w-[65%] space-y-1">
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
              <Skeleton className="h-8 w-full mt-5" />
              <Skeleton className="h-20 w-full mt-5" />
            </span>
            <span className="lg:w-[35%]  space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-8 w-full mt-5" />
              <Skeleton className="h-11 w-full" />
            </span>
          </div>
          <div className="lg:px-10 px-3  mb-5">
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden ">
            <div className="mask-gradient h-full w-full flex justify-center items-center   lg:aspect-[16/8] aspect-[16/10]">
              {trailer ? (
                <iframe
                  width="100%"
                  height="190%"
                  className="fade-in transition-opacity duration-300 opacity-100 aspect-video "
                  src={`https://www.youtube-nocookie.com/embed/${trailerKey?.key}?autoplay=1&loop=1&playlist=${trailerKey?.key}&controls=0&showinfo=0&&modestbranding=1&&rel=0`}
                  title="Trailer"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : (
                <Image
                  src={`https://image.tmdb.org/t/p/w1280/${show?.backdrop_path}`}
                  unoptimized={true}
                  className="object-cover"
                  fill
                  priority
                  alt="Lazy loaded"
                />
              )}
            </div>

            <div className="absolute lg:left-8 lg:bottom-8 left-3 bottom-3 lg:w-[35%] w-[50%] z-50">
              {logoImage ? (
                <img
                  className="lg:h-[120px] h-[70px] object-contain"
                  src={`https://image.tmdb.org/t/p/w500/${logoImage}`}
                  alt={show?.title || show?.name}
                />
              ) : (
                <p className="text-2xl zxczxc tracking-[-3px]">
                  {show?.title || show?.name}
                </p>
              )}
            </div>
          </div>
          {show && (
            <div className="px-3 py-5 lg:px-10 flex flex-col gap-5">
              <div className="w-full flex flex-col lg:flex-row lg:gap-10 gap-5">
                <span className="lg:w-[65%] w-full">
                  <div className="flex gap-2 items-center justify-center">
                    <Link
                      className="flex-1"
                      href={`/watch/${media_type}/${id}${
                        media_type === "tv" ? "/1/1" : ""
                      }`}
                      prefetch={true}
                      scroll={false}
                      onClick={() => {
                        setOpen(false);
                        // setNavigate(true);

        

                        toast.custom((t) => (
                          <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
                            <div className="flex gap-2">
                              <div className="flex grow gap-3">
                                <PlayCircle
                                  className="mt-0.5 shrink-0 text-emerald-500"
                                  size={16}
                                  aria-hidden="true"
                                />
                                <div className="flex grow justify-between gap-12">
                                  <p className="text-sm">
                                    Now Playing: {show.name || show.title}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                                onClick={() => toast.dismiss(t)}
                                aria-label="Close banner"
                              >
                                <XIcon
                                  size={16}
                                  className="opacity-60 transition-opacity group-hover:opacity-100"
                                  aria-hidden="true"
                                />
                              </Button>
                            </div>
                          </div>
                        ));
                      }}
                    >
                      <Button variant="outline" className="w-full">
                        <Play />
                        Play Now
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: show?.title || show?.name,
                              text: `Watch "${
                                show?.title || show?.name
                              }" now on ZXC[STREAM]!`,
                              url: window.location.href,
                            })
                            .then(() => console.log("Shared successfully"))
                            .catch((error) =>
                              console.error("Sharing failed", error)
                            );
                        } else {
                          toast("Sharing not supported", {
                            description:
                              "Try using Chrome on Android or Safari on iOS.",
                          });
                        }
                      }}
                    >
                      <Share2 />
                    </Button>

                    {trailer ? (
                      <Button onClick={() => setTrailer(false)}>
                        <MonitorX />
                      </Button>
                    ) : (
                      <Button onClick={() => setTrailer(true)}>
                        <MonitorPlay />
                      </Button>
                    )}

                    <WatchlistButton movie={show} />
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <span>
                      {new Date(show.release_date).getFullYear() ||
                        new Date(show.first_air_date).getFullYear()}
                    </span>
                    ·
                    <span>
                      {show.runtime
                        ? `${Math.floor(show.runtime / 60)}h ${
                            show.runtime % 60
                          }m`
                        : `S${show.number_of_seasons} E${show.number_of_episodes}`}
                    </span>
                    ·
                    <span className="flex items-center text-yellow-300 gap-1">
                      <Star className="h-4 w-4 flex items-center" />
                      {String(show.vote_average)[0]}/10
                    </span>
                    {media_type === "tv" &&
                      show.content_ratings.results.length > 0 && (
                        <>
                          ·
                          <Badge variant="outline">
                            {show?.content_ratings?.results[0]?.rating}
                          </Badge>
                        </>
                      )}
                  </div>
                  <p className="mt-5">{show.overview}</p>
                </span>
                <span className="lg:w-[35%] w-full flex flex-col gap-5">
                  <span>
                    <span className="text-muted-foreground">Genres:</span>
                    <span>
                      {" "}
                      {show?.genres?.map((g) => g.name).join(", ") ||
                        "N/A"}{" "}
                    </span>
                  </span>

                  <span>
                    <span className="text-muted-foreground">Cast: </span>
                    {show.credits.cast
                      .slice(0, 5)
                      .map((c) => c.name)
                      .join(", ") || "N/A"}
                  </span>

                  <span className="flex gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{show.status || "N/A"}</span>
                  </span>
                </span>
              </div>
              <div className="w-full ">
                {media_type === "movie" &&
                  show.belongs_to_collection !== null && (
                    <div className="space-y-3 mt-8">
                      <p className="text-foreground relative font-semibold text-[1.1rem] lg:text-xl  lg:border-l-4 border-l-2 border-blue-800 lg:pl-6 pl-3 flex items-center gap-2">
                        {show.belongs_to_collection.name}
                      </p>

                      <div className="grid lg:grid-cols-3 grid-cols-2  lg:gap-5 gap-3">
                        {collection?.parts.map((meow) => (
                          <EnglishBackdropMeta
                            key={meow.id}
                            id={meow.id}
                            title={meow.title}
                            media_type={meow.media_type}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                {media_type === "tv" && (
                  <TmdbEpisode id={show.id} seasons={show.seasons} />
                )}

                {(show?.recommendations?.results?.length > 0 ||
                  show?.similar?.results?.length > 0) && (
                  <div className="mt-8 space-y-3">
                    <p className="text-foreground relative font-semibold text-[1.1rem] lg:text-xl  lg:border-l-4 border-l-2 border-blue-800 lg:pl-6 pl-3 flex items-center gap-2">
                      You may also like
                    </p>
                    <Swiper
                      modules={[Navigation, Pagination, Keyboard]}
                      slidesPerView={6}
                      spaceBetween={15}
                      keyboard={{
                        enabled: true,
                        onlyInViewport: true,
                      }}
                      navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }}
                      pagination={{
                        el: ".swiper-pagination",
                        clickable: true,
                        type: "bullets",
                      }}
                      breakpoints={{
                        320: {
                          slidesPerView: 3,
                          slidesPerGroup: 3,
                          spaceBetween: 10,
                        },
                        480: {
                          slidesPerView: 3,
                          slidesPerGroup: 3,
                          spaceBetween: 10,
                        },
                        640: {
                          slidesPerView: 4,
                          slidesPerGroup: 4,
                          spaceBetween: 12,
                        },
                        768: {
                          slidesPerView: 5,
                          slidesPerGroup: 5,
                          spaceBetween: 14,
                        },
                        1024: {
                          slidesPerView: 5,
                          slidesPerGroup: 5,
                          spaceBetween: 20,
                        },
                      }}
                    >
                      {(show.recommendations.results.length > 0
                        ? show.recommendations.results
                        : show.similar.results
                      ).map((reco) => (
                        <SwiperSlide
                          onClick={() =>
                            router.push(`/${reco.media_type}/${reco.id}`)
                          }
                          key={reco.id}
                          className=" overflow-hidden rounded-sm cursor-pointer"
                        >
                          <div>
                            <img
                              key={reco.id}
                              src={`https://image.tmdb.org/t/p/w500/${reco.poster_path}`}
                              alt={reco.name || reco.title}
                              className="flex-1 object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                      <div className="swiper-button-prev"></div>
                      <div className="swiper-button-next"></div>
                    </Swiper>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
