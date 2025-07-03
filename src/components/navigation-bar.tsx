"use client";
import {
  Film,
  HomeIcon,
  Settings,
  Tv,
  Search,
  LayoutGrid,
  SearchIcon,
  LoaderCircleIcon,
  ArrowRight,
  Flame,
  Star,
  Clock,
} from "lucide-react";
import type React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import logo from "@/assets/zxzx.png";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import SpotlightBorderWrapper from "@/components/ui/border";
import { ModeToggle } from "./ui/darkmode-toggle";
const items = [
  {
    name: "Movie",
    logo: Film,
    link: "/explore/movie/popular",
    tags: [
      {
        title: "Popular",
        link: "explore/movie/popular",
        icon: Flame, // Better represents "popular"
        details: "Most watched movies right now",
      },
      {
        title: "Top Rated",
        link: "explore/movie/top-rated",
        icon: Star, // Better for ratings
        details: "Highest rated movies by viewers",
      },
      {
        title: "Coming Soon",
        link: "explore/movie/coming-soon",
        icon: Clock, // More suitable for upcoming content
        details: "Upcoming movie releases",
      },
    ],
  },
  {
    name: "TV Show",
    logo: Tv,
    link: "/explore/tv/top-rated",
    tags: [
      {
        title: "Top Rated",
        link: "explore/tv/top-rated",
        icon: Star,
        details: "Highest rated TV shows by viewers",
      },
      {
        title: "Popular",
        link: "explore/tv/popular",
        icon: Flame,
        details: "Most watched TV shows right now",
      },
      {
        title: "Coming Soon",
        link: "explore/tv/coming-soon",
        icon: Clock,
        details: "Upcoming TV show releases",
      },
    ],
  },
];

console.log(items[1].name);
export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);
  const [savedPath, setSavedPath] = useState("/");

  useEffect(() => {
    if (
      !pathname.startsWith("/search") &&
      !pathname.startsWith("/movie/") &&
      !pathname.startsWith("/tv/") &&
      !pathname.startsWith("/watch/")
    ) {
      setSavedPath(pathname);
    }
  }, [pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`, {
        scroll: false,
      });
      setIsLoading(true);
    } else {
      router.push(savedPath);
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="absolute z-20 flex   w-full  justify-center items-start lg:py-5 py-3">
        <div className=" lg:absolute lg:left-20 h-8.5 ">
          <img
            className="h-full w-full object-contain z-10"
            src={logo.src || "/placeholder.svg"}
            alt=""
          />
        </div>

        <div>
          <nav className="hidden lg:flex items-center">
            <Link href="/" className="px-5 hover:bg-blue-800" prefetch={true}>
              <HomeIcon size={16} />
            </Link>

            <div className="border-l border-gray-500/50 h-5"></div>

            <NavigationMenu className="px-3">
              <NavigationMenuList>
                {items.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.link} prefetch={true}>
                      <NavigationMenuTrigger className="flex items-center gap-3 ">
                        <item.logo size={16} />
                        {item.name}
                      </NavigationMenuTrigger>
                    </Link>
                    {item.tags && (
                      <NavigationMenuContent>
                        <div className="grid grid-cols-2 w-[480px] gap-2 p-2">
                          {item.tags.map((tag, index) => (
                            <Link
                              key={tag.title}
                              href={`/${tag.link}`}
                              prefetch={true}
                              className={`group relative rounded-md border bg-muted p-3 flex flex-col justify-between transition hover:shadow-md hover:border-primary ${
                                index === 0 ? "row-span-2" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <tag.icon
                                  className="text-primary group-hover:scale-110 transition-transform"
                                  size={18}
                                />
                                <span className="text-sm font-semibold text-foreground">
                                  {tag.title}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-snug">
                                {tag.details}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <Link
                    href={`/watchlist`}
                    prefetch={true}
                    className={navigationMenuTriggerStyle()}
                  >
                    <span className="flex items-center gap-3">
                      <LayoutGrid size={16} /> Watchlist
                    </span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    <span className="flex items-center gap-3 cursor-pointer">
                      <Search size={16} /> Search
                    </span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="border-l border-gray-500/50 h-5"></div>
            <div className="px-5">
              <Settings size={16} />
            </div>
          </nav>

          {showSearch && (
            <div className=" hidden lg:block mt-1">
              <div className="relative">
                <SpotlightBorderWrapper>
                  <div className="border rounded-lg p-1">
                    <Input
                      className="peer ps-9 pe-9 h-9 backdrop-blur-xl w-full border-0"
                      placeholder="Search movies, TV shows..."
                      type="search"
                      value={inputValue}
                      onChange={handleSearchChange}
                      autoFocus
                    />
                  </div>
                </SpotlightBorderWrapper>
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  {isLoading ? (
                    <LoaderCircleIcon
                      className="animate-spin"
                      size={16}
                      role="status"
                      aria-label="Loading..."
                    />
                  ) : (
                    <SearchIcon size={16} aria-hidden="true" />
                  )}
                </div>
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close search"
                  type="button"
                  onClick={() => setShowSearch(false)}
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute lg:right-20 right-3 flex items-center gap-3">
          <div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="lg:hidden fixed bottom-0 left-0 w-full z-20 bg-background/80 backdrop-blur-sm border-t border-background rounded-md">
        {showSearch && (
          <div className=" block lg:hidden p-2">
            <div className="relative">
              <Input
                className="peer ps-9 pe-9  backdrop-blur-2xl w-full"
                placeholder="Search..."
                type="search"
                value={inputValue}
                onChange={handleSearchChange}
                autoFocus
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                {isLoading ? (
                  <LoaderCircleIcon
                    className="animate-spin"
                    size={16}
                    role="status"
                    aria-label="Loading..."
                  />
                ) : (
                  <SearchIcon size={16} aria-hidden="true" />
                )}
              </div>
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close search"
                type="button"
                onClick={() => setShowSearch(false)}
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-around px-2 py-2 zxc">
          {/* Home */}
          <Link
            href="/"
            prefetch={true}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <HomeIcon size={20} className="text-foreground" />
            <span className="text-xs text-muted-foreground">Home</span>
          </Link>

          {/* Movies Drawer */}
          <Drawer open={openA} onOpenChange={setOpenA}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 p-2 h-auto"
              >
                <Film size={20} className="text-foreground" />
                <span className="text-xs text-muted-foreground">Movies</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="flex items-center gap-2">
                  <Film size={20} />
                  Movies
                </DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-cols-1 gap-3 p-4 pb-8">
                {items[0].tags.map((tag) => (
                  <Link
                    href={`/${tag.link}`}
                    prefetch={true}
                    onClick={() => setOpenA(false)}
                    key={tag.title}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="flex flex-col items-start gap-2 h-auto p-4 w-full"
                    >
                      <div className="flex items-center gap-2">
                        <tag.icon size={16} />
                        <span className="font-medium">{tag.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        {tag.details}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </DrawerContent>
          </Drawer>

          {/* TV Shows Drawer */}
          <Drawer open={openB} onOpenChange={setOpenB}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 p-2 h-auto"
              >
                <Tv size={20} className="text-foreground" />
                <span className="text-xs text-muted-foreground">TV Shows</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="flex items-center gap-2">
                  <Tv size={20} />
                  TV Shows
                </DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-cols-1 gap-3 p-4 pb-8">
                {items[1].tags.map((tag) => (
                  <Link
                    href={`/${tag.link}`}
                    prefetch={true}
                    onClick={() => setOpenB(false)}
                    key={tag.title}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="flex flex-col items-start gap-2 h-auto p-4 w-full"
                    >
                      <div className="flex items-center gap-2">
                        <tag.icon size={16} />
                        <span className="font-medium">{tag.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        {tag.details}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </DrawerContent>
          </Drawer>

          {/* Watchlist */}
          <Link
            href="/watchlist"
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors"
            prefetch={true}
          >
            <LayoutGrid size={20} className="text-foreground" />
            <span className="text-xs text-muted-foreground">Watchlist</span>
          </Link>

          {/* Search */}
          <div
            onClick={() => setShowSearch(!showSearch)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Search size={20} className="text-foreground" />
            <span className="text-xs text-muted-foreground">Search</span>
          </div>
        </div>
      </div>
    </>
  );
}
