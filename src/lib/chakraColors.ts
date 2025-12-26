export interface ChakraColor {
  name: string;
  chakra: string;
  hsl: string;
  hex: string;
  traits: string[];
  element: string;
  keywords: string[];
}

export const chakraColors: ChakraColor[] = [
  {
    name: "Red",
    chakra: "Root",
    hsl: "hsl(0, 85%, 60%)",
    hex: "#eb4d4d",
    traits: ["grounded", "passionate", "energetic", "vital", "courageous"],
    element: "Earth",
    keywords: ["survival", "stability", "physical energy", "primal force"],
  },
  {
    name: "Orange",
    chakra: "Sacral",
    hsl: "hsl(25, 95%, 55%)",
    hex: "#f57c1f",
    traits: ["creative", "emotional", "sensual", "adventurous", "spontaneous"],
    element: "Water",
    keywords: ["creativity", "pleasure", "emotions", "flow"],
  },
  {
    name: "Yellow",
    chakra: "Solar Plexus",
    hsl: "hsl(45, 95%, 55%)",
    hex: "#f5c91f",
    traits: ["confident", "optimistic", "powerful", "intellectual", "self-assured"],
    element: "Fire",
    keywords: ["personal power", "will", "confidence", "transformation"],
  },
  {
    name: "Green",
    chakra: "Heart",
    hsl: "hsl(140, 60%, 45%)",
    hex: "#2eb872",
    traits: ["loving", "compassionate", "healing", "balanced", "nurturing"],
    element: "Air",
    keywords: ["love", "compassion", "harmony", "connection"],
  },
  {
    name: "Blue",
    chakra: "Throat",
    hsl: "hsl(200, 80%, 55%)",
    hex: "#2da3e0",
    traits: ["communicative", "truthful", "expressive", "calm", "authentic"],
    element: "Sound",
    keywords: ["communication", "truth", "expression", "clarity"],
  },
  {
    name: "Indigo",
    chakra: "Third Eye",
    hsl: "hsl(240, 60%, 55%)",
    hex: "#4747c2",
    traits: ["intuitive", "wise", "perceptive", "spiritual", "insightful"],
    element: "Light",
    keywords: ["intuition", "wisdom", "perception", "inner vision"],
  },
  {
    name: "Violet",
    chakra: "Crown",
    hsl: "hsl(280, 70%, 60%)",
    hex: "#a855c9",
    traits: ["enlightened", "connected", "transcendent", "imaginative", "divine"],
    element: "Thought",
    keywords: ["spirituality", "consciousness", "unity", "bliss"],
  },
];

export function getChakraByName(name: string): ChakraColor | undefined {
  return chakraColors.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getRandomChakras(count: number = 2): ChakraColor[] {
  const shuffled = [...chakraColors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
