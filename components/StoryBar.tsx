"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { StoryGroup, api } from "@/lib/api";
import StoryViewer from "./StoryViewer";

interface StoryBarProps {
  stories: StoryGroup[];
  currentUserId?: string;
  onCreateStory: () => void;
  onRefresh: () => void;
}

export default function StoryBar({ stories, currentUserId, onCreateStory, onRefresh }: StoryBarProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  const openStory = (index: number) => {
    setActiveGroupIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* Create story */}
        <button
          onClick={onCreateStory}
          className="flex flex-col items-center gap-1.5 shrink-0"
        >
          <div className="relative h-16 w-16 rounded-full bg-zinc-800/60 border-2 border-dashed border-zinc-700 flex items-center justify-center transition-all hover:border-zinc-500 hover:bg-zinc-800">
            <Plus size={20} className="text-zinc-400" />
          </div>
          <span className="text-[10px] font-medium text-zinc-500 w-16 text-center truncate">
            Criar
          </span>
        </button>

        {/* Story avatars */}
        {stories.map((group, i) => (
          <button
            key={group.user.id}
            onClick={() => openStory(i)}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div
              className={`h-16 w-16 rounded-full p-[2px] ${
                group.hasUnseen
                  ? "bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500"
                  : "bg-zinc-700"
              }`}
            >
              <div className="h-full w-full rounded-full bg-zinc-950 p-[2px]">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                  {group.user.image ? (
                    <img src={group.user.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    group.user.name?.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-medium text-zinc-400 w-16 text-center truncate">
              {group.user.id === currentUserId ? "Você" : group.user.name?.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {viewerOpen && (
        <StoryViewer
          groups={stories}
          initialIndex={activeGroupIndex}
          onClose={() => {
            setViewerOpen(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
}
