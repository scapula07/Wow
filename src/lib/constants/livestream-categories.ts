export interface CategoryData {
  id: string;
  name: string;
  description: string;
  image: string;
  streamCount?: number;
}

export const LIVESTREAM_CATEGORIES: CategoryData[] = [
  {
    id: "space-theory",
    name: "Space Theory & Cosmic Mysteries",
    description: "Explore the unknown depths of space and cosmic phenomena",
    image: "/assets/images/ufo1.jpg",
    streamCount: 125
  },
  {
    id: "live-watch",
    name: "Live Watch & Analysis",
    description: "Real-time observation and expert commentary",
    image: "/assets/images/ufo2.jpg",
    streamCount: 83
  },
  {
    id: "ancient-aliens",
    name: "History & Ancient Aliens",
    description: "Uncover ancient mysteries and extraterrestrial connections",
    image: "/assets/images/ufo3.jpg",
    streamCount: 152
  },
  {
    id: "alien-encounters",
    name: "Aliens & Encounters",
    description: "First contact stories and close encounters",
    image: "/assets/images/ufo4.jpg",
    streamCount: 98
  },
  {
    id: "ufo-sightings",
    name: "UFO Sightings & Evidence",
    description: "Latest sightings, footage analysis, and investigations",
    image: "/assets/images/ufo5.jpg",
    streamCount: 114
  },
  {
    id: "paranormal",
    name: "Paranormal Phenomena",
    description: "Unexplained events and supernatural investigations",
    image: "/assets/images/ufo6.jpg",
    streamCount: 76
  },
  {
    id: "conspiracy",
    name: "Conspiracy Theories",
    description: "Deep dives into cover-ups and hidden truths",
    image: "/assets/images/ufo1.jpg",
    streamCount: 139
  },
  {
    id: "astrobiology",
    name: "Astrobiology & Life Beyond",
    description: "The search for life in the universe",
    image: "/assets/images/ufo2.jpg",
    streamCount: 62
  },
  {
    id: "nasa-space",
    name: "NASA & Space Exploration",
    description: "Official missions, launches, and space discoveries",
    image: "/assets/images/ufo3.jpg",
    streamCount: 187
  },
  {
    id: "sci-fi-analysis",
    name: "Sci-Fi Analysis & Theories",
    description: "Breaking down science fiction and future possibilities",
    image: "/assets/images/ufo4.jpg",
    streamCount: 54
  },
  {
    id: "cryptozoology",
    name: "Cryptozoology & Unknown Creatures",
    description: "Searching for legendary and undiscovered beings",
    image: "/assets/images/ufo5.jpg",
    streamCount: 48
  },
  {
    id: "quantum-physics",
    name: "Quantum Physics & Dimensions",
    description: "Mind-bending theories about reality and the multiverse",
    image: "/assets/images/ufo6.jpg",
    streamCount: 71
  }
];

// Helper function to get category by ID
export const getCategoryById = (id: string): CategoryData | undefined => {
  return LIVESTREAM_CATEGORIES.find(cat => cat.id === id);
};

// Helper function to get categories by stream count
export const getTopCategories = (limit: number = 10): CategoryData[] => {
  return [...LIVESTREAM_CATEGORIES]
    .sort((a, b) => (b.streamCount || 0) - (a.streamCount || 0))
    .slice(0, limit);
};
