"use client";

import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, SkipBack, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="w-full glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-6 shadow-xl">
      
      {/* Timeline track container */}
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between text-[10px] tracking-wider uppercase font-bold text-gray-400">
          <span>Observation Timeline Track</span>
          <span className="font-mono text-accent-primary">
            Frame {currentIndex + 1} of {frames.length}
          </span>
        </div>

        {/* The slider bar */}
        <div className="relative h-1.5 w-full bg-white/5 rounded-full flex items-center">
          {/* Progress fill */}
          <div 
            className="absolute left-0 h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full shadow-[0_0_10px_rgba(22,217,255,0.4)]"
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
                  className={`group relative h-3.5 w-3.5 rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? "bg-white border-2 border-accent-primary scale-125 z-10 shadow-[0_0_8px_rgba(22,217,255,0.8)]" 
                      : frame.is_ai 
                        ? "bg-accent-primary/60 hover:bg-accent-primary hover:scale-110" 
                        : "bg-accent-secondary hover:bg-accent-secondary hover:scale-110"
                  }`}
                  title={frame.timestamp}
                >
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#05070B] text-[9px] font-bold text-white border border-white/10 px-2.5 py-1 rounded-md shadow-2xl whitespace-nowrap transition-transform z-20">
                    {frame.timestamp}
                  </span>
                  
                  {/* Tiny dot inside active point */}
                  <span className={`h-1 w-1 rounded-full ${isSelected ? "bg-[#05070B]" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Time stamps markers list */}
        <div className="flex justify-between px-1 text-[9px] font-bold tracking-wider text-gray-400 font-mono">
          {frames.map((frame, idx) => (
            <span 
              key={frame.index}
              className={`transition-colors ${idx === currentIndex ? "text-white font-extrabold" : ""}`}
            >
              {frame.timestamp.replace(" (AI)", "")}
            </span>
          ))}
        </div>
      </div>

      {/* Playback Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
        
        {/* Playback buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition"
            title="Reset to Start"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition"
            title="Previous Frame"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-5 py-1.5 rounded-full text-[#05070B] text-xs font-black tracking-wide flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
              isPlaying 
                ? "bg-accent-secondary hover:shadow-lg hover:shadow-accent-secondary/20" 
                : "bg-accent-primary hover:shadow-lg hover:shadow-accent-primary/20"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>PLAY SEQUENCER</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition"
            title="Next Frame"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Speed control and legend */}
        <div className="flex items-center gap-6">
          
          {/* Speed settings */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg text-[10px] py-1 px-2.5 text-white font-bold tracking-wide focus:outline-none focus:border-accent-primary"
            >
              <option value={1000} className="bg-[#090D15] text-white">0.5x (1.0s)</option>
              <option value={600} className="bg-[#090D15] text-white">1.0x (0.6s)</option>
              <option value={300} className="bg-[#090D15] text-white">2.0x (0.3s)</option>
            </select>
          </div>

          {/* Color legend */}
          <div className="hidden sm:flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
              <span>Input Observation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
              <span>AI Synthesized Frame</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
