"use client";

import React, { useState, useEffect } from "react";
import { Orbit } from "lucide-react";

export default function TelemetryWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      fetch("http://localhost:8000/health")
        .then((res) => {
          if (res.ok) {
            setIsOnline(true);
            return res.json();
          }
          setIsOnline(false);
          return null;
        })
        .then((data) => {
          if (data) setStatus(data);
        })
        .catch(() => {
          setIsOnline(false);
        });
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto select-none font-mono">
      {/* Expanded Telemetry Status Overlay */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-64 bg-[#090D15]/95 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Telemetry Link</span>
            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isOnline 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {isOnline ? "Connected" : "Offline"}
            </span>
          </div>

          <div className="text-[9px] space-y-1.5 text-gray-400">
            <div className="flex justify-between items-center">
              <span>ACTIVE SYSTEM:</span>
              <span className="text-white font-bold">SATFLOW CORE</span>
            </div>
            <div className="flex justify-between items-center">
              <span>HARDWARE:</span>
              <span className="text-white font-bold">
                {isOnline && status?.cuda?.available ? "CUDA (GPU)" : "CPU (Fallback)"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>FLOW ENGINE:</span>
              <span className="text-accent-primary font-bold">
                {isOnline && status?.model?.available ? "RIFE v3 (Neural)" : "Farneback (Classical)"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>API ENDPOINT:</span>
              <span className="text-gray-500 text-[8px]">127.0.0.1:8000</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-black border cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 relative group shadow-lg ${
          isOnline 
            ? "border-accent-primary/30 hover:border-accent-primary shadow-accent-primary/5" 
            : "border-red-500/30 hover:border-red-500 shadow-red-500/5"
        }`}
      >
        <Orbit 
          className={`h-5 w-5 transition-colors ${
            isOnline 
              ? "text-accent-primary animate-spin" 
              : "text-red-400 animate-pulse"
          }`} 
          style={{ animationDuration: isOnline ? "12s" : "2s" }} 
        />

        {/* Glowing online status dot */}
        <span className={`absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-black ${
          isOnline ? "bg-emerald-400" : "bg-red-400"
        }`} />
      </button>
    </div>
  );
}
