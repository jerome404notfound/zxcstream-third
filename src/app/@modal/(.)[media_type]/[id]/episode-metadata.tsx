"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useEpisode from "@/lib/fetch-episodes";
import { useRouter } from "next/navigation";
import { Clock, Play } from "lucide-react";

export default function EpisodeMetaData({
  id,
  season,
}: {
  id: string;
  season: string;
}) {
  const { episode, loading } = useEpisode({ id, season });
  console.log(episode);
  const router = useRouter();

  return (
    <div className="flex flex-col py-5 gap-3">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <div className="border rounded-lg p-4 flex gap-4 bg-card">
                <div className="relative flex-shrink-0">
                  <Skeleton className="w-32 h-20 lg:w-40 lg:h-24 rounded-md" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))
        : episode
            .filter((f) => f.still_path !== null)
            .map((meow) => (
              <div
                key={meow.id}
                onClick={() =>
                  router.push(
                    `/watch/tv/${id}/${season}/${meow.episode_number}`
                  )
                }
                className="group border rounded-lg p-4 flex gap-4 cursor-pointer bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-20 lg:w-40 lg:h-24 rounded-md overflow-hidden bg-muted">
                    <img
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      src={
                        meow.still_path
                          ? `https://image.tmdb.org/t/p/w500${meow.still_path}`
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOxgXTO4Kc4XORUFvZembSzymC7B6RYupJLQ&s"
                      }
                      alt={meow.name}
                    />

                    {/* Play overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>

                    {/* Runtime badge */}
                    {meow.runtime && (
                      <Badge className="absolute bottom-2 right-2 bg-black/80 text-white border-0 text-xs px-2 py-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {meow.runtime}m
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm lg:text-base line-clamp-1 group-hover:text-primary transition-colors">
                      Episode {meow.episode_number}: {meow.name}
                    </h3>
                  </div>

                  {meow.overview && (
                    <p className="text-muted-foreground text-xs lg:text-sm line-clamp-2 lg:line-clamp-3 leading-relaxed">
                      {meow.overview}
                    </p>
                  )}

                  {/* Episode metadata */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {/* {meow.air_date && (
                      <span>
                        {new Date(meow.air_date).toLocaleDateString()}
                      </span>
                    )} */}
                    {meow.vote_average > 0 && (
                      <span className="flex items-center gap-1">
                        ⭐ {meow.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
    </div>
  );
}
