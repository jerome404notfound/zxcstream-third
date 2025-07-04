"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface PlayerProps {
  media_type: string;
  tmdb: string;
  season?: string;
  episode?: string;
}

export default function PlayerPage({
  media_type,
  tmdb,
  season,
  episode,
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      if (!tmdb) {
        setError("Missing TMDB ID");
        return;
      }

      let apiUrl = `/api/video/${media_type}/${tmdb}`;
      if (media_type === "tv" && season && episode) {
        apiUrl += `/${season}/${episode}`;
      }

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.video) {
          setError("Unavailable, Please change server");
          return;
        }

        const video = videoRef.current;
        if (video) {
          if (Hls.isSupported() && data.video.endsWith(".m3u8")) {
            const hls = new Hls();
            hls.loadSource(data.video);
            hls.attachMedia(video);
          } else {
            video.src = data.video;
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch video");
      }
    };

    loadVideo();
  }, [media_type, tmdb, season, episode]);

  return (
    <div className="h-full w-full bg-black flex items-center justify-center ">
      {error ? (
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      ) : (
        <video
          ref={videoRef}
          controls
          autoPlay
          preload="metadata"
          className="h-[88dvh] w-full bg-black outline-0"
        />
      )}
    </div>
  );
}
