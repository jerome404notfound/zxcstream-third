"use client";
import { Video, VideoOff } from "lucide-react";
import { useState, useEffect } from "react";
interface Video {
  type: string;
  site: string;
  key: string;
}

import TmdbBackdrop from "./fetchBackdrop";
export default function Trailer({
  id,
  mediaType,
  type = "modal",
}: {
  id: string;
  mediaType: string;
  type: string;
}) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        const data = await res.json();

        const trailer = data.results.find(
          (vid: Video) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        if (trailer && trailer.key) {
          setVideoKey(trailer.key);
        } else {
          console.warn("No trailer found");
          setVideoKey("xvFZjo5PgG0");
        }
      } catch (error) {
        console.error("Failed to fetch trailer:", error);
      }
    }
    fetchTrailer();
  }, [id, mediaType, apiKey]);

  return (
    <div className="relative h-full w-full flex justify-center items-center ">
      <span
        className="absolute z-50 lg:bottom-12 bottom-5 right-3 lg:right-8"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <Video className="lg:h-6 lg:w-6 h-5 w-5" />
        ) : (
          <VideoOff className="lg:h-6 lg:w-6 h-5 w-5" />
        )}
      </span>

      {!show ? (
        <TmdbBackdrop id={id} mediaType={mediaType} />
      ) : (
        <div className="h-full w-full flex justify-center items-center mask-gradient">
          <iframe
            width="100%"
            height={type === "modal" ? "150%" : "100%"}
            className="fade-in transition-opacity duration-300 opacity-100 aspect-video  pointer-events-none"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&loop=1&playlist=${videoKey}`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
            key={videoKey}
          ></iframe>
        </div>
      )}
    </div>
  );
}
