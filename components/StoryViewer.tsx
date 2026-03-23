"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { StoryGroup, api } from "@/lib/api";

interface StoryViewerProps {
  groups: StoryGroup[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ groups, initialIndex, onClose }: StoryViewerProps) {
  const [groupIndex, setGroupIndex] = useState(initialIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const group = groups[groupIndex];
  const story = group?.stories[storyIndex];
  const duration = (story?.duracao ?? 5) * 1000;

  const goNext = useCallback(() => {
    if (storyIndex < group.stories.length - 1) {
      setStoryIndex((i) => i + 1);
      setProgress(0);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex((i) => i + 1);
      setStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [storyIndex, groupIndex, group?.stories.length, groups.length, onClose]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
      setProgress(0);
    } else if (groupIndex > 0) {
      setGroupIndex((i) => i - 1);
      setStoryIndex(groups[groupIndex - 1].stories.length - 1);
      setProgress(0);
    }
  }, [storyIndex, groupIndex, groups]);

  // Mark as viewed
  useEffect(() => {
    if (story && !story.visto) {
      api.visualizarStory(story.id).catch(() => {});
    }
  }, [story]);

  // Auto-advance timer
  useEffect(() => {
    if (!story) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + 100 / (duration / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [story, duration, goNext]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  if (!group || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-800/60 text-white hover:bg-zinc-700 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Navigation arrows */}
      {(groupIndex > 0 || storyIndex > 0) && (
        <button
          onClick={goPrev}
          className="absolute left-4 z-20 p-2 rounded-full bg-zinc-800/60 text-white hover:bg-zinc-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {(groupIndex < groups.length - 1 || storyIndex < group.stories.length - 1) && (
        <button
          onClick={goNext}
          className="absolute right-4 z-20 p-2 rounded-full bg-zinc-800/60 text-white hover:bg-zinc-700 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Story container */}
      <div className="relative w-full max-w-md aspect-[9/16] bg-zinc-900 rounded-2xl overflow-hidden">
        {/* Progress bars */}
        <div className="absolute top-0 inset-x-0 z-10 flex gap-1 px-3 pt-3">
          {group.stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-75"
                style={{
                  width: i < storyIndex ? "100%" : i === storyIndex ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Author info */}
        <div className="absolute top-6 inset-x-0 z-10 flex items-center gap-3 px-4">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
            {group.user.image ? (
              <img src={group.user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              group.user.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white drop-shadow">{group.user.name}</p>
            <p className="text-[10px] text-white/60">
              {new Date(story.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* Media */}
        {story.tipo_midia === "video" ? (
          <video
            src={story.midia_url}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={story.midia_url}
            alt=""
            className="h-full w-full object-cover"
          />
        )}

        {/* Click zones */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3" onClick={goPrev} />
          <div className="w-1/3" />
          <div className="w-1/3" onClick={goNext} />
        </div>

        {/* Views count */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-white/60 text-xs">
          <Eye size={14} />
          {story.views_count}
        </div>
      </div>
    </div>
  );
}
