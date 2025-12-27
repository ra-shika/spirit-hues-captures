import { useEffect, useRef } from "react";
import { ChakraColor } from "@/lib/chakraColors";

interface AuraOverlayProps {
  photo: string;
  colors: ChakraColor[];
  onComplete: (auraPhoto: string) => void;
}

export function AuraOverlay({ photo, colors, onComplete }: AuraOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original photo
      ctx.drawImage(img, 0, 0);

      // Create ethereal aura overlay
      createAuraEffect(ctx, canvas.width, canvas.height, colors);

      // Export the result
      const auraPhoto = canvas.toDataURL("image/jpeg", 0.9);
      onComplete(auraPhoto);
    };

    img.src = photo;
  }, [photo, colors, onComplete]);

  return <canvas ref={canvasRef} className="hidden" />;
}

function createAuraEffect(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: ChakraColor[]
) {
  const centerX = width / 2;
  const centerY = height * 0.4; // Position higher for head/shoulders focus
  const maxRadius = Math.max(width, height) * 0.9;

  // Create the glowing aura ring effect like classic aura photography
  // Multiple concentric rings with colors bleeding into each other
  
  // First, add a soft overall color wash
  colors.forEach((color, index) => {
    const angle = (index / colors.length) * Math.PI * 2;
    const offsetX = Math.cos(angle) * (width * 0.2);
    const offsetY = Math.sin(angle) * (height * 0.15);

    const gradient = ctx.createRadialGradient(
      centerX + offsetX,
      centerY + offsetY,
      maxRadius * 0.2,
      centerX + offsetX,
      centerY + offsetY,
      maxRadius
    );

    gradient.addColorStop(0, `${color.hex}00`);
    gradient.addColorStop(0.2, `${color.hex}30`);
    gradient.addColorStop(0.4, `${color.hex}50`);
    gradient.addColorStop(0.6, `${color.hex}40`);
    gradient.addColorStop(0.8, `${color.hex}25`);
    gradient.addColorStop(1, `${color.hex}10`);

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });

  // Create distinct aura rings around the subject
  const ringCount = 5;
  for (let i = 0; i < ringCount; i++) {
    const ringRadius = maxRadius * (0.25 + i * 0.15);
    const colorIndex = i % colors.length;
    const color = colors[colorIndex];
    
    const ringGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      ringRadius - (maxRadius * 0.08),
      centerX,
      centerY,
      ringRadius + (maxRadius * 0.08)
    );

    ringGradient.addColorStop(0, `${color.hex}00`);
    ringGradient.addColorStop(0.3, `${color.hex}35`);
    ringGradient.addColorStop(0.5, `${color.hex}55`);
    ringGradient.addColorStop(0.7, `${color.hex}35`);
    ringGradient.addColorStop(1, `${color.hex}00`);

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = ringGradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Add intense glow at the edges (classic aura photo look)
  const edgeGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    maxRadius * 0.3,
    centerX,
    centerY,
    maxRadius * 1.1
  );

  const primaryColor = colors[0]?.hex || "#a855c9";
  const secondaryColor = colors[1]?.hex || colors[0]?.hex || "#22d3ee";
  
  edgeGradient.addColorStop(0, "transparent");
  edgeGradient.addColorStop(0.4, `${primaryColor}20`);
  edgeGradient.addColorStop(0.6, `${secondaryColor}40`);
  edgeGradient.addColorStop(0.8, `${primaryColor}60`);
  edgeGradient.addColorStop(1, `${secondaryColor}80`);

  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = edgeGradient;
  ctx.fillRect(0, 0, width, height);

  // Add top glow (crown chakra area)
  const crownGradient = ctx.createRadialGradient(
    centerX,
    height * 0.1,
    0,
    centerX,
    height * 0.1,
    maxRadius * 0.6
  );

  const crownColor = colors[colors.length - 1]?.hex || primaryColor;
  crownGradient.addColorStop(0, `${crownColor}50`);
  crownGradient.addColorStop(0.3, `${crownColor}35`);
  crownGradient.addColorStop(0.6, `${crownColor}15`);
  crownGradient.addColorStop(1, `${crownColor}00`);

  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = crownGradient;
  ctx.fillRect(0, 0, width, height);

  // Add side glows for depth
  [-1, 1].forEach((side, sideIndex) => {
    const sideGradient = ctx.createRadialGradient(
      centerX + (side * width * 0.4),
      centerY,
      0,
      centerX + (side * width * 0.4),
      centerY,
      maxRadius * 0.7
    );

    const sideColor = colors[sideIndex % colors.length]?.hex || primaryColor;
    sideGradient.addColorStop(0, `${sideColor}60`);
    sideGradient.addColorStop(0.2, `${sideColor}45`);
    sideGradient.addColorStop(0.5, `${sideColor}25`);
    sideGradient.addColorStop(1, `${sideColor}00`);

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = sideGradient;
    ctx.fillRect(0, 0, width, height);
  });

  // Subtle vignette to focus attention
  const vignetteGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    maxRadius * 0.4,
    centerX,
    centerY,
    maxRadius * 1.3
  );

  vignetteGradient.addColorStop(0, "transparent");
  vignetteGradient.addColorStop(0.8, "rgba(0, 0, 0, 0.05)");
  vignetteGradient.addColorStop(1, "rgba(0, 0, 0, 0.15)");

  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, width, height);

  // Reset composite operation
  ctx.globalCompositeOperation = "source-over";
}

export default AuraOverlay;
