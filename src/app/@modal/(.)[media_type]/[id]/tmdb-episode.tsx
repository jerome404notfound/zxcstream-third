import { SeasonsType } from "@/lib/getMovieData";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Eye, EyeClosed, Play } from "lucide-react";
import useEpisode from "@/lib/fetch-episodes";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
export default function TmdbEpisode({
  id,
  seasons,
}: {
  id: string;
  seasons: SeasonsType[];
}) {
  const [season, setSeason] = useState("1");
  const [open, setOpen] = useState(false);
  const [antiSpoiler, setAntiSpoiler] = useState(true);
  const { episode, loading } = useEpisode({ id, season });
  console.log(episode);

  return (
    <div className="mt-5">
      <div className="flex justify-between w-full items-center">
        <p className="text-foreground relative font-semibold text-[1.1rem] lg:text-xl  lg:border-l-4 border-l-2 border-blue-800 lg:pl-6 pl-3 flex items-center gap-2">
          Episodes
        </p>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setAntiSpoiler(!antiSpoiler)}
            variant="outline"
          >
            {antiSpoiler ? <EyeClosed /> : <Eye />}
          </Button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className=" justify-between"
              >
                {seasons ? `Season ${season}` : "Select Season"}

                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="  p-0">
              <Command>
                <CommandInput placeholder="Search season..." />
                <CommandList>
                  <CommandEmpty>No season found.</CommandEmpty>
                  <CommandGroup>
                    {seasons
                      .filter(
                        (season) =>
                          season.episode_count > 0 && season.air_date !== null
                      )
                      .map((season) => (
                        <CommandItem
                          key={season.id}
                          value={season.season_number}
                          onSelect={() => {
                            setSeason(season.season_number);
                            setOpen(false);
                          }}
                        >
                          {season.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col py-5 gap-3">
        {episode.length > 0 ? (
          loading ? (
            <div className="grid  grid-cols-1 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="relative flex justify-end items-center border rounded-md group"
                >
                  <div className=" absolute flex flex-col left-0 w-[70%] h-full z-10 justify-end lg:p-5 p-3 lg:gap-3 gap-2">
                    <h3 className="font-semibold text-sm lg:text-base  line-clamp-1 group-hover:text-primary transition-colors">
                      Episode {index + 1}
                    </h3>

                    <div className="space-y-2">
                      <Skeleton className="h-5 bg-zinc-700 rounded-md " />

                      <Skeleton className="h-5 bg-zinc-700 rounded-md " />
                    </div>

                    <span className="flex items-center gap-1 text-xs ">
                      ⭐ 0
                    </span>
                  </div>
                  <div className="relative w-[60%] lg:w-[50%] aspect-[14/9] lg:aspect-[22/9]  overflow-hidden rounded-tr-md rounded-br-md">
                    <div className="w-full h-full transition-transform duration-200 group-hover:scale-105 [mask-image:linear-gradient(to_right,transparent_5%,black_100%)] bg-zinc-700">
                      1
                    </div>
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {antiSpoiler
                ? episode
                    .filter((f) => f.still_path !== null)
                    .map((meow) => (
                      <Link
                        href={`/watch/tv/${id}/${season}/${meow.episode_number}`}
                        prefetch={true}
                        key={meow.id}
                        className="relative flex justify-end items-center border rounded-md group"
                      >
                        <div className=" absolute flex flex-col left-0 w-[70%] h-full z-10 justify-end lg:p-5 p-3 lg:gap-3 gap-2">
                          <h3 className="font-semibold text-sm lg:text-base  line-clamp-1 group-hover:text-primary transition-colors">
                            {meow.episode_number}. Disable anti-spoiler to view
                          </h3>

                          {meow.overview && (
                            <div className="space-y-2">
                              <Skeleton className="h-5 bg-zinc-700 rounded-md " />

                              <Skeleton className="h-5 bg-zinc-700 rounded-md " />
                            </div>
                          )}
                          {meow.vote_average > 0 && (
                            <span className="flex items-center gap-1 text-xs ">
                              ⭐ {meow.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="relative w-[60%] lg:w-[50%] aspect-[14/9] lg:aspect-[22/9]  overflow-hidden rounded-tr-md rounded-br-md">
                          <div className="w-full h-full transition-transform duration-200 group-hover:scale-105 [mask-image:linear-gradient(to_right,transparent_5%,black_100%)] bg-zinc-700">
                            1
                          </div>
                          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </Link>
                    ))
                : episode
                    .filter((f) => f.still_path !== null)
                    .map((meow) => (
                      <Link
                        href={`/watch/tv/${id}/${season}/${meow.episode_number}`}
                        prefetch={true}
                        key={meow.id}
                        className="relative flex justify-end items-center border rounded-md group"
                      >
                        <div className=" absolute flex flex-col left-0 w-[70%] h-full z-10 justify-end lg:p-5 p-3 lg:gap-3 gap-2">
                          <h3 className="font-semibold text-sm lg:text-base  line-clamp-1 group-hover:text-primary transition-colors">
                            {meow.episode_number}. {meow.name}
                          </h3>

                          {meow.overview && (
                            <p className="text-muted-foreground text-xs lg:text-sm  line-clamp-2 lg:line-clamp-3 leading-relaxed ">
                              {meow.overview}
                            </p>
                          )}
                          {meow.vote_average > 0 && (
                            <span className="flex items-center gap-1 text-xs ">
                              ⭐ {meow.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="relative w-[60%] lg:w-[50%] aspect-[14/9] lg:aspect-[22/9]  overflow-hidden rounded-tr-md rounded-br-md">
                          <img
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 [mask-image:linear-gradient(to_right,transparent_5%,black_100%)]"
                            src={
                              meow.still_path
                                ? `https://image.tmdb.org/t/p/w500${meow.still_path}`
                                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOxgXTO4Kc4XORUFvZembSzymC7B6RYupJLQ&s"
                            }
                            alt={meow.name}
                          />
                          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </Link>
                    ))}
            </div>
          )
        ) : (
          "No Episodes Available"
        )}
      </div>
    </div>
  );
}
