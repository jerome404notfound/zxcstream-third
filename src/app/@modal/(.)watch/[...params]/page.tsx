"use client";

import { useParams, useSearchParams } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import GetMovieData from "@/lib/getMovieData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpDown, Loader, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getServers } from "./servers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SaveProgress } from "../save-progress";

export default function WatchPage() {
  const router = useRouter();
  const { params } = useParams() as { params?: string[] };
  const searchParams = useSearchParams();
  const media_type = params?.[0];
  const id = params?.[1];
  const season = params?.[2];
  const episode = params?.[3];
  const defaultServer = searchParams.get("server") || "Server 1";

  const [openDialog, setOpenDialog] = useState(true);
  const [selected, setSelected] = useState(defaultServer);

  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const isCompleteRef = useRef(false);

  const servers = useMemo(
    () => getServers(id || "", season, episode),
    [id, season, episode]
  );
  const ser = servers.find((m) => m.name === defaultServer)?.sandboxSupport;
  console.log(ser);
  const [sandboxEnabled, setSandboxEnabled] = useState(ser);
  const { show } = GetMovieData({ id: id || "", media_type: media_type || "" });

  // Update refs whenever state changes
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  // Save progress function that uses current refs
  const saveCurrentProgress = useCallback(() => {
    if (!id || !media_type || !show) return;

    SaveProgress({
      id,
      media_type,
      title: show?.title || show?.name || "N/A",
      currentTime: currentTimeRef.current,
      duration: durationRef.current,
      backdrop:
        show?.images?.backdrops?.find((b) => b.iso_639_1 === "en")?.file_path ||
        "",
      isComplete: isCompleteRef.current,
      season: season || "",
      episode: episode || "",
      releaseDate: show?.release_date || show?.first_air_date || "",
      serverName: selected,
    });

    console.log("Progress saved:", {
      currentTime: currentTimeRef.current,
      duration: durationRef.current,
      isComplete: isCompleteRef.current,
    });
  }, [id, media_type, show, season, episode, selected]);

  useEffect(() => {
    if (
      selected !== "Server 1" &&
      selected !== "Server 2" &&
      selected !== "Server 3"
    )
      return;

    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        "https://vidsrc.cc",
        "https://vidlink.pro",
        "https://vidfast.pro",
      ];
      if (!allowedOrigins.includes(event.origin)) return;

      const { data } = event;
      if (data?.type !== "PLAYER_EVENT") return;

      const { event: eventType, currentTime, duration } = data.data;

      // Update states
      if (["play", "pause", "seeked", "timeupdate"].includes(eventType)) {
        setCurrentTime(currentTime);
        setDuration(duration);
      }

      if (eventType === "ended") {
        setIsComplete(true);
      }

      console.log(`Player ${eventType} at ${currentTime}s / ${duration}s`);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [selected]);

  // Auto-save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTimeRef.current > 0 && durationRef.current > 0) {
        saveCurrentProgress();
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [saveCurrentProgress]);

  // Save progress when component unmounts
  useEffect(() => {
    return () => {
      saveCurrentProgress();
    };
  }, [saveCurrentProgress]);

  useEffect(() => {
    setIsLoading(true);
  }, [selected, sandboxEnabled]);

  const current = servers.find((server) => server.name === selected);
  const src =
    media_type === "movie"
      ? current?.movieLink
      : media_type === "tv"
      ? current?.tvLink
      : "";

  const handleDialogClose = (openD: boolean) => {
    if (!openD) {
      // Save progress before closing
      saveCurrentProgress();

      // Small delay to ensure save completes
      setTimeout(() => {
        setOpenDialog(false);
        router.back();
      }, 100);
    } else {
      setOpenDialog(openD);
    }
  };

  if (!id || !media_type) {
    return <div>Error: Missing media ID or type.</div>;
  }

  return (
    <>
      <Dialog open={openDialog} onOpenChange={handleDialogClose}>
        <DialogContent
          className="h-full w-full min-w-full p-0"
          showCloseButton={false}
        >
          <div className="sr-only">
            <DialogHeader>
              <DialogTitle>Video Player</DialogTitle>
              <DialogDescription>
                Watch your selected media content
              </DialogDescription>
            </DialogHeader>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-full overflow-auto flex flex-col bg-background"
          >
            <div className="relative flex-1">
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-9 h-9 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                    <p className="text-white text-sm">Loading video...</p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="absolute z-40 top-15 right-2 bg-transparent"
                onClick={() => setOpen(true)}
              >
                Switch Server <ArrowUpDown />
              </Button>

              {src && (
                <iframe
                  key={`${src}-${sandboxEnabled}`}
                  src={src}
                  onLoad={() => setIsLoading(false)}
                  title="Video Player"
                  className="h-full w-full"
                  allowFullScreen
                  frameBorder={0}
                  {...(sandboxEnabled && {
                    sandbox: "allow-scripts allow-same-origin allow-forms",
                  })}
                />
              )}

              <Button
                className="absolute top-15 z-40 left-2"
                variant="outline"
                onClick={() => {
                  saveCurrentProgress();
                  setTimeout(() => router.back(), 100);
                }}
              >
                <ArrowLeft strokeWidth={3} />
                Back
              </Button>
            </div>

            <div className="w-full flex justify-between items-center px-2 py-3 text-xs bg-black border truncate gap-5">
              <p className="flex-1 text-left">{selected}</p>
              <p className="flex-1 text-center">
                {sandboxEnabled ? "Sandbox Enabled" : "Sandbox Disabled"}
              </p>
              <div
                className={`flex justify-end gap-1 items-center flex-1 text-right ${
                  currentTime ? "text-green-500" : "text-red-500 animate-pulse"
                }`}
              >
                {currentTime ? (
                  <>
                    Syncing
                    <Loader size={15} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Not Synced <X size={15} />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Server Selection</DrawerTitle>
            <DrawerDescription>
              Choose a server to stream from
            </DrawerDescription>
          </DrawerHeader>

          <div className="w-full p-4 flex justify-between items-start gap-3">
            <span>
              <p>
                Sandbox{" "}
                <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                  (Adblocker)
                </span>
              </p>
              <p className="text-muted-foreground text-xs">
                Some servers do not support sandbox, you must turn it off before
                they work
              </p>
            </span>
            <div className="inline-flex items-center gap-2">
              <Switch
                id="sandbox"
                checked={sandboxEnabled}
                onCheckedChange={setSandboxEnabled}
              />
              <Label htmlFor="sandbox" className="sr-only">
                Sandbox toggle
              </Label>
            </div>
          </div>

          <div className="p-4 grid lg:grid-cols-2 grid-cols-1 gap-2 overflow-auto">
            <div className="lg:col-span-2 col-span-1">Select Servers</div>
            {servers.map((server) => (
              <div
                key={server.name}
                onClick={() => {
                  setSelected(server.name);
                  setIsLoading(true);
                  setOpen(false);
                  setSandboxEnabled(server.sandboxSupport);
                }}
                className={`border-input relative flex items-center gap-2 rounded-md border p-4 shadow-xs outline-none cursor-pointer ${
                  server.name === selected
                    ? "!border-blue-500 text-blue-400"
                    : "hover:border-gray-400 text-white"
                }`}
              >
                <div className="flex grow items-start gap-3">
                  <svg
                    className="shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width={32}
                    height={32}
                    aria-hidden="true"
                  >
                    <circle cx="16" cy="16" r="16" fill="#090A15" />
                    <path
                      fill="#fff"
                      fillRule="evenodd"
                      d="M8.004 19.728a.996.996 0 0 1-.008-1.054l7.478-12.199a.996.996 0 0 1 1.753.104l6.832 14.82a.996.996 0 0 1-.618 1.37l-10.627 3.189a.996.996 0 0 1-1.128-.42l-3.682-5.81Zm8.333-9.686a.373.373 0 0 1 .709-.074l4.712 10.904a.374.374 0 0 1-.236.506L14.18 23.57a.373.373 0 0 1-.473-.431l2.63-13.097Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="grid grow gap-2">
                    <Label>
                      {server.name}
                      <span className="text-xs leading-[inherit] font-normal text-green-500">
                        {server.isRecommended ? " (Recommended)" : ""}
                      </span>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      {server.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
