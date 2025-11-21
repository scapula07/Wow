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
  ,
  {
    id: "alien-abduction",
    name: "Alien Abduction",
    description: "First-person accounts and investigations into alleged abduction experiences — medical, psychological, and cultural perspectives.",
    image: "/assets/images/ufo1.jpg",
    streamCount: 0
  },
  {
    id: "grey-aliens",
    name: "Grey Aliens",
    description: "Discussions focused on the iconic 'Grey' archetype: reported encounters, biology theories, and cultural impact.",
    image: "/assets/images/ufo2.jpg",
    streamCount: 0
  },
  {
    id: "reptilian-aliens",
    name: "Reptilian Alien",
    description: "Explorations of reptilian-type entities in folklore, conspiracy narratives, and eyewitness reports.",
    image: "/assets/images/ufo3.jpg",
    streamCount: 0
  },
  {
    id: "nordic-aliens",
    name: "Nordic Alien",
    description: "Accounts and theories about 'Nordic' or humanoid extraterrestrials often described as benevolent and human-like.",
    image: "/assets/images/ufo4.jpg",
    streamCount: 0
  },
  {
    id: "mantid-aliens",
    name: "Mantid Alien",
    description: "Investigations into mantid or insectoid entities: reported encounters, symbolism, and hypotheses.",
    image: "/assets/images/ufo5.jpg",
    streamCount: 0
  },
  {
    id: "government-disclosures",
    name: "Government Disclosures",
    description: "News, leaks and official statements about UFOs and government investigations — transparency and policy discussions.",
    image: "/assets/images/ufo6.jpg",
    streamCount: 0
  },
  {
    id: "ufos-time-travel",
    name: "UFOs & Time Travel",
    description: "Speculative and evidence-led conversations connecting unidentified phenomena with time anomalies and temporal theories.",
    image: "/assets/images/ufo1.jpg",
    streamCount: 0
  },
  {
    id: "ufo-crashes",
    name: "UFO Crashes",
    description: "Historical and contemporary discussions about alleged crash incidents, wreckage claims, and investigative follow-ups.",
    image: "/assets/images/ufo2.jpg",
    streamCount: 0
  },
  {
    id: "dmt-entities",
    name: "DMT & Entities",
    description: "First-person reports and research linking DMT experiences to encounter narratives and archetypal entities.",
    image: "/assets/images/ufo3.jpg",
    streamCount: 0
  },
  {
    id: "bible-and-ufos",
    name: "Bible & UFOs",
    description: "Exploring interpretations of religious texts in light of UFO/encounter claims and theological perspectives.",
    image: "/assets/images/ufo4.jpg",
    streamCount: 0
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
