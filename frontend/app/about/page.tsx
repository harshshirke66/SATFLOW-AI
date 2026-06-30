"use client";

import React, { useState } from "react";
import { 
  Waves, CloudLightning, Flame, Wind, Eye, 
  Settings, Server, Calendar, AlertCircle, Compass, Shield
} from "lucide-react";
import { motion } from "framer-motion";

interface AvatarProps {
  src?: string;
  initials: string;
  isLeader?: boolean;
}

const MemberAvatar = ({ src, initials, isLeader }: AvatarProps) => {
  const [hasError, setHasError] = React.useState(false);
  
  return (
    <div className="relative group/avatar">
      {/* Outer rotating dashed satellite HUD ring */}
      <div 
        className={`absolute -inset-3 rounded-full border border-dashed animate-spin pointer-events-none transition-colors duration-300 ${
          isLeader 
            ? "border-accent-primary/30 group-hover/avatar:border-accent-primary/60" 
            : "border-white/10 group-hover/avatar:border-accent-secondary/40"
        }`} 
        style={{ animationDuration: "20s" }} 
      />

      {/* Radar sweeping dot */}
      <div 
        className={`absolute -inset-3 rounded-full pointer-events-none animate-spin ${
          isLeader ? "text-accent-primary/40" : "text-accent-secondary/20"
        }`}
        style={{ animationDuration: "5s" }}
      >
        <div className="h-1 w-1 rounded-full bg-current absolute top-0 left-1/2 -translate-x-1/2" />
      </div>

      {/* Glow effect behind leader */}
      {isLeader && (
        <div className="absolute inset-0 rounded-full bg-accent-primary/10 blur-md group-hover/avatar:bg-accent-primary/20 transition-all duration-300" />
      )}

      {/* Main avatar container */}
      <div className={`h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full border flex items-center justify-center text-white text-xl font-black relative overflow-hidden transition-all duration-500 group-hover:scale-105 ${
        isLeader 
          ? "border-accent-primary bg-[#101826] shadow-[0_0_20px_rgba(22,217,255,0.12)]" 
          : "border-white/10 bg-[#090D15]"
      }`}>
        {src && !hasError ? (
          <img 
            src={src} 
            alt={initials} 
            onError={() => setHasError(true)} 
            className="absolute inset-0 object-cover w-full h-full grayscale filter group-hover:grayscale-0 transition-all duration-700 ease-out" 
          />
        ) : (
          <span className="bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent font-mono">{initials}</span>
        )}
      </div>
    </div>
  );
};

export default function AboutPage() {
  const hazards = [
    {
      title: "Cyclones & Hurricanes",
      icon: Wind,
      color: "#16D9FF",
      tag: "DYNAMICS // ROTATION",
      description: "Severe tropical cyclones expand and rotate rapidly. High temporal resolution is critical to track the cyclone eye coordinates, evaluate central pressure dynamics, and forecast landfalls.",
      layout: "md:col-span-2"
    },
    {
      title: "Floods & Surges",
      icon: Waves,
      color: "#4F8CFF",
      tag: "FLUIDS // INUNDATION",
      description: "River spills and flash flood surges expand over minutes. AI frame interpolation helps disaster managers visualize continuous flow fronts and map inundation speeds.",
      layout: "md:col-span-1"
    },
    {
      title: "Thunderstorms & Fronts",
      icon: CloudLightning,
      color: "#16D9FF",
      tag: "ATMOSPHERE // CONVECTIVE",
      description: "Convective storms form and discharge rapidly. Super-resolving the timeline between geostationary observations enables early warnings for severe lightning and convective drafts.",
      layout: "md:col-span-1"
    },
    {
      title: "Cloud Layer Tracking",
      icon: Eye,
      color: "#16D9FF",
      tag: "VECTORS // WIND SHEAR",
      description: "Tracking convective cloud clusters allows meteorologists to estimate upper-level winds, identify wind shear patterns, and improve numerical weather prediction (NWP) model feeds.",
      layout: "md:col-span-2"
    },
    {
      title: "Wildfires & Plumes",
      icon: Flame,
      color: "#4F8CFF",
      tag: "THERMAL // SMOKE DRIFT",
      description: "Wildfires spread continuously along thermal vectors. Tracking smoke plumes and predicting flame front drift requires dense temporal tracking to guide aerial suppression.",
      layout: "md:col-span-3"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary overflow-hidden tech-grid-bg radial-spotlight pt-28 pb-20 px-6 sm:px-12 max-w-7xl mx-auto select-text">
      <div className="noise-overlay" />
      
      {/* Page Header */}
      <div className="pb-6 border-b border-white/5 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-10">
        <div>
          <span className="text-[9px] font-bold text-accent-primary tracking-widest uppercase">System Specifications</span>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase mt-0.5">About SATFLOW AI</h1>
        </div>
        <p className="text-xs text-text-muted max-w-md font-medium leading-relaxed">
          Understanding the meteorological and computational foundations of software-defined temporal super-resolution.
        </p>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16 relative z-10">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[9px] font-black tracking-widest text-accent-primary uppercase border border-accent-primary/20 px-2 py-0.5 rounded bg-accent-primary/5">
              Problem Statement
            </span>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Meteorological Observation Gaps</h2>
            <p className="text-xs text-text-muted leading-relaxed font-medium">
              Geostationary satellites like INSAT-3D capture meteorological scans at intervals ranging from 15 to 30 minutes, while polar-orbiting satellites pass only once or twice a day. In the intervals between these scans, severe atmospheric events—such as rapid cyclonic rotation, lightning discharge, flash flooding, and wildfire spread—develop dynamically.
            </p>
            <p className="text-xs text-text-muted leading-relaxed font-medium">
              Launching additional physical satellites into orbit to increase temporal resolution is economically and logistically prohibitive. <strong>SATFLOW AI solves this by using AI-driven optical flow warping to synthesize highly realistic intermediate observation frames.</strong> This software-defined temporal resolution increase fills the data gaps, helping disaster mitigation agencies make timely decisions.
            </p>
          </div>
        </div>

        {/* Right Column: Fake telemetry terminal mockup */}
        <div className="lg:col-span-5 bg-[#090D15]/60 border border-white/5 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 h-28 w-28 bg-accent-primary/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-accent-primary" />
                <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">Telemetry Warning Log</span>
              </div>
              <span className="text-[8px] font-mono text-gray-500">FEED_SEC_3D</span>
            </div>
            
            <blockquote className="text-xs text-white italic border-l-2 border-accent-primary pl-4 leading-relaxed font-medium font-sans">
              "A 15-minute gap in monitoring a category-5 cyclone can mean the difference between a successful coastal evacuation and a disaster. Software temporal super-resolution is the bridge to continuous observation."
            </blockquote>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[9px] text-gray-500 font-mono">
            <span>MET_UNIT_SIMULATION</span>
            <span>— ISRO METEOROLOGICAL STUDY</span>
          </div>
        </div>
      </div>

      {/* Team Section (Handcrafted radar elements) */}
      <div className="space-y-6 relative z-10 mb-20">
        <div className="pb-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black text-accent-primary tracking-widest uppercase">Research Team</span>
            <h2 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">Team ByteBots</h2>
          </div>
          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline-block">
            Project Codename // SATFLOW
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Harsh Shirke (Leader) */}
          <div className="glass-panel p-6 rounded-3xl border-accent-primary/20 shadow-[0_0_20px_rgba(22,217,255,0.02)] flex flex-col items-center text-center gap-5 group hover:border-accent-primary/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-3 right-3 z-10">
              <span className="text-[8px] font-black text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2 py-0.5 rounded-full uppercase">
                Leader
              </span>
            </div>
            
            <div className="mt-2">
              <MemberAvatar src="/harsh photo.png" initials="HS" isLeader={true} />
            </div>

            <div className="space-y-1 z-10">
              <span className="text-[8px] font-mono text-accent-primary font-bold uppercase tracking-wider">ROLE // AI LEAD</span>
              <h3 className="text-sm font-bold text-white group-hover:text-accent-primary transition-colors mt-0.5">Harsh Shirke</h3>
            </div>
          </div>

          {/* Devansh Pandey */}
          <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col items-center text-center gap-5 group hover:border-accent-secondary/40 transition-all duration-300 relative overflow-hidden">
            <div className="mt-2">
              <MemberAvatar src="/devansh.png" initials="DP" />
            </div>

            <div className="space-y-1 z-10">
              <span className="text-[8px] font-mono text-accent-secondary font-bold uppercase tracking-wider">ROLE // ARCHITECT</span>
              <h3 className="text-sm font-bold text-white group-hover:text-accent-secondary transition-colors mt-0.5">Devansh Pandey</h3>
            </div>
          </div>

          {/* Deepa Choudhary */}
          <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col items-center text-center gap-5 group hover:border-accent-secondary/40 transition-all duration-300 relative overflow-hidden">
            <div className="mt-2">
              <MemberAvatar src="/deepa.jpeg" initials="DC" />
            </div>

            <div className="space-y-1 z-10">
              <span className="text-[8px] font-mono text-accent-secondary font-bold uppercase tracking-wider">ROLE // CV RESEARCH</span>
              <h3 className="text-sm font-bold text-white group-hover:text-accent-secondary transition-colors mt-0.5">Deepa Choudhary</h3>
            </div>
          </div>

          {/* Aditi Deshmukh */}
          <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col items-center text-center gap-5 group hover:border-accent-secondary/40 transition-all duration-300 relative overflow-hidden">
            <div className="mt-2">
              <MemberAvatar src="/aaditi.jpeg" initials="AD" />
            </div>

            <div className="space-y-1 z-10">
              <span className="text-[8px] font-mono text-accent-secondary font-bold uppercase tracking-wider">ROLE // ANALYST</span>
              <h3 className="text-sm font-bold text-white group-hover:text-accent-secondary transition-colors mt-0.5">Aditi Deshmukh</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Hazards Section */}
      <div className="space-y-6 mb-20 relative z-10">
        <div className="pb-4 border-b border-white/5">
          <span className="text-[9px] font-black text-accent-primary tracking-widest uppercase">Target Application Areas</span>
          <h2 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">Disaster Management Fields</h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {hazards.map((hazard, index) => {
            const Icon = hazard.icon;
            return (
              <motion.div 
                key={index}
                variants={cardVariants}
                className={`glass-panel p-6 rounded-3xl border border-white/5 hover:border-accent-primary/20 transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden group ${hazard.layout}`}
              >
                <div className="flex justify-between items-start">
                  <div 
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundColor: `${hazard.color}15`,
                      color: hazard.color
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[8px] font-mono text-gray-500 font-bold tracking-widest">{hazard.tag}</span>
                </div>
                
                <div className="space-y-1.5 mt-4">
                  <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-accent-primary transition-colors">{hazard.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-medium">{hazard.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Roadmap section (horizontal card grid) */}
      <div className="space-y-6 relative z-10">
        <div className="pb-4 border-b border-white/5">
          <span className="text-[9px] font-black text-accent-primary tracking-widest uppercase">System Scalability</span>
          <h2 className="text-sm font-black text-white uppercase tracking-wider mt-0.5 font-bold">Future Roadmap & ISRO Integration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Phase 1 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 group hover:border-accent-primary/30 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono text-accent-primary font-bold uppercase tracking-wider">
                PHASE // 01
              </span>
              <span className="text-2xl font-black text-accent-primary/20 group-hover:text-accent-primary/40 transition-colors font-mono">01</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Payload Fine-Tuning</h3>
              <p className="text-xs text-text-muted leading-relaxed font-medium">
                Integrate training logs directly with <strong>INSAT-3D/3DR</strong> thermal and water-vapor channel inputs. By fine-tuning the RIFE flow network on localized atmospheric coriolis movements, the model will learn to interpolate meteorological fluid dynamics rather than general pixel motions.
              </p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 group hover:border-accent-secondary/30 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono text-accent-secondary font-bold uppercase tracking-wider">
                PHASE // 02
              </span>
              <span className="text-2xl font-black text-accent-secondary/20 group-hover:text-accent-secondary/40 transition-colors font-mono">02</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">MOSDAC Integration</h3>
              <p className="text-xs text-text-muted leading-relaxed font-medium">
                Deploy as a containerized microservice on ISRO's <strong>MOSDAC</strong> (Meteorological & Oceanographic Satellite Data Archival Centre) or <strong>VEDAS</strong> platforms. Integration with active payload decoders allows real-time inference on incoming satellite feeds.
              </p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 group hover:border-accent-primary/30 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider">
                PHASE // 03
              </span>
              <span className="text-2xl font-black text-white/10 group-hover:text-accent-primary/30 transition-colors font-mono">03</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Sensor Fusion</h3>
              <p className="text-xs text-text-muted leading-relaxed font-medium">
                Fuse observations from multiple satellites (e.g. Indian INSAT and Japanese Himawari-9) by aligning their coordinate maps and using RIFE's arbitrary timestep parameter to fill in the asynchronous gaps between their passes.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
