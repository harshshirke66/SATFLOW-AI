"use client";

import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, FastForward, SkipBack, Info } from "lucide-react";

interface TimelineFrame {
  index: number;
  timestamp: string;
  is_ai: boolean;
  image_url: string;
  flow_url: string;
  heatmap_url: string;
}

interface FrameTimelineProps {
  frames: TimelineFrame[];
  currentIndex: number;
  onFrameChange: (index: number) => void;
}

export default function FrameTimeline({
  frames,
  currentIndex,
  onFrameChange,
}: FrameTimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(600); // ms per frame
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onFrameChange((currentIndex + 1) % frames.length);
      }, playbackSpeed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIndex, frames.length, playbackSpeed]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handlePrev = () => {
    setIsPlaying(false);
    onFrameChange((currentIndex - 1 + frames.length) % frames.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    onFrameChange((currentIndex + 1) % frames.length);
  };

  const handleReset = () => {
    setIsPlaying(false);
    onFrameChange(0);
  };

  return (
    <div className="w-full glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-6">
      
      {/* Timeline scrubbing line */}
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Timeline Path</span>
          <span className="font-mono text-isro-cyan">
            Frame {currentIndex + 1} of {frames.length}
          </span>
        </div>

        {/* The slider bar */}
        <div className="relative h-2 w-full bg-white/5 rounded-full flex items-center">
          {/* Progress fill */}
          <div 
            className="absolute left-0 h-full bg-gradient-to-r from-isro-cyan to-isro-blue rounded-full"
            style={{ width: `${(currentIndex / (frames.length - 1)) * 100}%` }}
          />

          {/* Dots representing each frame */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {frames.map((frame, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={frame.index}
                  onClick={() => {
                    setIsPlaying(false);
                    onFrameChange(idx);
                  }}
                  className={`group relative h-4 w-4 rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? "bg-white border-2 border-isro-cyan scale-125 z-10" 
                      : frame.is_ai 
                        ? "bg-isro-cyan/50 hover:bg-isro-cyan hover:scale-110" 
                        : "bg-isro-orange hover:bg-isro-orange hover:scale-110"
                  }`}
                  title={frame.timestamp}
                >
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-space-dark text-[10px] text-white border border-white/10 px-2 py-0.5 rounded shadow-lg whitespace-nowrap transition-transform z-20">
                    {frame.timestamp}
                  </span>
                  
                  {/* Tiny dot */}
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-space-deep" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Time stamps markers list */}
        <div className="flex justify-between px-1 text-[11px] text-gray-400 font-medium">
          {frames.map((frame, idx) => (
            <span 
              key={frame.index}
              className={`transition-colors ${idx === currentIndex ? "text-white font-bold" : ""}`}
            >
              {frame.timestamp.replace(" (AI)", "")}
            </span>
          ))}
        </div>
      </div>

      {/* Playback Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
        
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition"
            title="Jump to Start"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          
          <button
            onClick={handlePrev}
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white text-xs font-semibold transition"
          >
            Prev
          </button>

          <button
            onClick={togglePlay}
            className={`px-5 py-2 rounded-lg text-space-deep text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
              isPlaying 
                ? "bg-isro-orange hover:shadow-lg hover:shadow-isro-orange/20" 
                : "bg-isro-cyan hover:shadow-lg hover:shadow-isro-cyan/20"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>PLAY AUTO</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white text-xs font-semibold transition"
          >
            Next
          </button>
        </div>

        {/* Speed control and legend */}
        <div className="flex items-center gap-6">
          
          {/* Speed settings */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Interval Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg text-xs py-1 px-2.5 text-white focus:outline-none focus:border-isro-cyan"
            >
              <option value={1000} className="bg-space-dark text-white">0.5x (1.0s)</option>
              <option value={600} className="bg-space-dark text-white">1.0x (0.6s)</option>
              <option value={300} className="bg-space-dark text-white">2.0x (0.3s)</option>
            </select>
          </div>

          {/* Color legend */}
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-isro-orange" />
              <span>Input Observation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-isro-cyan" />
              <span>AI Synthesized Frame</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
