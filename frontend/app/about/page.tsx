"use client";

import React from "react";
import { 
  Waves, CloudLightning, Flame, Wind, Eye, 
  MapPin, Settings, Server, Calendar 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const hazards = [
    {
      title: "Cyclones & Typhoons",
      icon: Wind,
      color: "#00f2fe",
      description: "Severe tropical cyclones expand and rotate rapidly. High temporal resolution is critical to track the cyclone eye coordinates, evaluate central pressure dynamics, and forecast landfalls."
    },
    {
      title: "Floods & Inundations",
      icon: Waves,
      color: "#4facfe",
      description: "River spills and flash flood surges expand over minutes. AI frame interpolation helps disaster managers visualize continuous flow fronts and map inundation speeds."
    },
    {
      title: "Thunderstorms & Fronts",
      icon: CloudLightning,
      color: "#ff9933",
      description: "Convective storms form and discharge rapidly. Super-resolving the timeline between geostationary observations enables early warnings for severe lightning and convective drafts."
    },
    {
      title: "Wildfires & Plumes",
      icon: Flame,
      color: "#ff5500",
      description: "Wildfires spread continuously along thermal vectors. Tracking smoke plumes and predicting flame front drift requires dense temporal tracking to guide aerial suppression."
    },
    {
      title: "Convective Cloud Tracking",
      icon: Eye,
      color: "#bd00ff",
      description: "Tracking convective cloud clusters allows meteorologists to estimate upper-level winds, identify wind shear patterns, and improve numerical weather prediction (NWP) model feeds."
    }
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12 relative select-text">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-white/5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          About SATFLOW AI
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Understanding the meteorological and computational foundation of temporal super-resolution.
        </p>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-isro-cyan">The Problem Statement</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Geostationary satellites like INSAT-3D capture meteorological scans at intervals ranging from 15 to 30 minutes, while polar-orbiting satellites pass only once or twice a day. In the intervals between these scans, severe atmospheric events—such as rapid cyclonic rotation, lightning discharge, flash flooding, and wildfire spread—develop dynamically.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Launching additional physical satellites into orbit to increase temporal resolution is economically and logistically prohibitive. <strong>SATFLOW AI solves this by using AI-driven optical flow warping to synthesize highly realistic intermediate observation frames.</strong> This software-defined temporal resolution increase fills the data gaps, helping disaster mitigation agencies make timely decisions.
          </p>
        </div>
        <div className="lg:col-span-5 bg-white/3 border border-white/5 p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-isro-orange" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Why it matters</span>
          </div>
          <blockquote className="text-sm text-white italic border-l-2 border-isro-cyan pl-4 leading-relaxed">
            "A 15-minute gap in monitoring a category-5 cyclone can mean the difference between a successful coastal evacuation and a disaster. Software temporal super-resolution is the bridge to continuous observation."
          </blockquote>
          <div className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase text-right">
            — ISRO Meteorological Wing (Simulation Study)
          </div>
        </div>
      </div>

      {/* Atmospheric Hazards Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-isro-orange">Applications in Disaster Management</h2>
          <p className="text-sm text-gray-400 mt-1">
            How SATFLOW AI enhances tracking capabilities across different meteorological hazards:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hazards.map((hazard, index) => {
            const Icon = hazard.icon;
            return (
              <div 
                key={index}
                className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col gap-4"
              >
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ 
                    backgroundColor: `${hazard.color}15`,
                    color: hazard.color
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">{hazard.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{hazard.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Scope Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-isro-cyan">Future Roadmap & ISRO Integration</h2>
          <p className="text-sm text-gray-400 mt-1">
            The modular architecture of SATFLOW AI is engineered to scale from hackathon demonstration to real-world national security pipelines:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Roadmap 1 */}
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-isro-cyan">
              <Settings className="h-4.5 w-4.5" />
              <h3 className="text-sm font-bold text-white">Fine-Tuning on Indian Payloads</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Integrate training logs directly with <strong>INSAT-3D/3DR</strong> thermal and water-vapor channel inputs. By fine-tuning the RIFE flow network on localized atmospheric coriolis movements, the model will learn to interpolate meteorological fluid dynamics rather than general pixel motions.
            </p>
          </div>

          {/* Roadmap 2 */}
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-isro-orange">
              <Server className="h-4.5 w-4.5" />
              <h3 className="text-sm font-bold text-white">ISRO Infrastructure Deployment</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Deploy as a containerized microservice on ISRO's <strong>MOSDAC</strong> (Meteorological & Oceanographic Satellite Data Archival Centre) or <strong>VEDAS</strong> platforms. Integration with active payload decoders allows real-time inference on incoming satellite feeds.
            </p>
          </div>

          {/* Roadmap 3 */}
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-isro-purple">
              <Calendar className="h-4.5 w-4.5" />
              <h3 className="text-sm font-bold text-white">Multi-Satellite Sensor Fusion</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fuse observations from multiple satellites (e.g. Indian INSAT and Japanese Himawari-9) by aligning their coordinate maps and using RIFE's arbitrary timestep parameter to fill in the asynchronous gaps between their passes.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
