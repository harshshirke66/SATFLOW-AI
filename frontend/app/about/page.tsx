"use client";

import React from "react";
import { 
  Waves, CloudLightning, Flame, Wind, Eye, 
  Settings, Server, Calendar, AlertCircle
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
    <div className={`h-20 w-20 rounded-full border flex items-center justify-center text-white text-base font-black relative overflow-hidden group-hover:scale-105 transition-transform duration-300 ${
      isLeader 
        ? "border-accent-primary bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 shadow-[0_0_12px_rgba(22,217,255,0.2)]" 
        : "border-white/10 bg-gradient-to-br from-white/5 to-white/10"
    }`}>
      {src && !hasError ? (
        <img 
          src={src} 
          alt={initials} 
          onError={() => setHasError(true)} 
          className="absolute inset-0 object-cover w-full h-full" 
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default function AboutPage() {
  const hazards = [
    {
      title: "Cyclones & Hurricanes",
      icon: Wind,
      color: "#16D9FF", // Accent Primary
      description: "Severe tropical cyclones expand and rotate rapidly. High temporal resolution is critical to track the cyclone eye coordinates, evaluate central pressure dynamics, and forecast landfalls."
    },
    {
      title: "Floods & Surges",
      icon: Waves,
      color: "#4F8CFF", // Accent Secondary
      description: "River spills and flash flood surges expand over minutes. AI frame interpolation helps disaster managers visualize continuous flow fronts and map inundation speeds."
    },
    {
      title: "Thunderstorms & Fronts",
      icon: CloudLightning,
      color: "#16D9FF", // Accent Primary
      description: "Convective storms form and discharge rapidly. Super-resolving the timeline between geostationary observations enables early warnings for severe lightning and convective drafts."
    },
    {
      title: "Wildfires & Plumes",
      icon: Flame,
      color: "#4F8CFF", // Accent Secondary
      description: "Wildfires spread continuously along thermal vectors. Tracking smoke plumes and predicting flame front drift requires dense temporal tracking to guide aerial suppression."
    },
    {
      title: "Cloud Layer Tracking",
      icon: Eye,
      color: "#16D9FF", // Accent Primary
      description: "Tracking convective cloud clusters allows meteorologists to estimate upper-level winds, identify wind shear patterns, and improve numerical weather prediction (NWP) model feeds."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
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
    <div className="relative min-h-screen bg-bg-primary text-text-primary overflow-hidden tech-grid-bg radial-spotlight pt-28 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="noise-overlay" />
      
      {/* Page Header */}
      <div className="pb-6 border-b border-white/5 mb-8">
        <h1 className="text-2xl font-black tracking-tight text-white uppercase">About SATFLOW AI</h1>
        <p className="text-xs text-text-muted mt-1 leading-relaxed font-medium">
          Understanding the meteorological and computational foundation of temporal super-resolution.
        </p>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 relative z-10">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xs font-black tracking-widest text-accent-primary uppercase">The Problem Statement</h2>
          <p className="text-xs text-text-muted leading-relaxed font-medium">
            Geostationary satellites like INSAT-3D capture meteorological scans at intervals ranging from 15 to 30 minutes, while polar-orbiting satellites pass only once or twice a day. In the intervals between these scans, severe atmospheric events—such as rapid cyclonic rotation, lightning discharge, flash flooding, and wildfire spread—develop dynamically.
          </p>
          <p className="text-xs text-text-muted leading-relaxed font-medium">
            Launching additional physical satellites into orbit to increase temporal resolution is economically and logistically prohibitive. <strong>SATFLOW AI solves this by using AI-driven optical flow warping to synthesize highly realistic intermediate observation frames.</strong> This software-defined temporal resolution increase fills the data gaps, helping disaster mitigation agencies make timely decisions.
          </p>
        </div>
        <div className="lg:col-span-5 bg-[#101826]/40 border border-white/5 p-6 rounded-2xl space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent-primary/[0.01] pointer-events-none" />
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-accent-primary" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Disaster Evacuation Metric</span>
          </div>
          <blockquote className="text-xs text-white italic border-l border-accent-primary pl-4 leading-relaxed font-medium">
            "A 15-minute gap in monitoring a category-5 cyclone can mean the difference between a successful coastal evacuation and a disaster. Software temporal super-resolution is the bridge to continuous observation."
          </blockquote>
          <div className="text-[9px] text-gray-500 font-bold tracking-wider uppercase text-right">
            — ISRO Meteorological Wing (Simulation Study)
          </div>
        </div>
      </div>

      {/* Atmospheric Hazards Section */}
      <div className="space-y-6 mb-16 relative z-10">
        <div className="pb-4 border-b border-white/5">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Disaster Management Applications</h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed font-medium">
            How SATFLOW AI enhances tracking capabilities across different meteorological hazards:
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {hazards.map((hazard, index) => {
            const Icon = hazard.icon;
            return (
              <motion.div 
                key={index}
                variants={cardVariants}
                className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent-primary/20 transition-all duration-300 flex flex-col gap-4"
              >
                <div 
                  className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ 
                    backgroundColor: `${hazard.color}15`,
                    color: hazard.color
                  }}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-tight">{hazard.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-medium">{hazard.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Future Scope Section */}
      <div className="space-y-6 relative z-10">
        <div className="pb-4 border-b border-white/5">
          <h2 className="text-sm font-black text-white uppercase tracking-wider font-bold">Future Roadmap & ISRO Integration</h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed font-medium">
            The modular architecture of SATFLOW AI is engineered to scale from hackathon demonstration to real-world national security pipelines:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Roadmap 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-accent-primary">
              <Settings className="h-4 w-4" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Payload Fine-Tuning</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-medium">
              Integrate training logs directly with <strong>INSAT-3D/3DR</strong> thermal and water-vapor channel inputs. By fine-tuning the RIFE flow network on localized atmospheric coriolis movements, the model will learn to interpolate meteorological fluid dynamics rather than general pixel motions.
            </p>
          </div>

          {/* Roadmap 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-accent-secondary">
              <Server className="h-4 w-4" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">MOSDAC Integration</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-medium">
              Deploy as a containerized microservice on ISRO's <strong>MOSDAC</strong> (Meteorological & Oceanographic Satellite Data Archival Centre) or <strong>VEDAS</strong> platforms. Integration with active payload decoders allows real-time inference on incoming satellite feeds.
            </p>
          </div>

          {/* Roadmap 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-accent-primary">
              <Calendar className="h-4 w-4" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Sensor Fusion</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-medium">
              Fuse observations from multiple satellites (e.g. Indian INSAT and Japanese Himawari-9) by aligning their coordinate maps and using RIFE's arbitrary timestep parameter to fill in the asynchronous gaps between their passes.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-6 relative z-10 pt-8 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black tracking-widest text-accent-primary uppercase px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20">
            Hackathon Submission
          </span>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Team ByteBots</h2>
          <p className="text-xs text-text-muted leading-relaxed font-medium">
            The computer vision engineers and data researchers behind SATFLOW AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Harsh Shirke (Leader) */}
          <div className="glass-panel p-5 rounded-2xl border border-accent-primary/30 shadow-[0_0_15px_rgba(22,217,255,0.05)] flex flex-col items-center text-center gap-4 group hover:border-accent-primary/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-2.5 right-2.5">
              <span className="text-[8px] font-black text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2 py-0.5 rounded-full uppercase">
                Leader
              </span>
            </div>
            
            <MemberAvatar src="/team/harsh.png" initials="HS" isLeader={true} />

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-accent-primary transition-colors">Harsh Shirke</h3>
              <p className="text-[10px] text-accent-primary font-bold uppercase tracking-wider">Team Leader & AI Lead</p>
              <p className="text-[10px] text-text-muted leading-relaxed font-medium pt-1.5 border-t border-white/5 mt-1.5">
                RIFE model optimization, PyTorch hardware execution cores, and pipeline flow controllers.
              </p>
            </div>
          </div>

          {/* Devansh Pandey */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4 group hover:border-accent-secondary/30 transition-all duration-300 relative">
            <MemberAvatar src="/team/devansh.png" initials="DP" />

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-accent-secondary transition-colors">Devansh Pandey</h3>
              <p className="text-[10px] text-accent-secondary font-bold uppercase tracking-wider">Full-Stack Architect</p>
              <p className="text-[10px] text-text-muted leading-relaxed font-medium pt-1.5 border-t border-white/5 mt-1.5">
                FastAPI endpoints backend, Next.js 15 UI, dark glassmorphism styling, and state management.
              </p>
            </div>
          </div>

          {/* Deepa Choudhary */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4 group hover:border-accent-secondary/30 transition-all duration-300 relative">
            <MemberAvatar src="/team/deepa.png" initials="DC" />

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-accent-secondary transition-colors">Deepa Choudhary</h3>
              <p className="text-[10px] text-accent-secondary font-bold uppercase tracking-wider">Computer Vision Lead</p>
              <p className="text-[10px] text-text-muted leading-relaxed font-medium pt-1.5 border-t border-white/5 mt-1.5">
                Farneback dense flow algorithms, heatmaps, vector visualization, and performance indices.
              </p>
            </div>
          </div>

          {/* Aditi Deshmukh */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4 group hover:border-accent-secondary/30 transition-all duration-300 relative">
            <MemberAvatar src="/team/aditi.png" initials="AD" />

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-accent-secondary transition-colors">Aditi Deshmukh</h3>
              <p className="text-[10px] text-accent-secondary font-bold uppercase tracking-wider">Data Operations Analyst</p>
              <p className="text-[10px] text-text-muted leading-relaxed font-medium pt-1.5 border-t border-white/5 mt-1.5">
                INSAT satellite raw sensor ingestion, drift trajectories, and meteorological validations.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
