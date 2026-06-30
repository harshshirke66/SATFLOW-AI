"use client";

import { useEffect, useRef } from "react";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      width = canvas.width;
      height = canvas.height;
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();

    let rotationY = 0;
    let satelliteAngle = 0;

    // 3D Point on Sphere
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    const radius = 160; // sphere radius
    const dots: Point3D[] = [];

    // Generate latitude/longitude grid points
    const latCount = 18;
    const lonCount = 24;
    for (let i = 0; i <= latCount; i++) {
      const lat = (i * Math.PI) / latCount - Math.PI / 2;
      for (let j = 0; j < lonCount; j++) {
        const lon = (j * 2 * Math.PI) / lonCount;
        const x = radius * Math.cos(lat) * Math.cos(lon);
        const y = radius * Math.sin(lat);
        const z = radius * Math.cos(lat) * Math.sin(lon);
        dots.push({ x, y, z });
      }
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const d = 500; // perspective distance

      rotationY += 0.003; // speed of rotation
      satelliteAngle += 0.015; // speed of satellite

      // 1. Draw atmospheric outer glow
      const bgGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.3);
      bgGlow.addColorStop(0, "rgba(0, 242, 254, 0.03)");
      bgGlow.addColorStop(0.5, "rgba(0, 102, 255, 0.08)");
      bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.5, 0, 2 * Math.PI);
      ctx.fill();

      // 2. Draw satellite orbit line (tilted ellipse)
      ctx.strokeStyle = "rgba(255, 153, 51, 0.25)"; // ISRO Orange orbit
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      const orbitA = radius * 1.4;
      const orbitB = radius * 0.4;
      const tilt = -Math.PI / 6; // -30 degrees tilt

      for (let theta = 0; theta <= 2 * Math.PI; theta += 0.02) {
        // Parametric coordinates of ellipse
        const ox = orbitA * Math.cos(theta);
        const oy = orbitB * Math.sin(theta);
        
        // Tilt rotation
        const rx = ox * Math.cos(tilt) - oy * Math.sin(tilt);
        const ry = ox * Math.sin(tilt) + oy * Math.cos(tilt);
        
        if (theta === 0) {
          ctx.moveTo(cx + rx, cy + ry);
        } else {
          ctx.lineTo(cx + rx, cy + ry);
        }
      }
      ctx.stroke();

      // 3. Project and draw sphere dots
      dots.forEach((dot) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const rx = dot.x * cosY - dot.z * sinY;
        const rz = dot.x * sinY + dot.z * cosY;
        const ry = dot.y;

        // Perspective projection
        const scale = d / (d + rz);
        const px = cx + rx * scale;
        const py = cy + ry * scale;

        // Depth cueing (front points brighter than back points)
        const isFront = rz > 0;
        const opacity = isFront 
          ? Math.max(0.1, 0.45 * (1 - rz / radius)) 
          : Math.max(0.02, 0.15 * (1 - rz / radius));

        ctx.fillStyle = isFront ? `rgba(0, 242, 254, ${opacity})` : `rgba(0, 102, 255, ${opacity})`;
        
        ctx.beginPath();
        // Dot size based on perspective scale
        const dotSize = Math.max(0.8, 1.8 * scale);
        ctx.arc(px, py, dotSize, 0, 2 * Math.PI);
        ctx.fill();
      });

      // 4. Draw Satellite
      const satX = orbitA * Math.cos(satelliteAngle);
      const satY = orbitB * Math.sin(satelliteAngle);
      
      const srx = satX * Math.cos(tilt) - satY * Math.sin(tilt);
      const sry = satX * Math.sin(tilt) + satY * Math.cos(tilt);
      const srz = orbitA * Math.sin(satelliteAngle) * Math.sin(tilt); // Z approximation for layering

      const scx = cx + srx;
      const scy = cy + sry;

      // Glowing core of the satellite
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#ff9933";
      ctx.fillStyle = "#ff9933";
      ctx.beginPath();
      ctx.arc(scx, scy, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Clean up shadows
      ctx.shadowBlur = 0;

      // Draw satellite panel lines (small solar wings)
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(scx - 8, scy);
      ctx.lineTo(scx + 8, scy);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full max-w-[450px] max-h-[450px]"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
