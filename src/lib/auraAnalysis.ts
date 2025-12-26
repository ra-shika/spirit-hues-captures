import { chakraColors, ChakraColor } from "./chakraColors";

export interface AuraAnalysis {
  dominantColors: ChakraColor[];
  reading: string;
  timestamp: Date;
}

// Analyze image and extract dominant colors mapped to chakras
export async function analyzeAura(imageDataUrl: string): Promise<AuraAnalysis> {
  // Create canvas to analyze image
  const img = new Image();
  img.crossOrigin = "anonymous";
  
  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        // Fallback to random if canvas fails
        resolve(generateRandomAura(imageDataUrl));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Sample colors from the image (center region for face)
      const centerX = Math.floor(img.width / 2);
      const centerY = Math.floor(img.height / 2);
      const sampleSize = Math.min(img.width, img.height) / 3;
      
      const imgData = ctx.getImageData(
        centerX - sampleSize / 2,
        centerY - sampleSize / 2,
        sampleSize,
        sampleSize
      );
      
      const colors = extractDominantColors(imgData.data);
      const dominantColors = mapToChakraColors(colors);
      const reading = generateReading(dominantColors);
      
      resolve({
        dominantColors,
        reading,
        timestamp: new Date(),
      });
    };
    
    img.onerror = () => {
      resolve(generateRandomAura(imageDataUrl));
    };
    
    img.src = imageDataUrl;
  });
}

function extractDominantColors(data: Uint8ClampedArray): { r: number; g: number; b: number }[] {
  const colorBuckets: Map<string, { r: number; g: number; b: number; count: number }> = new Map();
  
  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Bucket colors to reduce variety
    const bucketR = Math.floor(r / 32) * 32;
    const bucketG = Math.floor(g / 32) * 32;
    const bucketB = Math.floor(b / 32) * 32;
    const key = `${bucketR}-${bucketG}-${bucketB}`;
    
    if (colorBuckets.has(key)) {
      colorBuckets.get(key)!.count++;
    } else {
      colorBuckets.set(key, { r: bucketR, g: bucketG, b: bucketB, count: 1 });
    }
  }
  
  // Sort by count and get top colors
  const sortedColors = Array.from(colorBuckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return sortedColors.map(({ r, g, b }) => ({ r, g, b }));
}

function mapToChakraColors(colors: { r: number; g: number; b: number }[]): ChakraColor[] {
  // Use a hash of the colors to deterministically select chakras
  const hash = colors.reduce((acc, c) => acc + c.r + c.g * 2 + c.b * 3, 0);
  
  // Select 2-3 chakra colors based on the hash
  const numColors = 2 + (hash % 2); // 2 or 3 colors
  const selectedIndices: number[] = [];
  
  for (let i = 0; i < numColors; i++) {
    let index = (hash + i * 17) % chakraColors.length;
    while (selectedIndices.includes(index)) {
      index = (index + 1) % chakraColors.length;
    }
    selectedIndices.push(index);
  }
  
  return selectedIndices.map(i => chakraColors[i]);
}

function generateRandomAura(imageData: string): AuraAnalysis {
  // Use image data string to seed randomness for consistency
  const seed = imageData.length + imageData.charCodeAt(100) + imageData.charCodeAt(200);
  const index1 = seed % chakraColors.length;
  const index2 = (seed * 7) % chakraColors.length;
  
  const dominantColors = [
    chakraColors[index1],
    chakraColors[index2 === index1 ? (index2 + 1) % chakraColors.length : index2],
  ];
  
  return {
    dominantColors,
    reading: generateReading(dominantColors),
    timestamp: new Date(),
  };
}

const readingTemplates = {
  single: [
    "Your aura radiates pure {color} energy, signaling deep {trait1} within you. The {chakra} chakra is strongly activated, drawing {keyword1} into your life.",
    "A beautiful {color} light surrounds you, reflecting your {trait1} nature. Your {chakra} chakra speaks of {keyword1} and {keyword2}.",
    "The {color} glow of your {chakra} chakra reveals a soul that is {trait1} and {trait2}. Trust in your natural gift for {keyword1}.",
  ],
  dual: [
    "Your aura dances between {color1} and {color2}, creating a mesmerizing harmony. The {trait1} energy of your {chakra1} chakra blends beautifully with the {trait2} essence of your {chakra2}.",
    "A stunning blend of {color1} and {color2} surrounds you, revealing both {trait1} and {trait2} aspects of your being. Your {chakra1} and {chakra2} chakras are working in beautiful alignment.",
    "The interplay of {color1} and {color2} in your aura tells a story of {keyword1} meeting {keyword2}. You carry both {trait1} wisdom and {trait2} grace.",
  ],
  triple: [
    "Your aura pulses with the magnificent trinity of {color1}, {color2}, and {color3}. This rare combination speaks to a soul that is {trait1}, {trait2}, and {trait3}.",
    "Three powerful energies converge in your field: the {color1} of {keyword1}, the {color2} of {keyword2}, and the {color3} of {keyword3}. You are a multifaceted being of light.",
  ],
};

export function generateReading(colors: ChakraColor[]): string {
  if (colors.length === 1) {
    const templates = readingTemplates.single;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const color = colors[0];
    
    return template
      .replace("{color}", color.name.toLowerCase())
      .replace("{chakra}", color.chakra)
      .replace("{trait1}", color.traits[0])
      .replace("{trait2}", color.traits[1])
      .replace("{keyword1}", color.keywords[0])
      .replace("{keyword2}", color.keywords[1]);
  } else if (colors.length === 2) {
    const templates = readingTemplates.dual;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return template
      .replace("{color1}", colors[0].name.toLowerCase())
      .replace("{color2}", colors[1].name.toLowerCase())
      .replace("{chakra1}", colors[0].chakra)
      .replace("{chakra2}", colors[1].chakra)
      .replace("{trait1}", colors[0].traits[0])
      .replace("{trait2}", colors[1].traits[0])
      .replace("{keyword1}", colors[0].keywords[0])
      .replace("{keyword2}", colors[1].keywords[0]);
  } else {
    const templates = readingTemplates.triple;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return template
      .replace("{color1}", colors[0].name.toLowerCase())
      .replace("{color2}", colors[1].name.toLowerCase())
      .replace("{color3}", colors[2].name.toLowerCase())
      .replace("{trait1}", colors[0].traits[0])
      .replace("{trait2}", colors[1].traits[0])
      .replace("{trait3}", colors[2].traits[0])
      .replace("{keyword1}", colors[0].keywords[0])
      .replace("{keyword2}", colors[1].keywords[0])
      .replace("{keyword3}", colors[2].keywords[0]);
  }
}
