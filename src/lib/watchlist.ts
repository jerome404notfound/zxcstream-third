"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SaveWatchlistType } from "@/app/watchlist/watchlist-button";
import { customToast } from "@/components/ui/custom-toast";

export function useWatchlist() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<SaveWatchlistType[]>([]);

  // Helper function to get current watchlist from localStorage
  const getCurrentWatchlist = (): SaveWatchlistType[] => {
    try {
      const saved = localStorage.getItem("watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Helper function to get display name
  const getDisplayName = (item: SaveWatchlistType) => {
    return item.title || "Unknown";
  };

  // Load from localStorage on mount
  useEffect(() => {
    setWatchlist(getCurrentWatchlist());
  }, []);

  const addToWatchlist = (item: SaveWatchlistType) => {
    // Always read current data from localStorage first
    const currentWatchlist = getCurrentWatchlist();

    const exists = currentWatchlist.some(
      (existing) =>
        existing.id === item.id && existing.media_type === item.media_type
    );

    if (exists) {
      toast.info(`${getDisplayName(item)} is already in your watchlist`);
      return;
    }

    const newWatchlist = [...currentWatchlist, item];

    // Update both localStorage and state
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
    setWatchlist(newWatchlist);

    // Show success toast
    // Show custom success toast with actions
    customToast.action("Added to watchlist", {
      description: `${getDisplayName(item)} (${
        item.media_type === "movie" ? "Movie" : "TV Show"
      }) added successfully`,
      onAction: () => {
        router.push("/watchlist");
        console.log("View watchlist clicked");
      },
      actionLabel: "View Watchlist",
      onUndo: () => {
        removeFromWatchlist(item.id, item.media_type);
      },
      undoLabel: "Undo",
    });
  };

  const removeFromWatchlist = (id: string, mediaType = "movie") => {
    // Always read current data from localStorage first
    const currentWatchlist = getCurrentWatchlist();

    const itemToRemove = currentWatchlist.find(
      (item) => item.id === id && item.media_type === mediaType
    );
    const newWatchlist = currentWatchlist.filter(
      (item) => !(item.id === id && item.media_type === mediaType)
    );

    // Update both localStorage and state
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
    setWatchlist(newWatchlist);

    // Show success toast

    if (itemToRemove) {
      customToast.success(
        "Removed from watchlist",
        `${getDisplayName(itemToRemove)} has been removed from your watchlist`
      );
    }
  };

  const isInWatchlist = (id: string, mediaType = "movie") => {
    return watchlist.some(
      (item) => item.id === id && item.media_type === mediaType
    );
  };

  const toggleWatchlist = (item: SaveWatchlistType) => {
    if (isInWatchlist(item.id, item.media_type)) {
      removeFromWatchlist(item.id, item.media_type);
    } else {
      addToWatchlist(item);
    }
  };

  const clearWatchlist = () => {
    const count = watchlist.length;
    if (count === 0) {
      customToast.info("Watchlist is empty", "There are no items to clear");
      return;
    }
    localStorage.removeItem("watchlist");
    setWatchlist([]);
    customToast.warning(
      "Watchlist cleared",
      `Removed ${count} item${count === 1 ? "" : "s"} from your watchlist`
    );
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    count: watchlist.length,
  };
}
