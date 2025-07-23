// lib/servers.ts
import { Tally1, Tally2, Tally4, Tally5 } from "lucide-react";

export function getServers(id: string, season?: string, episode?: string) {
  return [
    {
      name: "Server 1",
      isRecommended: false,
      sandboxSupport: true,
      sublabel: "Sandbox support",
      description:
        "Fast and ad-free streaming. Limited to movies and may occasionally be unavailable.",
      movieLink: `https://zxczxc-pi.vercel.app/player/movie/${id}`,
      tvLink: `https://zxczxc-pi.vercel.app/player/tv/${id}/${season}/${episode}`,
      icon: <Tally1 />,
      value: "server1",
    },
    {
      name: "Server 2",
      isRecommended: false,
      sandboxSupport: true,
      sublabel: "Sandbox support",
      description:
        "Fast and ad-free streaming. Limited to movies and may occasionally be unavailable.",
      movieLink: `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true`,
      tvLink: `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=true`,
      icon: <Tally1 />,
      value: "server1",
    },
    {
      name: "Server 3",
      sublabel: "Sandbox support",
      isRecommended: true,
      sandboxSupport: true,
      description:
        "Fast performance with a wide selection of movies and TV shows. 4k support",
      movieLink: `https://player.videasy.net/movie/${id}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&color=8B5CF6"`,
      tvLink: `https://player.videasy.net/tv/${id}/${season}/${episode}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&color=8B5CF6"`,
      icon: <Tally2 />,
      value: "server2",
    },

    {
      name: "Server 4",
      sublabel: "Doesn't support sandbox",
      isRecommended: true,
      sandboxSupport: false,
      description:
        "Reliable server with a vast collection and fast streaming. Ads may be present.",
      movieLink: `https://vidsrc.xyz/embed/movie/${id}`,
      tvLink: `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
      icon: <Tally4 />,
      value: "server4",
    },
    {
      name: "ZXCSTREAM",
      sublabel: "Main Server (No Ads)",
      isRecommended: true,
      sandboxSupport: false,
      description: "Main Server (No Ads)",
      movieLink: ` https://api-movie-tau.vercel.app/player/movie/${id}`,
      tvLink: ` https://api-movie-tau.vercel.app/player/tv/${id}/${season}/${episode}`,
      icon: <Tally5 />,
      value: "mainserver",
    },
  ];

  // {
  //   name: "Server 2",
  //   sublabel: "Doesn't support sandbox",
  //   isRecommended: true,
  //   sandboxSupport: false,
  //   description:
  //     "Fast performance with a wide selection of movies and TV shows. Contains ads due to no sandbox support.",
  //   movieLink: `https://vidfast.pro/movie/${id}?autoPlay=true&theme=FF0000`,
  //   tvLink: `https://vidfast.pro/tv/${id}/${season}/${episode}?autoPlay=true&theme=FF0000`,
  //   icon: <Tally1 />,
  //   value: "server5",
  // },

  // {
  //   name: "Server 3",
  //   sublabel: "Doesn't support sandbox",
  //   isRecommended: false,
  //   sandboxSupport: false,
  //   description:
  //     "High-speed streaming with a large movie library. Ads may be present due to lack of sandbox support.",
  //   movieLink: `https://vidlink.pro/movie/${id}?primaryColor=0008ff&secondaryColor=000000&iconColor=ffffff&icons=default&player=jw&title=true&poster=false&autoplay=true&nextbutton=true`,
  //   tvLink: `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=0008ff&secondaryColor=000000&iconColor=ffffff&icons=default&player=jw&title=true&poster=false&autoplay=true&nextbutton=true`,
  //   icon: <Tally2 />,
  //   value: "server3",
  // },
}

// "use client";
// import { useParams } from "next/navigation";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import GetMovieData from "@/lib/getMovieData";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, ArrowUpDown, Power } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// function formatTime(seconds: number): string {
//   const hrs = Math.floor(seconds / 3600);
//   const mins = Math.floor((seconds % 3600) / 60);
//   const secs = Math.floor(seconds % 60);

//   const padded = (n: number) => String(n).padStart(2, "0");
//   return `${padded(hrs)}:${padded(mins)}:${padded(secs)}`;
// }
// interface localWatchlist {
//   id: string;
//   media_type: string;
//   backdrop: string;
//   currentTime: number;
//   isComplete: boolean;
//   season: number;
//   episode: number;
// }
// export default function WatchPage() {
//   const { params } = useParams() as { params?: string[] };
//   const media_type = params?.[0];
//   const id = params?.[1];
//   const season = params?.[2];
//   const episode = params?.[3];
//   if (!id || !media_type) {
//     return <div>Error: Missing media ID or type.</div>;
//   }
//   const { show, loading } = GetMovieData({ id, media_type });
//   const [selected, setSelected] = useState("Server Alpha");
//   const [sandboxEnabled, setSandboxEnabled] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);

//   const backdrop = show?.images.backdrops.find(
//     (meow) => meow.iso_639_1 === "en"
//   );
//   const title = show?.title || show?.name || "N/A";
//   const servers = [
//     {
//       name: "Server Alpha",
//       isRecommended: true,
//       sublabel: "No Ads",
//       description: "Fast and clean experience, but limited to movies only.",
//       movieLink: `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true`,
//       tvLink: `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=true`,
//     },
//     {
//       name: "Server Beta",
//       sublabel: "Sandbox required",
//       isRecommended: true,
//       description:
//         "Extensive movie collection with fast streaming, but contains ads.",
//       movieLink: `https://vidsrc.xyz/embed/movie/${id}`,
//       tvLink: `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
//     },
//     {
//       name: "Server Delta",
//       sublabel: "Sandbox required",
//       isRecommended: false,
//       description: "Reliable streaming with autoplay and next episode support.",
//       movieLink: `https://vidora.su/movie/${id}?colour=fb1533&autoplay=true&autonextepisode=true&backbutton=&pausescreen=true`,
//       tvLink: `https://vidora.su/tv/${id}/${season}/${episode}?colour=fb1533&autoplay=true&autonextepisode=true&backbutton=&pausescreen=true`,
//     },
//     {
//       name: "Server Gamma",
//       sublabel: "Sandbox required",
//       isRecommended: false,
//       description: "Smooth playback with autoplay enabled by default.",
//       movieLink: `https://vidsrc.su/embed/movie/${id}`,
//       tvLink: `https://vidsrc.su/embed/tv/${id}/${season}/${episode}`,
//     },
//     {
//       name: "Server Epsilon",
//       sublabel: "Sandbox required",
//       isRecommended: false,
//       description: "Stylized player with autoplay and customizable theme.",
//       movieLink: `https://vidfast.pro/movie/${id}?autoPlay=true&theme=FF0000`,
//       tvLink: `https://vidfast.pro/tv/${id}/${season}/${episode}?autoPlay=true&theme=FF0000`,
//     },
//   ];
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isComplete, setIsComplete] = useState(false);

//   useEffect(() => {
//     if (!id || !media_type || !title) return;
//     const watchingData = {
//       id,
//       media_type,
//       backdrop,
//       currentTime,
//       isComplete,
//       season: season || null,
//       episode: episode || null,
//     };

//     const insertLocal = JSON.parse(
//       localStorage.getItem("recentlyWatch") || "[]"
//     );

//     const filteredId = insertLocal.filter(
//       (item: localWatchlist) => item.id !== id
//     );
//     const combineUpdate = [watchingData, ...filteredId];

//     localStorage.setItem("recentlyWatch", JSON.stringify(combineUpdate));
//   }, []);

//   useEffect(() => {
//     if (selected !== "Server Alpha") return;
//     const handleMessage = (event: MessageEvent) => {
//       if (event.origin !== "https://vidsrc.cc") return;

//       const { data } = event;
//       if (data?.type === "PLAYER_EVENT") {
//         const eventType = data.data?.event;

//         if (eventType === "time") {
//           setCurrentTime(data.data.currentTime);
//           setDuration(data.data.duration);
//         }

//         if (eventType === "complete") {
//           setIsComplete(true);
//         }
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//       className="fixed z-30 inset-0 w-full h-screen overflow-auto flex flex-col bg-background"
//     >
//       <div className="relative flex-1">
//         <iframe
//           key={`${src}-${sandboxEnabled}`}
//           src=""
//           title="Video Player"
//           className="flex-1"
//           allowFullScreen
//           frameBorder={0}
//           {...(sandboxEnabled && {
//             sandbox: "allow-scripts allow-same-origin allow-forms",
//           })}
//         />

//         <span className="absolute transform translate-y-[70%] top-[70%] translate-x-[50%] right-[50%] bg-black/50 p-4 rounded-full">
//           <Power strokeWidth={3} />
//         </span>

//         <Drawer>
//           <DrawerTrigger asChild className="absolute right-3 top-3">
//             <Button variant="outline">
//               Switch Server <ArrowUpDown />
//             </Button>
//           </DrawerTrigger>
//           <DrawerContent>
//             <DrawerHeader className="sr-only">
//               <DrawerTitle>Are you absolutely sure?</DrawerTitle>
//               <DrawerDescription>
//                 This action cannot be undone.
//               </DrawerDescription>
//             </DrawerHeader>

//             <div className="w-full p-4 flex justify-between items-start gap-3">
//               <span>
//                 <p>
//                   Sandbox{" "}
//                   <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
//                     (Adblocker)
//                   </span>
//                 </p>
//                 <p className="text-muted-foreground text-xs">
//                   Some server do not support by sandbox, you must turn it off
//                   before they work
//                 </p>
//               </span>
//               <div className="inline-flex items-center gap-2 [--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]">
//                 <Switch id={id} defaultChecked />
//                 <Label htmlFor={id} className="sr-only">
//                   Colored switch
//                 </Label>
//               </div>
//             </div>
//             <div className="p-4 grid lg:grid-cols-2 grid-cols-1 gap-2 overflow-auto">
//               <div className="lg:col-span-2 col-span-1">Select Servers</div>
//               {servers.map((server) => (
//                 <div
//                   key={server.name}
//                   className="border-input relative flex items-center gap-2 rounded-md border p-4 shadow-xs outline-none"
//                 >
//                   <div className="flex grow items-start gap-3">
//                     <svg
//                       className="shrink-0"
//                       xmlns="http://www.w3.org/2000/svg"
//                       width={32}
//                       height={32}
//                       aria-hidden="true"
//                     >
//                       <circle cx="16" cy="16" r="16" fill="#090A15" />
//                       <path
//                         fill="#fff"
//                         fillRule="evenodd"
//                         d="M8.004 19.728a.996.996 0 0 1-.008-1.054l7.478-12.199a.996.996 0 0 1 1.753.104l6.832 14.82a.996.996 0 0 1-.618 1.37l-10.627 3.189a.996.996 0 0 1-1.128-.42l-3.682-5.81Zm8.333-9.686a.373.373 0 0 1 .709-.074l4.712 10.904a.374.374 0 0 1-.236.506L14.18 23.57a.373.373 0 0 1-.473-.431l2.63-13.097Z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <div className="grid grow gap-2">
//                       <Label>
//                         {server.name}
//                         <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
//                           {server.isRecommended ? "(Recommended)" : ""}
//                         </span>
//                       </Label>
//                       <p className="text-muted-foreground text-xs">
//                         {server.description}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <DrawerFooter>
//               <DrawerClose asChild>
//                 <Button variant="outline">Close</Button>
//               </DrawerClose>
//             </DrawerFooter>
//           </DrawerContent>
//         </Drawer>

//         <Button
//           className="absolute right-3 translate-y-[45%] top-[45%]"
//           variant="outline"
//         >
//           Next <ArrowRight />
//         </Button>

//         <div className="absolute bottom-0 w-full flex justify-between items-center px-2 py-4 text-xs bg-muted/50 bord truncate gap-5">
//           <p>Server Alpha</p>
//           <p>Sandbox Disabled</p>
//           {media_type === "movie" ? (
//             <p>Movie</p>
//           ) : (
//             <div className="flex items-center gap-3">
//               <p>TV Show</p>

//               <p>
//                 S{season}E{episode}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// ("use client");
// import { ArrowLeft, Server } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";

// export default function WatchPage() {
//   const { params } = useParams() as { params?: string[] };

//   const mediaType = params?.[0];
//   const id = params?.[1];
//   const season = params?.[2];
//   const episode = params?.[3];
//   const [selected, setSelected] = useState("Server Alpha");
//   const [sandboxEnabled, setSandboxEnabled] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   const servers = [
//     {
//       name: "Server Alpha",

//       sublabel: "No Ads",
//       description: "Fast and clean experience, but limited to movies only.",
//       movieLink: `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true`,
//       tvLink: `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=true`,
//     },

//     // movieLink: `https://www.zxcstream.icu/#play?movie/${id}`,
//     {
//       name: "Server Beta",
//       sublabel: "Sandbox required",
//       description:
//         "Extensive movie collection with fast streaming, but contains ads.",
//       movieLink: `https://vidsrc.xyz/embed/movie/${id}`,
//       tvLink: `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
//     },
//     {
//       name: "Server Delta",
//       sublabel: "Sandbox required",
//       description: "Reliable streaming with autoplay and next episode support.",
//       movieLink: `https://vidora.su/movie/${id}?colour=fb1533&autoplay=true&autonextepisode=true&backbutton=&pausescreen=true`,
//       tvLink: `https://vidora.su/tv/${id}/${season}/${episode}?colour=fb1533&autoplay=true&autonextepisode=true&backbutton=&pausescreen=true`,
//     },
//     {
//       name: "Server Gamma",
//       sublabel: "Sandbox required",
//       description: "Smooth playback with autoplay enabled by default.",
//       movieLink: `https://vidsrc.su/embed/movie/${id}`,
//       tvLink: `https://vidsrc.su/embed/tv/${id}/${season}/${episode}`,
//     },
//     {
//       name: "Server Epsilon",
//       sublabel: "Sandbox required",
//       description: "Stylized player with autoplay and customizable theme.",
//       movieLink: `https://vidfast.pro/movie/${id}?autoPlay=true&theme=FF0000`,
//       tvLink: `https://vidfast.pro/tv/${id}/${season}/${episode}?autoPlay=true&theme=FF0000`,
//     },
//   ];

//   const current = servers.find((server) => server.name === selected);
//   const src =
//     mediaType === "movie"
//       ? current?.movieLink
//       : mediaType === "tv"
//       ? current?.tvLink
//       : "";

//   // Set loading to true when server changes or sandbox setting changes
//   useEffect(() => {
//     setIsLoading(true);
//   }, [selected, sandboxEnabled]);

//   const handleIframeLoad = () => {
//     setIsLoading(false);
//   };

//   const handleServerChange = (serverName: string) => {
//     setSelected(serverName);
//     setIsLoading(true);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//       className="fixed z-[999] inset-0 w-full h-screen overflow-auto flex flex-col bg-background"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center p-4 border-b border-gray-700">
//         <div
//           onClick={() => {
//             router.back();
//           }}
//           className="text-white tracking-[-1px] text-md flex items-center cursor-pointer hover:text-gray-300 transition-colors zxczxc"
//         >
//           <ArrowLeft strokeWidth={3} className="h-5 w-5 mr-2 c" />
//           BACK
//         </div>

//         <div className="flex gap-3 items-center text-white">
//           <p className="text-sm">Sandbox</p>
//           <Switch
//             checked={sandboxEnabled}
//             onCheckedChange={setSandboxEnabled}
//           />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="min-h-[50vh] h-screen w-full flex overflow-hidden">
//         {/* Video Player */}
//         <div className="flex-1 relative">
//           {/* Loading Overlay */}
//           {isLoading && (
//             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
//               <div className="flex flex-col items-center gap-4">
//                 <div className="w-9 h-9 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
//                 <p className="text-white text-sm">Loading video...</p>
//               </div>
//             </div>
//           )}

//           <iframe
//             key={`${src}-${sandboxEnabled}`} // Force refresh when sandbox changes
//             src={src}
//             title="Video Player"
//             className="w-full h-full"
//             allowFullScreen
//             frameBorder={0}
//             onLoad={handleIframeLoad}
//             {...(sandboxEnabled && {
//               sandbox: "allow-scripts allow-same-origin allow-forms",
//             })}
//           />
//         </div>
//       </div>

//       <div className="border-t border-gray-700 p-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
//           {servers.map((server) => (
//             <div
//               className={`border-input relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none cursor-pointer transition-colors  ${
//                 server.name === selected
//                   ? "!border-blue-500 text-blue-400"
//                   : "hover:border-gray-400 text-white"
//               }`}
//               onClick={() => handleServerChange(server.name)}
//               key={server.name}
//             >
//               <div className="flex grow items-center gap-3">
//                 <Server className="h-5 w-5 flex-shrink-0" />
//                 <div className="grid gap-2 ">
//                   <Label
//                     htmlFor={server.name}
//                     className="cursor-pointer truncate"
//                   >
//                     {server.name}{" "}
//                     <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
//                       ({server.sublabel})
//                     </span>
//                   </Label>
//                   <p
//                     id={`${server.name}-description`}
//                     className="text-muted-foreground text-xs "
//                   >
//                     {server.description}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// }
