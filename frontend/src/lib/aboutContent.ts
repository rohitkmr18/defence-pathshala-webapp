// ─────────────────────────────────────────────────────────────────────────────
// Defence Pathshala — About Page Content Configuration (aboutContent.ts)
// Modular content architecture designed for direct swapping with Notion API later.
// ─────────────────────────────────────────────────────────────────────────────

export interface FeatureCardItem {
  id: string;
  title: string;
  metric?: string;
  description: string;
  badge?: string;
  iconName: string;
}

export interface RoadmapPhase {
  phase: string;
  name: string;
  status: "completed" | "current" | "upcoming";
  timeline: string;
  highlights: string[];
}

export interface AboutPageData {
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    description: string;
    ctaPrimary: {
      text: string;
      href: string;
    };
    ctaSecondary: {
      text: string;
      href: string;
    };
  };
  mission: {
    label: string;
    heading: string;
    statement: string;
    bulletPoints: string[];
  };
  vision: {
    label: string;
    heading: string;
    statement: string;
    bulletPoints: string[];
  };
  whyDifferent: {
    heading: string;
    subtitle: string;
    features: FeatureCardItem[];
  };
  founder: {
    name: string;
    title: string;
    credentials: string[];
    bio: string;
    quote: string;
    image?: string;
    avatarPlaceholder?: string;
    socials?: {
      linkedin?: string;
      twitter?: string;
    };
  };
  roadmap: {
    heading: string;
    subtitle: string;
    phases: RoadmapPhase[];
  };
  feedback: {
    heading: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
  };
}

export const FEEDBACK_FORM_URL = "https://forms.gle/Qo56WFCq8uMPGdF89";

export const defaultAboutContent: AboutPageData = {
  hero: {
    tagline: "Defence Pathshala",
    title: "Strategic Intelligence Meets Disciplined Preparation",
    subtitle: "Built by officers, powered by data, focused on your commission.",
    description:
      "A next-generation platform engineered to decode UPSC defence examinations (CDS, CAPF AC, NDA, AFCAT) through deep statistical analytics, question taxonomy, and authentic daily strategic intelligence.",
    ctaPrimary: {
      text: "Explore PYQ Insights",
      href: "/dashboard/question-bank",
    },
    ctaSecondary: {
      text: "Help Us Build Better",
      href: FEEDBACK_FORM_URL,
    },
  },

  mission: {
    label: "Our Mission",
    heading: "Precision Over Guesswork",
    statement:
      "Transform defence exam preparation from guesswork into data-driven learning.",
    bulletPoints: [
      "Eliminate random mock tests with exam-accurate scoring and negative marking algorithms.",
      "Diagnose precise avoidable mark leaks in Easy and Moderate foundational questions.",
      "Deliver daily exam-relevant defence and geopolitical briefings in visual bite-sized formats.",
    ],
  },

  vision: {
    label: "Our Vision",
    heading: "India's Definitive Defence Academy",
    statement:
      "Become India's most trusted AI-powered defence preparation platform.",
    bulletPoints: [
      "Empower every aspirant across Bharat with premier military and strategic intelligence.",
      "Bridge the gap between raw effort and officer cutoff clearance through analytical discipline.",
      "Democratize high-yield mentorship with authentic insights from commissioned officers.",
    ],
  },

  whyDifferent: {
    heading: "Why Defence Pathshala is Different",
    subtitle: "Every feature is engineered specifically for defence service aspirants, not generic exam coaching.",
    features: [
      {
        id: "pyq-analysed",
        title: "730+ PYQs Analysed",
        metric: "730+ Verified",
        description:
          "Every single past question categorized across subject, topic, subtopic, pattern, and examiner traps with verified keys.",
        badge: "Deep Taxonomy",
        iconName: "Database",
      },
      {
        id: "ai-insights",
        title: "AI-Powered Insights",
        metric: "Instant Debrief",
        description:
          "Algorithmic post-submission debriefs identifying recoverable marks, topic-level weakness heatmaps, and next best moves.",
        badge: "Post-Mock AI",
        iconName: "Sparkles",
      },
      {
        id: "current-affairs",
        title: "Daily Current Affairs",
        metric: "Visual Carousel",
        description:
          "Curated 7–9 slide daily briefings covering defence exercises, national security doctrines, geopolitics, and science & tech.",
        badge: "Exam Focused",
        iconName: "Newspaper",
      },
      {
        id: "targeted-practice",
        title: "Targeted Practice",
        metric: "Dynamic Generator",
        description:
          "Custom filter drills and real-time timed full paper simulations mirroring authentic UPSC CDS & CAPF AC difficulty ratios.",
        badge: "Exam Simulation",
        iconName: "Target",
      },
    ],
  },

  founder: {
    name: "Rohit Kumar",
    title: "Founder, Defence Pathshala",
    credentials: [
      "IIT Kanpur",
      "BSF Assistant Commandant",
      "CAPF AC AIR 163",
      "Founder of Defence Pathshala",
    ],
    bio: "After securing All India Rank 163 in UPSC CAPF AC and serving as a BSF Assistant Commandant after graduating from IIT Kanpur, Rohit combines operational experience with exam-first thinking. He didn't stop at understanding what works—he analyzed hundreds of previous year questions, identified recurring exam patterns, and built Defence Pathshala himself using AI, data analytics, and automation to turn that intelligence into a practical learning platform.",
    quote:
      "UPSC Defence exams don't test memory; they test composure, foundational clarity, and disciplined elimination under time pressure. Defence Pathshala was built to give every aspirant that exact edge.",
    image: "/images/rohit-kumar.jpg",
  },

  roadmap: {
    heading: "Product Roadmap",
    subtitle: "From raw PYQ indexing to an intelligent real-time defence mentorship ecosystem.",
    phases: [
      {
        phase: "Phase 1",
        name: "PYQ Intelligence Engine",
        status: "completed",
        timeline: "Completed",
        highlights: [
          "730+ PYQs digitized with 29-column taxonomy",
          "Subject, topic, difficulty, and theme categorization",
          "Searchable question bank and student onboarding flow",
        ],
      },
      {
        phase: "Phase 2",
        name: "Targeted Practice & AI Post-Mock Debrief",
        status: "completed",
        timeline: "Completed",
        highlights: [
          "Interactive question player with instant and test modes",
          "Full paper mock simulator with official CDS & CAPF scoring",
          "AI debrief: recoverable marks, topic heatmaps & inline review",
        ],
      },
      {
        phase: "Phase 3",
        name: "Daily Current Affairs & Navigation Upgrade",
        status: "current",
        timeline: "Active Release",
        highlights: [
          "Daily visual slide carousel for high-yield defence affairs",
          "Newest-first chronological archive with swipeable slide viewer",
          "Unified dashboard integration and streamlined navigation",
        ],
      },
      {
        phase: "Phase 4",
        name: "Adaptive AI Mentor & Full-Length Test Series",
        status: "upcoming",
        timeline: "Upcoming",
        highlights: [
          "Personalized daily revision plans targeting weak areas",
          "All-India live mock tests with percentile ranking",
          "Direct officer mentorship & interview guidance integration",
        ],
      },
    ],
  },

  feedback: {
    heading: "Help Us Build Better",
    description:
      "Your feedback directly shapes Defence Pathshala. Report bugs, suggest features, or tell us what slowed your preparation down.",
    ctaText: "Open Feedback Form",
    ctaUrl: "https://forms.gle/EQ62ZwEaZbBRLtFh6",
  },
};

/**
 * Fetch about content. Currently reads defaultAboutContent.
 * In the future, this function can directly query the Notion API
 * using NOTION_API_KEY and NOTION_DATABASE_ID.
 */
export async function getAboutContent(): Promise<AboutPageData> {
  // Notion API integration hook point:
  // if (process.env.NOTION_API_KEY) { return fetchFromNotion(); }
  return defaultAboutContent;
}
