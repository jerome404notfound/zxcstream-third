"use client";

import { useEffect } from "react";
import SwiperBackdrops from "./home/home-hero";
import dynamic from "next/dynamic";
const RecentlyWatched = dynamic(() => import("@/app/home/recently"), {
  loading: () => <p>loading recenlty</p>,
});
const Ten = dynamic(() => import("@/app/home/ten"), {
  loading: () => <p>Loading</p>,
});
const ClassicMovies = dynamic(() => import("@/app/home/classic"), {
  loading: () => <p>Loading</p>,
});
const GenreMovies = dynamic(() => import("@/app/home/genre"), {
  loading: () => <p>Loading</p>,
});

const RuntimeMovies = dynamic(() => import("@/app/home/hidden-gems"), {
  loading: () => <p>Loading</p>,
});

export default function Home() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "✅ Service Worker registered successfully:",
            registration
          );
        })
        .catch((registrationError) => {
          console.log(
            "❌ Service Worker registration failed:",
            registrationError
          );
        });
    } else {
      console.log("❌ Service Workers not supported in this browser");
    }
  }, []);
  return (
    <main>
      <SwiperBackdrops />
      <div className="lg:space-y-20 space-y-10">
        <RecentlyWatched />
        <Ten />
        <ClassicMovies />
        <GenreMovies />
        <RuntimeMovies />
      </div>
    </main>
  );
}
