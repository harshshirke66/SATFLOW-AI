"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Orbit, Compass, LayoutDashboard, Cpu, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Compass },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Architecture", href: "/architecture", icon: Cpu },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto flex items-center justify-between w-full max-w-4xl h-14 px-6 rounded-full glass-panel shadow-2xl backdrop-blur-2xl">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-accent-primary/40 transition-colors">
            <Orbit className="h-4 w-4 text-accent-primary animate-orbit-fast" />
            <div className="absolute inset-0 rounded-full bg-accent-primary/5 blur-sm group-hover:bg-accent-primary/10 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-white flex items-center gap-1">
              SATFLOW <span className="text-[8px] font-bold text-accent-primary px-1 py-0.2 rounded bg-accent-primary/10 border border-accent-primary/20">AI</span>
            </span>
            <span className="text-[8px] text-gray-500 tracking-wider uppercase font-semibold">
              ISRO HACKATHON
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 flex items-center gap-1.5 group"
                style={{
                  color: isActive ? "#ffffff" : "#94a3b8",
                }}
              >
                <Icon className={`h-3.5 w-3.5 transition-colors ${isActive ? "text-accent-primary" : "text-gray-400 group-hover:text-accent-primary"}`} />
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

        {/* Call to Action Button */}
        <div className="flex items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold tracking-wide text-bg-primary bg-accent-primary rounded-full hover:shadow-lg hover:shadow-accent-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
          >
            LAUNCH WORKSPACE
          </Link>
        </div>
      </header>
    </div>
  );
}
