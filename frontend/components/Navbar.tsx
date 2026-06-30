"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Orbit, Compass, LayoutDashboard, Cpu, Info, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: Compass },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Architecture", href: "/architecture", icon: Cpu },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto flex items-center justify-between w-full max-w-5xl h-16 px-6 rounded-full glass-panel shadow-2xl backdrop-blur-2xl relative">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-accent-primary/40 transition-colors">
            <Orbit className="h-5 w-5 text-accent-primary animate-spin" style={{ animationDuration: "16s" }} />
            <div className="absolute inset-0 rounded-full bg-accent-primary/5 blur-sm group-hover:bg-accent-primary/10 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white flex items-center gap-1">
              SATFLOW <span className="text-[9px] font-bold text-accent-primary px-1 py-0.2 rounded bg-accent-primary/10 border border-accent-primary/20">AI</span>
            </span>
            <span className="text-[9px] text-gray-500 tracking-wider uppercase font-semibold hidden sm:block">
              ISRO HACKATHON
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4.5 py-2 text-[13px] font-semibold rounded-full transition-colors duration-200 flex items-center gap-1.5 group"
                style={{
                  color: isActive ? "#ffffff" : "#94a3b8",
                }}
              >
                <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-accent-primary" : "text-gray-400 group-hover:text-accent-primary"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-accent-primary/10 border border-accent-primary/20 rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop LAUNCH Button */}
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center justify-center px-5 py-2 text-[13px] font-bold tracking-wide text-bg-primary bg-accent-primary rounded-full hover:shadow-lg hover:shadow-accent-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
          >
            LAUNCH WORKSPACE
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-20 left-4 right-4 bg-[#090D15]/95 border border-white/10 rounded-3xl p-5 flex flex-col gap-3 shadow-2xl backdrop-blur-xl pointer-events-auto"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4.5 py-3 rounded-2xl border transition-all ${
                      isActive 
                        ? "bg-accent-primary/10 border-accent-primary/20 text-white font-bold" 
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span className="text-[13px]">{item.name}</span>
                  </Link>
                );
              })}
              <div className="border-t border-white/5 pt-4 mt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-accent-primary text-bg-primary text-[13px] font-bold rounded-2xl"
                >
                  <span>LAUNCH WORKSPACE</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
