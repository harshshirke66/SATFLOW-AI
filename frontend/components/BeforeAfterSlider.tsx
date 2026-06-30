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
    let position = (x / rect.width) * 100;
    
    // Magnetic snapping at boundaries
    if (position < 2) position = 0;
    if (position > 98) position = 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
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
      className={`relative select-none overflow-hidden rounded-2xl border border-white/5 bg-[#05070B] flex flex-col items-center shadow-2xl transition-all duration-300 ${
        isFullscreen ? "w-screen h-screen rounded-none z-50 p-6 bg-[#05070B]" : "w-full aspect-video max-h-[520px]"
      }`}
    >
      {/* Viewer Area */}
      <div className="relative w-full flex-1 overflow-hidden group">
        
        {/* Right Image (Background) */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          <img 
            src={rightImage} 
            alt="Right side" 
            className="w-full h-full object-contain pointer-events-none"
          />
          <span className="absolute bottom-4 right-4 bg-[#05070B]/85 text-accent-primary text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-lg border border-accent-primary/20 backdrop-blur-md shadow-lg">
            {rightLabel}
          </span>
        </div>

        {/* Left Image (Foreground with Clip) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-300 ease-out"
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
          <span className="absolute bottom-4 left-4 bg-[#05070B]/85 text-accent-secondary text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-lg border border-accent-secondary/20 backdrop-blur-md shadow-lg">
            {leftLabel}
          </span>
        </div>

        {/* Divider Slider line */}
        <div 
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-[1px] bg-accent-primary/40 hover:bg-accent-primary cursor-ew-resize flex items-center justify-center transition-colors"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Glowing slide boundary */}
          <div className="absolute inset-y-0 w-2 bg-gradient-to-r from-transparent via-accent-primary/10 to-transparent pointer-events-none" />

          {/* Premium Glass Handle */}
          <div className="absolute h-10 w-10 rounded-xl bg-[#121c2d]/45 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-black/80 text-white hover:border-accent-primary/40 hover:scale-105 active:scale-95 transition-all">
            <MoveHorizontal className="h-4 w-4 text-accent-primary" />
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="w-full bg-[#090D15]/90 border-t border-white/5 py-3 px-6 flex items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <button 
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition disabled:opacity-20 disabled:pointer-events-none"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-[10px] text-gray-400 font-mono font-bold px-1.5 w-12 text-center bg-white/5 border border-white/5 py-0.5 rounded-md">
            {zoom.toFixed(1)}x
          </span>
          <button 
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition disabled:opacity-20 disabled:pointer-events-none"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          {zoom > 1 && (
            <button 
              onClick={resetZoom}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="text-[10px] text-gray-400 tracking-wider uppercase font-bold hidden sm:block">
          Drag split handle to compare observations
        </div>

        <button 
          onClick={toggleFullscreen}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
