"use client";

import React from "react";
import { 
  Waves, CloudLightning, Flame, Wind, Eye, 
  Settings, Server, Calendar, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

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
      
    </div>
  );
}
