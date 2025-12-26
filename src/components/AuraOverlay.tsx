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
  const centerY = height / 2;
  const maxRadius = Math.max(width, height) * 0.8;

  // Create multiple layered gradients for ethereal effect
  colors.forEach((color, index) => {
    const offsetX = (index - colors.length / 2) * (width * 0.15);
    const offsetY = (index % 2 === 0 ? -1 : 1) * (height * 0.1);

    // Outer glow
    const gradient = ctx.createRadialGradient(
      centerX + offsetX,
      centerY + offsetY,
      0,
      centerX + offsetX,
      centerY + offsetY,
      maxRadius
    );

    gradient.addColorStop(0, `${color.hex}00`);
    gradient.addColorStop(0.3, `${color.hex}15`);
    gradient.addColorStop(0.5, `${color.hex}25`);
    gradient.addColorStop(0.7, `${color.hex}20`);
    gradient.addColorStop(1, `${color.hex}00`);

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  });

  // Add edge glow effect
  const edgeGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    maxRadius * 0.4,
    centerX,
    centerY,
    maxRadius
  );

  const primaryColor = colors[0]?.hex || "#a855c9";
  edgeGradient.addColorStop(0, "transparent");
  edgeGradient.addColorStop(0.6, `${primaryColor}10`);
  edgeGradient.addColorStop(0.8, `${primaryColor}30`);
  edgeGradient.addColorStop(1, `${primaryColor}50`);

  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = edgeGradient;
  ctx.fillRect(0, 0, width, height);

  // Add subtle vignette
  const vignetteGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    maxRadius * 0.3,
    centerX,
    centerY,
    maxRadius * 1.2
  );

  vignetteGradient.addColorStop(0, "transparent");
  vignetteGradient.addColorStop(0.7, "rgba(0, 0, 0, 0.05)");
  vignetteGradient.addColorStop(1, "rgba(0, 0, 0, 0.25)");

  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, width, height);

  // Reset composite operation
  ctx.globalCompositeOperation = "source-over";
}

export default AuraOverlay;
