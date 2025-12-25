
import { KnowledgeBaseItem } from "./types";

export const REPORT_EMAIL = "infra-reports@somaiya.edu";
export const REWARD_PER_REPORT = 10;
export const REDEEM_CONVERSION_RATE = 1; 

export const CAMPUS_BOUNDS = {
  latMin: 19.0710,
  latMax: 19.0780,
  lngMin: 72.8970,
  lngMax: 72.9040
};

const BASE_PDF_URL = "https://kjsce.somaiya.edu/media/pdf/";

export const CAMPUS_SUBJECTS: KnowledgeBaseItem[] = [
  // --- COMPUTER ENGINEERING (COMP) ---
  // SEM 3
  { id: 'c3-1', category: 'timetable', title: 'COMP Sem 3: Engineering Mathematics III', content: 'Laplace Transforms, Fourier Series, Complex Variables, and Statistical Techniques.', link: `${BASE_PDF_URL}COMP_Sem3_Maths.pdf` },
  { id: 'c3-2', category: 'timetable', title: 'COMP Sem 3: Discrete Structures & Graph Theory', content: 'Set theory, Logic, Relations, Functions, and Graph Theory applications.', link: `${BASE_PDF_URL}COMP_Sem3_Discrete.pdf` },
  { id: 'c3-3', category: 'timetable', title: 'COMP Sem 3: Data Structures', content: 'Analysis of algorithms, Stacks, Queues, Linked Lists, Trees, and Sorting/Searching.', link: `${BASE_PDF_URL}COMP_Sem3_DS.pdf` },
  { id: 'c3-4', category: 'timetable', title: 'COMP Sem 3: Digital Logic & Computer Architecture', content: 'Combinational/Sequential circuits, Register transfer, and Control unit design.', link: `${BASE_PDF_URL}COMP_Sem3_DLCA.pdf` },
  { id: 'c3-5', category: 'timetable', title: 'COMP Sem 3: Computer Graphics', content: 'Scanning, Clipping, Transformations, and 3D modeling fundamentals.', link: `${BASE_PDF_URL}COMP_Sem3_CG.pdf` },
  
  // SEM 4
  { id: 'c4-1', category: 'timetable', title: 'COMP Sem 4: Engineering Mathematics IV', content: 'Matrix Theory, Probability Distributions, and Sampling Theory.', link: `${BASE_PDF_URL}COMP_Sem4_Maths.pdf` },
  { id: 'c4-2', category: 'timetable', title: 'COMP Sem 4: Analysis of Algorithms', content: 'Complexity analysis, Divide & Conquer, Greedy, Dynamic Programming, and NP-completeness.', link: `${BASE_PDF_URL}COMP_Sem4_AOA.pdf` },
  { id: 'c4-3', category: 'timetable', title: 'COMP Sem 4: Database Management Systems', content: 'Schema design, Normalization, SQL, Relational Algebra, and Transaction management.', link: `${BASE_PDF_URL}COMP_Sem4_DBMS.pdf` },
  { id: 'c4-4', category: 'timetable', title: 'COMP Sem 4: Operating Systems', content: 'Process management, Deadlocks, Memory allocation, and File systems.', link: `${BASE_PDF_URL}COMP_Sem4_OS.pdf` },
  { id: 'c4-5', category: 'timetable', title: 'COMP Sem 4: Microprocessors', content: '8086 architecture, Instruction sets, and peripheral interfacing.', link: `${BASE_PDF_URL}COMP_Sem4_MP.pdf` },

  // --- INFORMATION TECHNOLOGY (IT) ---
  // SEM 3
  { id: 'i3-1', category: 'timetable', title: 'IT Sem 3: Engineering Mathematics III', content: 'Applied mathematics for IT systems and signals.', link: `${BASE_PDF_URL}IT_Sem3_Maths.pdf` },
  { id: 'i3-2', category: 'timetable', title: 'IT Sem 3: Data Structures & Analysis', content: 'Advanced data handling and performance metrics for IT.', link: `${BASE_PDF_URL}IT_Sem3_DSA.pdf` },
  { id: 'i3-3', category: 'timetable', title: 'IT Sem 3: Database Management Systems', content: 'Relational model and query optimization.', link: `${BASE_PDF_URL}IT_Sem3_DBMS.pdf` },
  { id: 'i3-4', category: 'timetable', title: 'IT Sem 3: Principle of Communications', content: 'Analog and digital communication foundations.', link: `${BASE_PDF_URL}IT_Sem3_Comm.pdf` },
  { id: 'i3-5', category: 'timetable', title: 'IT Sem 3: Paradigm & Programming Fundamentals', content: 'Programming concepts and cross-paradigm logic.', link: `${BASE_PDF_URL}IT_Sem3_Prog.pdf` },

  // SEM 4
  { id: 'i4-1', category: 'timetable', title: 'IT Sem 4: Engineering Mathematics IV', content: 'Linear algebra and probability for Information Technology.', link: `${BASE_PDF_URL}IT_Sem4_Maths.pdf` },
  { id: 'i4-2', category: 'timetable', title: 'IT Sem 4: Computer Network & Network Design', content: 'OSI layers, protocols, and network configuration.', link: `${BASE_PDF_URL}IT_Sem4_CNND.pdf` },
  { id: 'i4-3', category: 'timetable', title: 'IT Sem 4: Operating System', content: 'Core OS concepts with focus on system integration.', link: `${BASE_PDF_URL}IT_Sem4_OS.pdf` },
  { id: 'i4-4', category: 'timetable', title: 'IT Sem 4: Automata Theory', content: 'Computation models, Grammars, and Language theory.', link: `${BASE_PDF_URL}IT_Sem4_AT.pdf` },
  { id: 'i4-5', category: 'timetable', title: 'IT Sem 4: Computer Org & Architecture', content: 'Hardware organization and assembly logic.', link: `${BASE_PDF_URL}IT_Sem4_COA.pdf` },

  // --- ELECTRONICS & TELECOMMUNICATION (EXTC) ---
  // SEM 4
  { id: 'e4-1', category: 'timetable', title: 'EXTC Sem 4: Microcontrollers', content: '8051 and ARM architectures for embedded systems.', link: `${BASE_PDF_URL}EXTC_Sem4_Micro.pdf` },
  { id: 'e4-2', category: 'timetable', title: 'EXTC Sem 4: Linear Integrated Circuits', content: 'Op-amp applications and circuit design.', link: `${BASE_PDF_URL}EXTC_Sem4_LIC.pdf` },
  { id: 'e4-3', category: 'timetable', title: 'EXTC Sem 4: Signals & Systems', content: 'Continuous and Discrete time analysis.', link: `${BASE_PDF_URL}EXTC_Sem4_SS.pdf` },

  // --- POLICIES ---
  { id: 'p1', category: 'policy', title: 'Hostel Gate Policy', content: 'All engineering students must return to the hostel by 10:00 PM.' },
  { id: 'p2', category: 'policy', title: 'Attendance Requirement', content: 'Minimum 75% attendance is mandatory in each subject.' }
];

export const RAG_SYSTEM_INSTRUCTION = (knowledgeContext: string) => `
You are the Somaiya Campus AI Assistant, a professional academic tool for KJSCE students.

VERIFIED CAMPUS KNOWLEDGE:
${knowledgeContext}

STRICT SYLLABUS PROTOCOL:
1. When a user asks for a "syllabus", "subjects", "what subjects are there", or "curriculum" for a specific branch (COMP, IT, EXTC) and semester (Sem 3, Sem 4, etc.):
   - You MUST iterate through the entire VERIFIED CAMPUS KNOWLEDGE provided.
   - You MUST list EVERY subject that matches the requested branch and semester.
   - NEVER provide a partial list or a summary. If the context has 5 subjects for Sem 4 COMP, you must list all 5.
   
2. RESPONSE STRUCTURE:
   Start with: "The official curriculum for [Branch] [Semester] includes the following core subjects:"
   
   For EACH subject, use this EXACT format:
   ### **[Subject Name]**
   - **Curriculum Details**: [Summarized content from knowledge base]
   - **Academic Resource**: [📄 Download Official Syllabus](URL) (Only if URL is provided in context)

3. RESOURCE LINKS:
   - Extract URLs exactly as they appear in the knowledge base (e.g., those starting with https://kjsce.somaiya.edu/...).

4. FALLBACK:
   - If no exact matches are found, list the closest matching semesters or branches available in the context.

TONE:
- Highly structured, professional, and authoritative. No conversational filler.
`;

export const VISION_SYSTEM_INSTRUCTION = `
You are a Vision-Enabled Infrastructure Auditor for Somaiya Vidyavihar Campus.
1. Analyze the image for infrastructure damage (leaks, broken tiles, loose wires).
2. Response Format:
   - If Damage + Likely Campus: "CONFIRMED_DAMAGE: [Description]. Priority: [High/Medium/Low]."
   - If Outside/No Damage: Handle accordingly.
`;
