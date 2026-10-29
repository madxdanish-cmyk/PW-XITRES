import React, { useEffect, useRef } from 'react';

export const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Star particles
    const starCount = Math.min(140, Math.floor((width * height) / 9000));
    interface Star {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      twinkleSpeed: number;
      color: string;
    }

    const starColors = [
      '#ffffff',
      '#fef08a', // soft gold
      '#fef9c3', // pale warm gold
      '#93c5fd', // pale crystal sky
      '#e2e8f0', // soft starlight
    ];

    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      speedY: -(Math.random() * 0.45 + 0.15), // flying upward
      speedX: (Math.random() - 0.5) * 0.2, // slight horizontal drift
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // Shooting stars (meteors)
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }

    let shootingStars: ShootingStar[] = [];

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.5),
        length: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 degrees diagonal
        opacity: 1,
        active: true,
      });
    };

    let meteorTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        spawnShootingStar();
      }
    }, 4500);

    // Initial shooting star
    setTimeout(spawnShootingStar, 1200);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft black cosmic gradient overlay
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0c0e17');
      bgGrad.addColorStop(0.6, '#08090e');
      bgGrad.addColorStop(1, '#050609');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle warm gold & indigo nebula highlights
      const goldGlow = ctx.createRadialGradient(
        width * 0.8,
        height * 0.15,
        0,
        width * 0.8,
        height * 0.15,
        width * 0.45
      );
      goldGlow.addColorStop(0, 'rgba(234, 179, 8, 0.035)');
      goldGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, width, height);

      const purpleGlow = ctx.createRadialGradient(
        width * 0.15,
        height * 0.75,
        0,
        width * 0.15,
        height * 0.75,
        width * 0.5
      );
      purpleGlow.addColorStop(0, 'rgba(99, 102, 241, 0.04)');
      purpleGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = purpleGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw & fly stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star upward (flying star effect)
        star.y += star.speedY;
        star.x += star.speedX;

        // Wrap around
        if (star.y < 0) {
          star.y = height + 10;
          star.x = Math.random() * width;
        }
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;

        // Twinkle
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.015;
        const currentOpacity = Math.max(0.15, Math.min(1, star.opacity));

        // Draw star with soft halo
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();

        // Extra glow on larger stars
        if (star.size > 1.8) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = currentOpacity * 0.25;
          ctx.fill();
        }
      }

      // Draw and update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (!s.active) continue;

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(254, 240, 138, ${s.opacity})`); // bright gold head
        gradient.addColorStop(0.3, `rgba(255, 255, 255, ${s.opacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.globalAlpha = s.opacity;
        ctx.stroke();

        // Move shooting star
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.018;

        if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
          s.active = false;
          shootingStars.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(meteorTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ background: '#08090d' }}
    />
  );
};
