// Curated KICD/CBC knowledge base links (CP-C).
// Link health tested in tests/e2e/kicd-links.spec.ts (@external tag).

export interface KicdLink {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  category: "curriculum" | "framework" | "assessment" | "resources";
}

export const KICD_LINKS: KicdLink[] = [
  {
    id: "kicd-home",
    title: "KICD Homepage",
    description: "Kenya Institute of Curriculum Development — the authority for CBC curriculum materials.",
    url: "http://kicd.ac.ke/",
    tags: ["CBC", "curriculum", "KICD"],
    category: "framework",
  },
  {
    id: "kicd-curriculum-designs",
    title: "CBC Curriculum Designs",
    description: "Grade-by-grade subject curriculum designs covering all learning areas.",
    url: "http://kicd.ac.ke/curriculum-designs/",
    tags: ["curriculum designs", "grades", "subjects"],
    category: "curriculum",
  },
  {
    id: "kicd-cbc-framework",
    title: "CBC Curriculum Framework",
    description:
      "The overarching Competency Based Curriculum framework document — values, competencies, and structure.",
    url: "http://kicd.ac.ke/cbc-curriculum-designs/cbc-curriculum-framework/",
    tags: ["framework", "competencies", "values", "CBC"],
    category: "framework",
  },
  {
    id: "kicd-primary-designs",
    title: "Primary School Curriculum Designs",
    description: "CBC curriculum designs for Grades 1–6 across all learning areas.",
    url: "http://kicd.ac.ke/cbc-curriculum-designs/primary-school-curriculum-designs/",
    tags: ["primary", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    category: "curriculum",
  },
  {
    id: "kicd-jss-designs",
    title: "Junior Secondary Curriculum Designs (Grade 7–9)",
    description: "CBC curriculum designs for Junior Secondary — Grades 7, 8, and 9.",
    url: "http://kicd.ac.ke/cbc-curriculum-designs/junior-secondary-school-curriculum-designs/",
    tags: ["junior secondary", "Grade 7", "Grade 8", "Grade 9", "JSS"],
    category: "curriculum",
  },
  {
    id: "kicd-assessment-guide",
    title: "Assessment Policy for CBC",
    description: "Guidelines for continuous assessment, formative and summative tools within CBC.",
    url: "http://kicd.ac.ke/services/assessment-and-examinations/",
    tags: ["assessment", "formative", "summative", "evaluation"],
    category: "assessment",
  },
  {
    id: "kicd-teacher-guide",
    title: "Teacher Support Materials",
    description: "KICD resources designed to support teachers in implementing CBC in the classroom.",
    url: "http://kicd.ac.ke/services/curriculum-support-materials/",
    tags: ["teacher", "support", "implementation", "materials"],
    category: "resources",
  },
  {
    id: "kicd-digital-resources",
    title: "Digital Learning Resources",
    description: "KICD digital and open educational resources for CBC classrooms.",
    url: "http://kicd.ac.ke/services/open-educational-resources/",
    tags: ["digital", "OER", "open educational resources"],
    category: "resources",
  },
];

export function searchKicdLinks(query: string): KicdLink[] {
  if (!query.trim()) return KICD_LINKS;
  const q = query.toLowerCase();
  return KICD_LINKS.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q)) ||
      l.category.includes(q),
  );
}
