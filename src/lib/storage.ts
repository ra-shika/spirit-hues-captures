import { ChakraColor } from "./chakraColors";

export interface AuraPhoto {
  id: string;
  timestamp: string;
  photo: string; // base64 compressed
  auraPhoto: string; // base64 with overlay
  dominantColors: ChakraColor[];
  reading: string;
}

const STORAGE_KEY = "aura_gallery";
const MAX_PHOTOS = 30;
const WARNING_THRESHOLD = 15;

export function generateId(): string {
  return `aura_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getGallery(): AuraPhoto[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveToGallery(photo: AuraPhoto): { success: boolean; warning?: string } {
  const gallery = getGallery();
  
  if (gallery.length >= MAX_PHOTOS) {
    return { 
      success: false, 
      warning: `Gallery is full (${MAX_PHOTOS} photos max). Please delete some photos to save new ones.` 
    };
  }
  
  gallery.unshift(photo); // Add to beginning (newest first)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
  
  if (gallery.length >= WARNING_THRESHOLD) {
    return { 
      success: true, 
      warning: `You have ${gallery.length} of ${MAX_PHOTOS} photos saved.` 
    };
  }
  
  return { success: true };
}

export function deleteFromGallery(id: string): boolean {
  const gallery = getGallery();
  const filtered = gallery.filter(p => p.id !== id);
  
  if (filtered.length === gallery.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getPhotoById(id: string): AuraPhoto | undefined {
  const gallery = getGallery();
  return gallery.find(p => p.id === id);
}

export function clearGallery(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStorageInfo(): { used: number; total: number; photoCount: number } {
  const gallery = getGallery();
  const dataSize = new Blob([JSON.stringify(gallery)]).size;
  
  return {
    used: dataSize,
    total: 5 * 1024 * 1024, // Approximate 5MB limit
    photoCount: gallery.length,
  };
}

// Compress image to reduce storage size
export function compressImage(dataUrl: string, quality: number = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 800;
      
      let { width, height } = img;
      
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
