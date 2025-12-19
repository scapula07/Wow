export interface CategoryData {
  id: string;
  name: string;
  description: string;
  image: string;
  streamCount?: number;
}

export const LIVESTREAM_CATEGORIES: CategoryData[] = [
  {
    id: "alien-abduction",
    name: "Alien Abduction",
    description: "In-depth discussions and first-person accounts of alleged abductions — examining psychological, medical, and investigative perspectives.",
    image: "/assets/images/ufo1.jpg",
    streamCount: 0,
  },
  {
    id: "common-alien-archetypes",
    name: "Common Alien Archetypes, Grey, Reptilian, Nordic, Mantid, and Anunnaki",
    description: "Comprehensive exploration of the most commonly reported alien species: Greys, Reptilians, Nordics, Mantids, and Anunnaki — examining their characteristics, encounters, and cultural significance.",
    image: "/assets/images/ufo2.jpg",
    streamCount: 0,
  },
  {
    id: "telepathic-communication",
    name: "Telepathic Communication",
    description: "Analysis of reported telepathic exchanges with non-human entities, including research on consciousness, remote communication, and psychic phenomena.",
    image: "/assets/images/ufo3.jpg",
    streamCount: 0,
  },
  {
    id: "government-disclosure",
    name: "Government Disclosure",
    description: "News, documents and expert analysis on official disclosures, declassified reports, and policy responses to unidentified phenomena.",
    image: "/assets/images/ufo4.jpg",
    streamCount: 0,
  },
  {
    id: "ufos-and-time-travel",
    name: "UFOs and Time Travel",
    description: "Speculative and evidence-based conversations linking unidentified phenomena with temporal anomalies, paradoxes, and time-based theories.",
    image: "/assets/images/ufo5.jpg",
    streamCount: 0,
  },
  {
    id: "ufo-crash-and-retrievals",
    name: "UFO Crash and Retrievals",
    description: "Historical investigations and contemporary claims about alleged crash incidents, wreckage recovery, reverse engineering programs, and government retrieval operations.",
    image: "/assets/images/ufo6.jpg",
    streamCount: 0,
  },
  {
    id: "dmt-and-entities",
    name: "DMT and Entities",
    description: "First-person reports and interdisciplinary research exploring DMT experiences and their overlap with encounter narratives and archetypal beings.",
    image: "/assets/images/ufo1.jpg",
    streamCount: 0,
  },
  {
    id: "bible-and-ufos",
    name: "Bible and UFOs",
    description: "Scholarly and community discussions on religious texts, theological interpretations, and possible connections to unidentified phenomena.",
    image: "/assets/images/ufo2.jpg",
    streamCount: 0,
  },
  {
    id: "human-travel-in-ufos",
    name: "Human Travel in UFOs",
    description: "Reports and investigations of humans allegedly traveling aboard extraterrestrial craft — examining abduction travel, voluntary journeys, and interstellar experiences.",
    image: "/assets/images/ufo3.jpg",
    streamCount: 0,
  },
  {
    id: "human-personal-ufo-crafts",
    name: "Human Personal UFO Crafts",
    description: "Exploration of claims regarding human-made UFO technology, personal anti-gravity devices, and reverse-engineered alien propulsion systems.",
    image: "/assets/images/ufo4.jpg",
    streamCount: 0,
  },
  {
    id: "ufo-energy-source-travel-mechanism-and-material",
    name: "UFO Energy Source, Travel Mechanism and UFO Material",
    description: "Technical analysis of reported UFO propulsion systems, exotic materials, zero-point energy theories, and advanced propulsion mechanisms.",
    image: "/assets/images/ufo5.jpg",
    streamCount: 0,
  },
  {
    id: "alien-human-hybrids",
    name: "Alien Human Hybrids",
    description: "Discussions on alleged hybridization programs, star children, genetic engineering claims, and the integration of human-alien genetics.",
    image: "/assets/images/ufo6.jpg",
    streamCount: 0,
  },
  {
    id: "alien-tech-and-human-disease-healing",
    name: "Alien Tech and Human Disease Healing",
    description: "Reports and research on advanced extraterrestrial medical technology, alleged healing experiences during encounters, and potential therapeutic applications.",
    image: "/assets/images/ufo1.jpg",
    streamCount: 0,
  },
  {
    id: "stopping-human-aging-with-alien-tech",
    name: "Stopping Human Aging With Alien Tech",
    description: "Speculative discussions on anti-aging technologies purportedly of alien origin, longevity research, and consciousness preservation methods.",
    image: "/assets/images/ufo2.jpg",
    streamCount: 0,
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
