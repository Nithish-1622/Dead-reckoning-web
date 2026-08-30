import React, { useEffect, useRef } from 'react';
import { useTheme } from '../lib/theme';

export const ThreeDimensionalBackground: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only initialize and render on desktop screens
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (window.innerWidth < 768) {
        if (animId) cancelAnimationFrame(animId);
        return;
      }
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    let targetMouseY = 0;
    let currentMouseY = 0;
    let targetMouseX = 0;
    let currentMouseX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 30;
      targetMouseY = (e.clientY / height - 0.5) * 20;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const RIB_COUNT = 110;

    const render = () => {
      if (width < 768) return;

      time += 0.005;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const isDark = theme === 'dark';
      ctx.clearRect(0, 0, width, height);

      // Desktop parameters
      const ribbonWidth = 48;
      const waveAmp = 36;
      const zDepthRange = 180;
      const fov = 800;
      const centerY = height * 0.36 + currentMouseY;

      // 3D Perspective Projection spanning from left edge (0) to right edge (width)
      const project3D = (screenX: number, y: number, z: number) => {
        const scale = fov / (fov + z);
        const centerX = width / 2;
        const projectedX = centerX + (screenX - centerX) * scale + currentMouseX * (z / zDepthRange);
        const projectedY = centerY + y * scale;
        return {
          px: projectedX,
          py: projectedY,
          scale,
          z
        };
      };

      // Generate dynamic ribs across full screen width
      const ribs: {
        top: { px: number; py: number; scale: number; z: number };
        bottom: { px: number; py: number; scale: number; z: number };
        mid: { px: number; py: number; scale: number; z: number };
        alpha: number;
      }[] = [];

      for (let i = 0; i <= RIB_COUNT; i++) {
        const t = i / RIB_COUNT;
        const screenX = -20 + t * (width + 40);

        const u = (t - 0.5) * 2;
        const yBase = Math.sin(u * Math.PI * 2.2 + time * 1.3) * waveAmp;
        const z3d = Math.cos(u * Math.PI * 2.0 + time * 0.9) * zDepthRange;

        const twistAngle = u * Math.PI * 2.8 + time * 1.6;
        const cosT = Math.cos(twistAngle);
        const sinT = Math.sin(twistAngle);

        const nx = -sinT * (ribbonWidth * 0.3);
        const ny = cosT * ribbonWidth;
        const nz = sinT * (ribbonWidth * 0.8);

        const ptTop = project3D(screenX + nx, yBase + ny, z3d + nz);
        const ptBottom = project3D(screenX - nx, yBase - ny, z3d - nz);
        const ptMid = project3D(screenX, yBase, z3d);

        const depthAlpha = (1 - (ptMid.z + zDepthRange) / (zDepthRange * 2)) * 0.6 + 0.4;
        const alpha = depthAlpha * (isDark ? 0.22 : 0.14);

        ribs.push({
          top: ptTop,
          bottom: ptBottom,
          mid: ptMid,
          alpha
        });
      }

      // 1. Shaded Translucent 3D Surface (Pure Monochrome)
      for (let i = 0; i < ribs.length - 1; i++) {
        const r1 = ribs[i];
        const r2 = ribs[i + 1];

        ctx.beginPath();
        ctx.moveTo(r1.top.px, r1.top.py);
        ctx.lineTo(r2.top.px, r2.top.py);
        ctx.lineTo(r2.bottom.px, r2.bottom.py);
        ctx.lineTo(r1.bottom.px, r1.bottom.py);
        ctx.closePath();

        const faceAlpha = Math.max(0.01, (r1.alpha + r2.alpha) * 0.4);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${faceAlpha})`
          : `rgba(0, 0, 0, ${faceAlpha * 0.85})`;
        ctx.fill();
      }

      // 2. Top Edge Rail
      ctx.beginPath();
      ctx.lineWidth = 1.8;
      for (let i = 0; i < ribs.length; i++) {
        const p = ribs[i].top;
        if (i === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.50)' : 'rgba(0, 0, 0, 0.40)';
      ctx.stroke();

      // 3. Bottom Edge Rail
      ctx.beginPath();
      ctx.lineWidth = 1.6;
      for (let i = 0; i < ribs.length; i++) {
        const p = ribs[i].bottom;
        if (i === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.40)' : 'rgba(0, 0, 0, 0.30)';
      ctx.stroke();

      // 4. Center Dashed Guide Spline
      ctx.beginPath();
      ctx.setLineDash([5, 6]);
      ctx.lineWidth = 0.8;
      for (let i = 0; i < ribs.length; i++) {
        const p = ribs[i].mid;
        if (i === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.18)';
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Transversal Cross-Ribs (Pure Monochrome)
      ctx.lineWidth = 0.7;
      for (let i = 0; i < ribs.length; i += 2) {
        const rRib = ribs[i];
        ctx.beginPath();
        ctx.moveTo(rRib.top.px, rRib.top.py);
        ctx.lineTo(rRib.bottom.px, rRib.bottom.py);

        const strokeAlpha = Math.max(0.02, rRib.alpha * 0.85);
        ctx.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${strokeAlpha})`
          : `rgba(0, 0, 0, ${strokeAlpha})`;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme]);

  return (
    <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden z-0 w-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Soft gradient mask ensuring clean typographic clarity on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black opacity-85" />
    </div>
  );
};
