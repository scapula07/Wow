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
    id: "grey-aliens",
    name: "Grey Aliens",
    description: "Focused coverage on the 'Grey' archetype: reported encounters, appearance descriptions, and cultural influence across media.",
    image: "/assets/images/ufo2.jpg",
    streamCount: 0,
  },
  {
    id: "reptilian-alien",
    name: "Reptilian Alien",
    description: "Explorations of reptilian-type entities in folklore and eyewitness reports, including origin theories and symbolic readings.",
    image: "/assets/images/ufo3.jpg",
    streamCount: 0,
  },
  {
    id: "nordic-alien",
    name: "Nordic Alien",
    description: "Accounts and analyses of humanoid 'Nordic' entities often described as benevolent — myth, testimony, and hypotheses.",
    image: "/assets/images/ufo4.jpg",
    streamCount: 0,
  },
  {
    id: "mantid-alien",
    name: "Mantid Alien",
    description: "Investigations into mantid/insectoid entities: encounter narratives, symbolic interpretations, and scientific speculation.",
    image: "/assets/images/ufo5.jpg",
    streamCount: 0,
  },
  {
    id: "government-disclosures",
    name: "Government Disclosures",
    description: "News, documents and expert analysis on official disclosures, declassified reports, and policy responses to unidentified phenomena.",
    image: "/assets/images/ufo6.jpg",
    streamCount: 0,
  },
  {
    id: "ufos-and-time-travel",
    name: "UFOs and Time Travel",
    description: "Speculative and evidence-based conversations linking unidentified phenomena with temporal anomalies, paradoxes, and time-based theories.",
    image: "/assets/images/ufo1.jpg",
    streamCount: 0,
  },
  {
    id: "ufo-crashes",
    name: "UFO Crashes",
    description: "Historical investigations and contemporary claims about alleged crash incidents, wreckage evidence, and follow-up research.",
    image: "/assets/images/ufo2.jpg",
    streamCount: 0,
  },
  {
    id: "dmt-and-entities",
    name: "DMT and Entities",
    description: "First-person reports and interdisciplinary research exploring DMT experiences and their overlap with encounter narratives and archetypal beings.",
    image: "/assets/images/ufo3.jpg",
    streamCount: 0,
  },
  {
    id: "bible-and-ufos",
    name: "Bible and UFOs",
    description: "Scholarly and community discussions on religious texts, theological interpretations, and possible connections to unidentified phenomena.",
    image: "/assets/images/ufo4.jpg",
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
