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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  FactoryIcon,
  Globe,
  ListFilter,
  RotateCcw,
  Tag,
  TagsIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StateSetter } from "@/lib/useCategory";
import {
  keywordTopics,
  movieGenres,
  productionCompanies,
  tmdbRegions,
  tvGenres,
  tvNetworks,
} from "./filter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
export interface CategoryFilterProps {
  setPage: (page: StateSetter<number>) => void;
  media_type: string;
  selectedGenres: string[];
  setSelectedGenres: (genres: StateSetter<string[]>) => void;
  selectedCompanies: string[];
  setSelectedCompanies: (companies: StateSetter<string[]>) => void;
  selectedNetworks: string[];
  setSelectedNetworks: (networks: StateSetter<string[]>) => void;
  keywordId: string;
  setKeywordId: (keyword: StateSetter<string>) => void;
  selectedRegion: string;
  setSelectedRegion: (region: StateSetter<string>) => void;
  fromYear: number;
  setFromYear: (fromYear: StateSetter<number>) => void;
  toYear: number;
  setToYear: (toYear: StateSetter<number>) => void;
  voteMin: number;
  setVoteMin: (voteMin: StateSetter<number>) => void;
  voteMax: number;
  setVoteMax: (voteMax: StateSetter<number>) => void;
}
export default function CategoryFilter({
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
}: CategoryFilterProps) {
  const [open, setOpen] = useState({
    tag: false,
    region: false,
    rangeA: false,
    rangeB: false,
    yearA: false,
    yearB: false,
  });
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const rating = Array.from({ length: 10 }, (_, i) => i + 1);
  const resetFilter = () => {
    setPage(1);
    setSelectedGenres([]);
    setSelectedCompanies([]);
    setSelectedNetworks([]);
    setKeywordId("");
    setSelectedRegion("");
    setFromYear(0);
    setToYear(0);
    setVoteMin(0);
    setVoteMax(0);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <ListFilter />
          <span className="">
            Select Filter
            {selectedGenres.length +
              (media_type === "movie"
                ? selectedCompanies.length
                : selectedNetworks.length) +
              (selectedRegion ? 1 : 0) +
              (keywordId ? 1 : 0) +
              (fromYear ? 1 : 0) +
              (toYear ? 1 : 0) +
              (voteMin ? 1 : 0) +
              (voteMax ? 1 : 0) ===
            0 ? (
              ""
            ) : (
              <Badge
                className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                variant="secondary"
              >
                {selectedGenres.length +
                  (media_type === "movie"
                    ? selectedCompanies.length
                    : selectedNetworks.length) +
                  (selectedRegion ? 1 : 0) +
                  (keywordId ? 1 : 0) +
                  (fromYear ? 1 : 0) +
                  (toYear ? 1 : 0) +
                  (voteMin ? 1 : 0) +
                  (voteMax ? 1 : 0)}
              </Badge>
            )}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="sr-only">
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
        </div>

        <Tabs defaultValue="genre" className="w-full p-3">
          <TabsList className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
            <TabsTrigger
              value="genre"
              className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <TagsIcon
                className="-ms-0.5 me-1.5 opacity-60 hidden lg:block"
                size={16}
                aria-hidden="true"
              />
              Genres
              {selectedGenres.length === 0 ? (
                ""
              ) : (
                <Badge
                  className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                  variant="secondary"
                >
                  {selectedGenres.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="production"
              className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <FactoryIcon
                className="-ms-0.5 me-1.5 opacity-60 hidden lg:block"
                size={16}
                aria-hidden="true"
              />
              {media_type === "movie" ? "Studios" : "Networks"}

              {(media_type === "movie"
                ? selectedCompanies.length
                : selectedNetworks.length) > 0 && (
                <Badge
                  className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                  variant="secondary"
                >
                  {media_type === "movie"
                    ? selectedCompanies.length
                    : selectedNetworks.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="year"
              className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <CalendarIcon
                className="-ms-0.5 me-1.5 opacity-60 hidden lg:block"
                size={16}
                aria-hidden="true"
              />
              More
              {(selectedRegion ? 1 : 0) +
                (keywordId ? 1 : 0) +
                (fromYear ? 1 : 0) +
                (toYear ? 1 : 0) +
                (voteMin ? 1 : 0) +
                (voteMax ? 1 : 0) ===
              0 ? (
                ""
              ) : (
                <Badge
                  className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                  variant="secondary"
                >
                  {(selectedRegion ? 1 : 0) +
                    (keywordId ? 1 : 0) +
                    (fromYear ? 1 : 0) +
                    (toYear ? 1 : 0) +
                    (voteMin ? 1 : 0) +
                    (voteMax ? 1 : 0)}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Genre Tab - Scrollable */}
          <TabsContent
            value="genre"
            className="mt-3 max-h-96 overflow-y-auto pr-2"
          >
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
              {(media_type === "movie" ? movieGenres : tvGenres).map(
                (genre) => {
                  const GenreIcon = genre.icon;
                  return (
                    <div
                      key={genre.id}
                      className={`relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50 ${genre.color}`}
                    >
                      <Checkbox
                        checked={selectedGenres.includes(genre.id.toString())}
                        onCheckedChange={() => {
                          setSelectedGenres((prev) =>
                            prev.includes(genre.id.toString())
                              ? prev.filter((g) => g !== genre.id.toString())
                              : [...prev, genre.id.toString()]
                          );
                        }}
                        className="order-1 after:absolute after:inset-0"
                      />
                      <div className="flex grow items-center gap-3">
                        <GenreIcon className={genre.iconColor} />
                        <div className="grid gap-2">
                          <Label>{genre.name}</Label>
                          <p className="text-muted-foreground text-xs truncate">
                            {genre.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </TabsContent>

          {/* Production Tab - Scrollable */}
          <TabsContent
            value="production"
            className="mt-3 max-h-96 overflow-y-auto pr-2"
          >
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
              {(media_type === "movie" ? productionCompanies : tvNetworks).map(
                (company) => {
                  const GenreIcon = company.icon;
                  return (
                    <div
                      key={company.id}
                      className={`relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50`}
                    >
                      {media_type === "movie" ? (
                        <Checkbox
                          checked={selectedCompanies.includes(
                            company.id.toString()
                          )}
                          onCheckedChange={() => {
                            setSelectedCompanies((prev) =>
                              prev.includes(company.id.toString())
                                ? prev.filter(
                                    (g) => g !== company.id.toString()
                                  )
                                : [...prev, company.id.toString()]
                            );
                          }}
                          className="order-1 after:absolute after:inset-0"
                        />
                      ) : (
                        <Checkbox
                          checked={selectedNetworks.includes(
                            company.id.toString()
                          )}
                          onCheckedChange={() => {
                            setSelectedNetworks((prev) =>
                              prev.includes(company.id.toString())
                                ? prev.filter(
                                    (g) => g !== company.id.toString()
                                  )
                                : [...prev, company.id.toString()]
                            );
                          }}
                          className="order-1 after:absolute after:inset-0"
                        />
                      )}
                      <div className="flex grow items-center gap-3">
                        <GenreIcon />
                        <div className="grid gap-2">
                          <Label>{company.name}</Label>
                          <p className="text-muted-foreground text-xs truncate">
                            {company.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </TabsContent>

          {/* More Tab - Scrollable */}
          <TabsContent
            value="year"
            className="mt-3 max-h-96 overflow-y-auto pr-2"
          >
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="space-y-1 flex-1">
                  <p className="text-xs text-muted-foreground">Tags</p>
                  <Popover
                    open={open.tag}
                    onOpenChange={(newOpen) =>
                      setOpen((prev) => ({ ...prev, tag: newOpen }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open.tag}
                        className="w-full justify-between bg-transparent"
                      >
                        <Tag />
                        {keywordId
                          ? keywordTopics.find(
                              (framework) => framework.value === keywordId
                            )?.label
                          : "Tag"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search tag..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {keywordTopics.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.label}
                                onSelect={() => {
                                  setKeywordId(framework.value);
                                  setOpen((prev) => ({ ...prev, tag: false }));
                                }}
                              >
                                {framework.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    keywordId === framework.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1 flex-1">
                  <p className="text-xs text-muted-foreground">Region</p>
                  <Popover
                    open={open.region}
                    onOpenChange={(newOpen) =>
                      setOpen((prev) => ({ ...prev, region: newOpen }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open.region}
                        className="w-full justify-between bg-transparent"
                      >
                        <Globe />
                        {selectedRegion
                          ? tmdbRegions.find(
                              (framework) => framework.value === selectedRegion
                            )?.label
                          : "Region"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search region..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {tmdbRegions.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.label}
                                onSelect={() => {
                                  setSelectedRegion(framework.value);
                                  setOpen((prev) => ({
                                    ...prev,
                                    region: false,
                                  }));
                                }}
                              >
                                {framework.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    selectedRegion === framework.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Separator className="w-full  mt-3" />
              <div className="space-y-1 ">
                <p className="text-xs text-muted-foreground">Year Range</p>
                <div className="flex gap-3 items-center">
                  <Popover
                    open={open.yearA}
                    onOpenChange={(newOpen) =>
                      setOpen((prev) => ({ ...prev, yearA: newOpen }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open.yearA}
                        className="flex-1 justify-between bg-transparent"
                      >
                        {fromYear || "From"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search year..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No year found.</CommandEmpty>
                          <CommandGroup>
                            {years.map((year) => (
                              <CommandItem
                                key={year}
                                value={year.toString()}
                                onSelect={() => {
                                  setFromYear(year);
                                  setOpen((prev) => ({
                                    ...prev,
                                    yearA: false,
                                  }));
                                }}
                              >
                                {year}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    fromYear === year
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  —
                  <Popover
                    open={open.yearB}
                    onOpenChange={(newOpen) =>
                      setOpen((prev) => ({ ...prev, yearB: newOpen }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open.yearB}
                        className="flex-1 justify-between bg-transparent"
                      >
                        {toYear || "To"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search year..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No year found.</CommandEmpty>
                          <CommandGroup>
                            {years.map((year) => (
                              <CommandItem
                                key={year}
                                value={year.toString()}
                                onSelect={() => {
                                  setToYear(year);
                                  setOpen((prev) => ({
                                    ...prev,
                                    yearB: false,
                                  }));
                                }}
                              >
                                {year}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    toYear === year
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Separator className="w-full mt-3" />
              <div className="space-y-1 ">
                <p className="text-xs text-muted-foreground">Rating Range</p>
                <div className="flex gap-3 items-center">
                  <Popover
                    open={open.rangeA}
                    onOpenChange={(newOpen) =>
                      setOpen((prev) => ({ ...prev, rangeA: newOpen }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open.rangeA}
                        className="flex-1 justify-between bg-transparent"
                      >
                        {voteMin || "Min."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search rating..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No rating found.</CommandEmpty>
                          <CommandGroup>
                            {rating.map((rate) => (
                              <CommandItem
                                key={rate}
                                value={rate.toString()}
                                onSelect={() => {
                                  setVoteMin(rate);
                                  setOpen((prev) => ({
                                    ...prev,
                                    rangeA: false,
                                  }));
                                }}
                              >
                                ⭐ {rate}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    voteMin === rate
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  —
                  <Popover
                    open={open.rangeB}
                    onOpenChange={(newOpen) =>
                      setOpen((prev) => ({ ...prev, rangeB: newOpen }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open.rangeB}
                        className="flex-1 justify-between bg-transparent"
                      >
                        {voteMax || "Max."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search rating..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No rating found.</CommandEmpty>
                          <CommandGroup>
                            {rating.map((rate) => (
                              <CommandItem
                                key={rate}
                                value={rate.toString()}
                                onSelect={() => {
                                  setVoteMax(rate);
                                  setOpen((prev) => ({
                                    ...prev,
                                    rangeB: false,
                                  }));
                                }}
                              >
                                ⭐ {rate}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    voteMax === rate
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DrawerFooter>
          <DrawerClose asChild>
            <div className="w-full flex gap-3">
              <Button onClick={resetFilter} className="flex-1">
                <RotateCcw /> Reset
              </Button>
              <Button className="flex-1" variant="outline">
                <X /> Close
              </Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
