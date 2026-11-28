// ─────────────────────────────────────────────────────────────────────────────
// CAPF (AC) Paper II — Q1 (essay) and Q2 (arguments for and against) archive.
//
// Source: the official UPSC question papers, "General Studies, Essay and
// Comprehension", Central Armed Police Forces (ACs) Examination 2020–2026,
// published under Previous Exam Details on upsc.gov.in. Wording is kept exactly
// as printed (including UPSC's own punctuation and spacing such as "A boon or a
// bane ?"). Q1 is printed in Hindi and English; Q2 is printed in English only.
//
// This is a static, read-only archive. It is deliberately NOT wired into the
// exam registry's MCQ practice, mocks or scoring: `capf-p2` stays
// `coming_soon` there because Paper II is descriptive and cannot be auto-scored.
//
// `theme` is a Defence Pathshala classification, not part of the UPSC paper.
// ─────────────────────────────────────────────────────────────────────────────

export const CAPF_P2_SOURCE_URL = "https://upsc.gov.in/previous-exam-details/";
export const CAPF_P2_PATH = "/pyqs/capf/paper-2";

export type CapfP2Theme =
  | "Internal & national security"
  | "Defence & armed forces"
  | "Polity & governance"
  | "Society & gender"
  | "Economy & development"
  | "Science, technology & digital"
  | "Environment & climate"
  | "International relations"
  | "History & culture"
  | "Education & youth"
  | "Ethics & philosophy";

export interface CapfP2Item {
  /** Part label as printed, e.g. "a". */
  part: string;
  en: string;
  /** Hindi version as printed (Q1 only). */
  hi?: string;
  theme: CapfP2Theme;
}

export interface CapfP2Question {
  number: 1 | 2;
  kind: "essay" | "argument";
  directionEn: string;
  directionHi?: string;
  /** Marks as printed, e.g. "20×4=80". */
  marks: string;
  totalMarks: number;
  /** Word limit stated by UPSC for this question, or null when the paper states none. */
  wordLimit: number | null;
  /** How many parts the candidate must attempt. */
  attempt: number;
  items: CapfP2Item[];
}

export interface CapfP2Year {
  year: number;
  q1: CapfP2Question;
  q2: CapfP2Question;
}

const Q1_DIRECTION_EN = "Write essays on any four of the following in about 300 words each :";
const Q1_DIRECTION_HI = "निम्नलिखित में से किन्हीं चार पर लगभग 300 शब्दों (प्रत्येक) में निबंध लिखिए :";
const Q2_DIRECTION_EN = "Write arguments for and against each of the following statements :";

function q1(items: CapfP2Item[]): CapfP2Question {
  return {
    number: 1, kind: "essay", directionEn: Q1_DIRECTION_EN, directionHi: Q1_DIRECTION_HI,
    marks: "20×4=80", totalMarks: 80, wordLimit: 300, attempt: 4, items,
  };
}

function q2(items: CapfP2Item[]): CapfP2Question {
  return {
    number: 2, kind: "argument", directionEn: Q2_DIRECTION_EN,
    marks: "20×2=40", totalMarks: 40, wordLimit: null, attempt: 2, items,
  };
}

/** Newest year first. */
export const CAPF_P2_YEARS: CapfP2Year[] = [
  {
    year: 2026,
    q1: q1([
      { part: "a", en: "Urbanisation and the rise of mega-cities in India", hi: "भारत में शहरीकरण और बड़े शहरों का उदय", theme: "Economy & development" },
      { part: "b", en: "The role of Civil Society in strengthening democracy", hi: "लोकतंत्र को मजबूत करने में नागरिक समाज की भूमिका", theme: "Polity & governance" },
      { part: "c", en: "Gender justice and legal reforms in India", hi: "भारत में लैंगिक न्याय और कानूनी सुधार", theme: "Society & gender" },
      { part: "d", en: "Role of startups and entrepreneurship in fostering economy", hi: "अर्थव्यवस्था को बढ़ावा देने में स्टार्टअप और उद्यमिता की भूमिका", theme: "Economy & development" },
      { part: "e", en: "Reviewing India’s defence strategy in the light of evolving external threat", hi: "बाहरी खतरों के बदलते परिवेश के आलोक में भारत की रणनीति की समीक्षा", theme: "Defence & armed forces" },
      { part: "f", en: "India’s maritime strategy and growing importance in the Indian Ocean World", hi: "भारत की समुद्री रणनीति और हिंद महासागर क्षेत्र में बढ़ता महत्व", theme: "International relations" },
    ]),
    q2: q2([
      { part: "a", en: "The concept of work-life balance is a myth.", theme: "Society & gender" },
      { part: "b", en: "Gene editing is a threat to human identity.", theme: "Science, technology & digital" },
    ]),
  },
  {
    year: 2025,
    q1: q1([
      { part: "a", en: "Importance of Cyber Security in the world of digital information", hi: "डिजिटल सूचना की दुनिया में साइबर सुरक्षा का महत्व", theme: "Internal & national security" },
      { part: "b", en: "Cultural diplomacy and world peace", hi: "सांस्कृतिक कूटनीति और विश्व शान्ति", theme: "International relations" },
      { part: "c", en: "Impact of climate change on Indian agriculture", hi: "भारतीय कृषि पर जलवायु परिवर्तन का प्रभाव", theme: "Environment & climate" },
      { part: "d", en: "Women’s health : A journey of resilience and empowerment", hi: "महिला स्वास्थ्य : दृढ़ता और सशक्तिकरण की यात्रा", theme: "Society & gender" },
      { part: "e", en: "A thing of beauty is a joy forever", hi: "सौन्दर्य सदा आनन्ददायक होता है", theme: "Ethics & philosophy" },
      { part: "f", en: "Cryptocurrency : A threat to world trade", hi: "क्रिप्टोकरेन्सी : विश्व व्यापार के लिए एक खतरा", theme: "Economy & development" },
    ]),
    q2: q2([
      { part: "a", en: "A nuclear weapon is a deterrent to warfare", theme: "Defence & armed forces" },
      { part: "b", en: "The use of artificial intelligence is unavoidable today", theme: "Science, technology & digital" },
    ]),
  },
  {
    year: 2024,
    q1: q1([
      { part: "a", en: "Digital economy : Opportunities and challenges", hi: "डिजिटल अर्थव्यवस्था : अवसर एवं चुनौतियाँ", theme: "Economy & development" },
      { part: "b", en: "Global peace and national defence budget", hi: "विश्व शान्ति एवं राष्ट्रीय रक्षा बजट", theme: "Defence & armed forces" },
      { part: "c", en: "Tribal resistance to colonial rule", hi: "औपनिवेशिक शासन के विरुद्ध जनजातीय विद्रोह", theme: "History & culture" },
      { part: "d", en: "Importance of tropical rain forest", hi: "उष्णकटिबन्धीय वर्षावन का महत्त्व", theme: "Environment & climate" },
      { part: "e", en: "English in India : Deviance or variance", hi: "भारत में अंग्रेज़ी : व्यतिक्रम अथवा भिन्नता", theme: "Education & youth" },
      { part: "f", en: "Tribal cultures in the age of globalization", hi: "भूमण्डलीकरण के कालखण्ड में जनजातीय संस्कृति", theme: "History & culture" },
    ]),
    q2: q2([
      { part: "a", en: "Classical literature should be a component of the curriculum.", theme: "Education & youth" },
      { part: "b", en: "Housework is unpaid labour.", theme: "Society & gender" },
    ]),
  },
  {
    year: 2023,
    q1: q1([
      { part: "a", en: "Cyber attacks – a new kind of warfare", hi: "साइबर हमला – एक नया प्रकार का युद्ध", theme: "Internal & national security" },
      { part: "b", en: "India as an emerging leader in the new world order", hi: "नई विश्व व्यवस्था में भारत का उभरता नेतृत्व", theme: "International relations" },
      { part: "c", en: "The Indian diaspora and its contribution to post independent India", hi: "आज़ाद भारत में प्रवासी भारतीयों का योगदान", theme: "International relations" },
      { part: "d", en: "Education and awareness are the critical pillars for the success of a democracy", hi: "शिक्षा व जागरूकता प्रजातंत्र की सफलता के मुख्य स्तंभ हैं", theme: "Polity & governance" },
      { part: "e", en: "E waste : the dark side of the digital revolution", hi: "इलेक्ट्रॉनिक कचरा डिजिटल क्रांति का एक अंधेरा पक्ष है", theme: "Environment & climate" },
      { part: "f", en: "The geographical and linguistic diversity of India is its real wealth", hi: "भौगोलिक एवं भाषाई विविधता भारत की वास्तविक संपत्ति है", theme: "History & culture" },
    ]),
    q2: q2([
      { part: "a", en: "Genetically modified crops are essential for food sufficiency.", theme: "Science, technology & digital" },
      { part: "b", en: "Capital punishment is a deterrent for heinous crimes.", theme: "Polity & governance" },
    ]),
  },
  {
    year: 2022,
    q1: q1([
      { part: "a", en: "The campaign to save the endangered species.", hi: "लुप्तप्राय प्रजातियों को सुरक्षित रखने का अभियान ।", theme: "Environment & climate" },
      { part: "b", en: "What can be done to stop wars ?", hi: "रण संग्रामों को समाप्त करने के लिए क्या किया जा सकता है ?", theme: "International relations" },
      { part: "c", en: "The emerging presence of women in the Indian Armed Forces.", hi: "भारतीय सशस्त्र बल में महिलाओं की उभरती हुई उपस्थिति ।", theme: "Defence & armed forces" },
      { part: "d", en: "Price rise : causes and effects", hi: "मूल्य-वृद्धि : कारण एवं प्रभाव", theme: "Economy & development" },
      { part: "e", en: "A synthesis of Eastern wisdom and Western science : a needed goal for humanity.", hi: "प्राच्य विवेक/प्रज्ञता एवं पाश्चात्य विज्ञान का संश्लेषण : मानवता के लिए आवश्यक ध्येय/लक्ष्य ।", theme: "Ethics & philosophy" },
      { part: "f", en: "The Indian Armed Forces are a combination of strategic thinking and timely action.", hi: "भारतीय सशस्त्र बल सामरिक सोच एवं समयोचित कार्यवाही का संयोजन है ।", theme: "Defence & armed forces" },
    ]),
    q2: q2([
      { part: "a", en: "Video games sharpen the mind.", theme: "Education & youth" },
      { part: "b", en: "United Nations Organisation has become redundant.", theme: "International relations" },
    ]),
  },
  {
    year: 2021,
    q1: q1([
      { part: "a", en: "Chinese economic policy in countries bordering India", hi: "भारत के सीमावर्ती देशों में चीन की आर्थिक नीति", theme: "International relations" },
      { part: "b", en: "Work From Home : A boon or a bane ?", hi: "वर्क फ्रॉम होम : एक वरदान या एक अभिशाप ?", theme: "Society & gender" },
      { part: "c", en: "Party politics in India is a flourishing family business.", hi: "भारत में दलगत राजनीति एक फलता-फूलता पारिवारिक व्यवसाय है ।", theme: "Polity & governance" },
      { part: "d", en: "Unemployment and the New Education Policy", hi: "बेरोज़गारी और नई शिक्षा नीति", theme: "Education & youth" },
      { part: "e", en: "Urbanization is hazardous to human health.", hi: "शहरीकरण मानव स्वास्थ्य के लिए हानिकारक है ।", theme: "Environment & climate" },
      { part: "f", en: "Infiltrators are a threat to India’s security.", hi: "घुसपैठिए भारत की सुरक्षा के लिए ख़तरा हैं ।", theme: "Internal & national security" },
    ]),
    q2: q2([
      { part: "a", en: "Elections in States should be held simultaneously.", theme: "Polity & governance" },
      { part: "b", en: "Farmer protests are politically motivated.", theme: "Polity & governance" },
    ]),
  },
  {
    year: 2020,
    q1: q1([
      { part: "a", en: "Emerging threats to India’s internal security", hi: "भारत की आंतरिक सुरक्षा के समक्ष उभरते खतरे", theme: "Internal & national security" },
      { part: "b", en: "Crime against women is an expression of male domination", hi: "महिलाओं के विरुद्ध हिंसा पुरुष के वर्चस्व की अभिव्यक्ति है", theme: "Society & gender" },
      { part: "c", en: "Crisis of credibility in Indian electronic media", hi: "भारतीय इलेक्ट्रॉनिक मीडिया में साख का संकट", theme: "Polity & governance" },
      { part: "d", en: "Securing India’s international borders is a challenging exercise for the Indian armed forces", hi: "भारत की अंतर्राष्ट्रीय सीमाओं की रक्षा करना भारतीय सशस्त्र सेनाओं के लिए एक चुनौतीपूर्ण कार्य है", theme: "Defence & armed forces" },
      { part: "e", en: "Parenting in a competitive Indian society is a challenge", hi: "प्रतिस्पर्धात्मक भारतीय समाज में शिशुपालन एक चुनौती है", theme: "Society & gender" },
      { part: "f", en: "Ensuring social justice is a human right", hi: "सामाजिक न्याय की सुनिश्चितता एक मानवाधिकार है", theme: "Polity & governance" },
    ]),
    q2: q2([
      { part: "a", en: "Solitude during a pandemic is not unwelcome.", theme: "Society & gender" },
      { part: "b", en: "Political awareness among the social elite is inconsequential.", theme: "Polity & governance" },
    ]),
  },
];

export interface CapfP2Stats {
  years: number;
  firstYear: number;
  lastYear: number;
  essays: number;
  arguments: number;
  total: number;
}

export function capfP2Stats(data: CapfP2Year[] = CAPF_P2_YEARS): CapfP2Stats {
  const years = data.map((y) => y.year);
  const essays = data.reduce((n, y) => n + y.q1.items.length, 0);
  const args = data.reduce((n, y) => n + y.q2.items.length, 0);
  return { years: data.length, firstYear: Math.min(...years), lastYear: Math.max(...years), essays, arguments: args, total: essays + args };
}

/** Themes ordered by how often they appear across Q1 and Q2, with per-question counts. */
export function capfP2ThemeCounts(data: CapfP2Year[] = CAPF_P2_YEARS): { theme: CapfP2Theme; essays: number; arguments: number; total: number }[] {
  const map = new Map<CapfP2Theme, { essays: number; arguments: number }>();
  for (const y of data) {
    for (const [q, key] of [[y.q1, "essays"], [y.q2, "arguments"]] as const) {
      for (const item of q.items) {
        const row = map.get(item.theme) ?? { essays: 0, arguments: 0 };
        row[key] += 1;
        map.set(item.theme, row);
      }
    }
  }
  return [...map.entries()]
    .map(([theme, c]) => ({ theme, ...c, total: c.essays + c.arguments }))
    .sort((a, b) => b.total - a.total || a.theme.localeCompare(b.theme));
}

/** Stable anchor id for one item, e.g. "2024-q1-c". */
export function capfP2Anchor(year: number, question: 1 | 2, part: string): string {
  return `${year}-q${question}-${part}`;
}
