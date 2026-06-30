"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Orbit, Cpu, Sparkles, Activity, ShieldCheck, ArrowRight, Video } from "lucide-react";
import Globe from "@/components/Globe";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const features = [
    {
      icon: Cpu,
      title: "RIFE v3 AI Engine",
      description: "Pre-trained deep neural network fine-tuned on satellite imagery. Pre-caches weights to interpolate realistic intermediate frames in real-time.",
    },
    {
      icon: Activity,
      title: "Flow Vector Estimation",
      description: "Calculates dense velocity fields (Farneback baseline) to map cyclone rotation vectors, wind speed distribution, and vortex direction.",
    },
    {
      icon: Sparkles,
      title: "Difference Heatmaps",
      description: "Generates change heatmaps using JET color tables to trace structural changes, pressure fluctuations, and thermodynamic expansions.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary overflow-hidden tech-grid-bg radial-spotlight radial-ambient">
      <div className="noise-overlay" />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 pb-12 lg:pt-36 lg:pb-20 relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 min-h-[calc(100vh-80px)]">
        
        {/* Text Left Column */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-xs font-semibold text-accent-primary">
            <Orbit className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ISRO Bharatiya Antariksh Hackathon</span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Enhance Satellite <br />
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Temporal Resolution
              </span>
            </h1>
            <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              SATFLOW AI synthesizes realistic intermediate observations between consecutive satellite passes. Using pre-trained RIFE Neural Interpolation to capture transient meteorological dynamics.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent-primary hover:bg-accent-primary/95 text-bg-primary text-sm font-black rounded-full hover:shadow-lg hover:shadow-accent-primary/25 transition-all duration-200"
            >
              <span>Launch Workstation</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/architecture"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold rounded-full transition-all duration-200"
            >
              <Video className="h-4 w-4 text-accent-secondary" />
              <span>Pipeline Architecture</span>
            </Link>
          </motion.div>

          {/* Trusted Badges */}
          <motion.div variants={itemVariants} className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-xs text-text-muted font-semibold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              <span>Production-Ready Fallbacks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-accent-primary" />
              <span>Real-time Flow Vectoring</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Globe Right Column */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-1 w-full items-center justify-center relative aspect-square max-w-[500px]"
        >
          {/* Ambient Glow behind globe */}
          <div className="absolute inset-0 bg-accent-primary/5 rounded-full filter blur-3xl animate-pulse-slow" />
          
          {/* Globe Canvas Component */}
          <div className="w-full h-full relative z-10">
            <Globe />
          </div>
        </motion.div>
      </div>

      {/* Key Features Block */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pb-32">
        <div className="border-t border-white/5 pt-20">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Technical Capabilities</h2>
            <p className="text-sm text-text-muted font-medium">
              Combining pre-trained neural networks with classical computer vision parameters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-left group hover:border-accent-primary/20 transition-all duration-300"
                >
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent-primary/30 transition-colors">
                    <Icon className="h-5 w-5 text-accent-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{feature.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-medium">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
