"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { SaveWatchlistType } from "@/app/watchlist/watchlist-button";

export function useWatchlist() {
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
    return item.title  || "Unknown";
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
    toast.success(`Added ${getDisplayName(item)} to watchlist`, {
      description: `${
        item.media_type === "movie" ? "Movie" : "TV Show"
      } added successfully`,
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
      toast.success(`Removed ${getDisplayName(itemToRemove)} from watchlist`);
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
    localStorage.removeItem("watchlist");
    setWatchlist([]);

    if (count > 0) {
      toast.success(
        `Cleared ${count} item${count === 1 ? "" : "s"} from watchlist`
      );
    }
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
