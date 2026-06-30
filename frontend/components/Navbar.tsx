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
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-space-deep/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-isro-cyan/40 transition-colors">
            <Orbit className="h-5 w-5 text-isro-cyan animate-orbit-fast" />
            <div className="absolute inset-0 rounded-lg bg-isro-cyan/5 blur-sm group-hover:bg-isro-cyan/10 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wider text-white flex items-center gap-1.5">
              SATFLOW <span className="text-isro-orange text-xs px-1.5 py-0.5 rounded bg-isro-orange/10 border border-isro-orange/20">AI</span>
            </span>
            <span className="text-[10px] text-gray-400 tracking-widest uppercase font-semibold">
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
                className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 flex items-center gap-2 group"
                style={{
                  color: isActive ? "#ffffff" : "#9ca3af",
                }}
              >
                <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-isro-cyan" : "text-gray-400 group-hover:text-isro-cyan"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover Glow line */}
                {!isActive && (
                  <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-isro-cyan/50 rounded-full transition-all duration-300 group-hover:w-1/3 group-hover:-translate-x-1/2" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Call to Action Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wider text-space-deep bg-gradient-to-r from-isro-cyan to-isro-blue rounded-full hover:shadow-lg hover:shadow-isro-cyan/20 hover:scale-105 transition-all duration-300 active:scale-95"
          >
            LAUNCH APP
          </Link>
        </div>
      </div>
    </header>
  );
}
