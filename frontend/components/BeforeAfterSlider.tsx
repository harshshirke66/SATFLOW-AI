"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoveHorizontal, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface BeforeAfterSliderProps {
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  rightLabel?: string;
}

export default function BeforeAfterSlider({
  leftImage,
  rightImage,
  leftLabel = "Original Frame",
  rightLabel = "Interpolated Frame",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Handle drag movement
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  // Zoom controls
  const zoomIn = () => setZoom((z) => Math.min(3, z + 0.5));
  const zoomOut = () => setZoom((z) => Math.max(1, z - 0.5));
  const resetZoom = () => setZoom(1);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Handle browser ESC key out of fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-xl border border-white/10 bg-space-deep flex flex-col items-center ${
        isFullscreen ? "w-screen h-screen rounded-none z-50 p-4" : "w-full aspect-video max-h-[500px]"
      }`}
    >
      {/* Viewer Area */}
      <div className="relative w-full flex-1 overflow-hidden group">
        
        {/* Right Image (Background) */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          <img 
            src={rightImage} 
            alt="Right side" 
            className="w-full h-full object-contain pointer-events-none"
          />
          <span className="absolute bottom-4 right-4 bg-space-deep/80 text-isro-cyan text-xs font-semibold px-2.5 py-1 rounded-md border border-isro-cyan/20 backdrop-blur-sm">
            {rightLabel}
          </span>
        </div>

        {/* Left Image (Foreground with Clip) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-200"
          style={{ 
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            transform: `scale(${zoom})`,
            transformOrigin: "center"
          }}
        >
          <img 
            src={leftImage} 
            alt="Left side" 
            className="w-full h-full object-contain pointer-events-none"
          />
          <span className="absolute bottom-4 left-4 bg-space-deep/80 text-isro-orange text-xs font-semibold px-2.5 py-1 rounded-md border border-isro-orange/20 backdrop-blur-sm">
            {leftLabel}
          </span>
        </div>

        {/* Divider Slider line */}
        <div 
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-0.5 bg-isro-cyan cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Handle button */}
          <div className="absolute h-9 w-9 rounded-full bg-space-deep border-2 border-isro-cyan flex items-center justify-center shadow-lg shadow-isro-cyan/30 text-isro-cyan hover:scale-110 active:scale-95 transition-all">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="w-full bg-space-card/80 border-t border-white/5 py-2 px-4 flex items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <button 
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition disabled:opacity-30 disabled:pointer-events-none"
            title="Zoom Out"
          >
            <ZoomOut className="h-4.5 w-4.5" />
          </button>
          <span className="text-xs text-gray-400 font-medium px-1 w-10 text-center">
            {zoom.toFixed(1)}x
          </span>
          <button 
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition disabled:opacity-30 disabled:pointer-events-none"
            title="Zoom In"
          >
            <ZoomIn className="h-4.5 w-4.5" />
          </button>
          {zoom > 1 && (
            <button 
              onClick={resetZoom}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="text-[11px] text-gray-400 italic hidden sm:block">
          Drag the center handle left/right to compare frames.
        </div>

        <button 
          onClick={toggleFullscreen}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
        </button>
      </div>
    </div>
  );
}
