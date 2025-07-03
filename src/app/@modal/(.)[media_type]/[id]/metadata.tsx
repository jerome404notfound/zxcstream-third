import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useCollection from "@/lib/collectionFetch";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import EnglishBackdropMeta from "./english-backdrop-meta";
import { WatchlistButton } from "@/app/watchlist/watchlist-button";
import { toast } from "sonner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Download,
  LibraryBig,
  Play,
  PlayCircle,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GetMovieData from "@/lib/getMovieData";
import { Badge } from "@/components/ui/badge";
import TmdbEpisode from "./tmdb-episode";

export default function DrawerMetadata({
  id,
  media_type,
  setOpen,
  // setNavigate,
}: {
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
  console.log(show);
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
              <iframe
                width="100%"
                height="190%"
                className="fade-in transition-opacity duration-300 opacity-100 aspect-video "
                src={`https://www.youtube-nocookie.com/embed/${trailerKey?.key}?autoplay=1&loop=1&playlist=${trailerKey?.key}&controls=0&showinfo=0&&modestbranding=1&&rel=0`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
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

                        toast("Now Playing", {
                          description: (
                            <div className="flex items-center gap-2 w-full">
                              <PlayCircle className="w-4 h-4 text-green-500" />
                              <span>{show.name || show.title}</span>
                            </div>
                          ),
                          action: {
                            label: "Stop",
                            onClick: () => router.back(),
                          },
                        });
                      }}
                    >
                      <Button variant="outline" className="w-full">
                        <Play />
                        Play Now
                      </Button>
                    </Link>
                    <Button>
                      <Download />
                    </Button>
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
                            {show?.content_ratings?.results[0]?.rating}+
                          </Badge>
                        </>
                      )}
                  </div>
                  <p className="mt-5">{show.overview}</p>
                </span>
                <span className="lg:w-[35%] w-full flex flex-col gap-5">
                  <span>
                    <span className="text-muted-foreground">Genres:</span>
                    <span> {show?.genres?.map((g) => g.name).join(", ")}</span>
                  </span>

                  <span>
                    <span className="text-muted-foreground">Cast: </span>
                    {show.credits.cast
                      .slice(0, 5)
                      .map((c) => c.name)
                      .join(", ")}
                  </span>

                  <span className="flex gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{show.status}</span>
                  </span>
                </span>
              </div>
              <div className="w-full ">
                {media_type === "movie" &&
                  show.belongs_to_collection !== null && (
                    <div className="space-y-3 mt-8">
                      <h1 className="flex gap-2 items-center text-xl font-semibold">
                        <LibraryBig />
                        {show.belongs_to_collection.name}
                      </h1>
                      <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-3 gap-1">
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
                    <h1 className="text-lg font-semibold flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5" />
                      You May Also Like
                    </h1>
                    <Swiper
                      modules={[Navigation, Pagination]}
                      freeMode={true}
                      className="!pb-5"
                      slidesPerView="auto"
                      spaceBetween={10}
                      navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
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
                          className="reco overflow-hidden rounded-sm cursor-pointer"
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
