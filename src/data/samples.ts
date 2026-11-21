export type SampleCategory =
  | 'All'
  | 'Graphic & Video'
  | 'Research & Docs'
  | 'IT & Coding'
  | 'Data & Excel'
  | 'Architecture & CAD';

export interface SampleWork {
  id: number;
  title: string;
  category: Exclude<SampleCategory, 'All'>;
  image: string;
  alt: string;
}

export const FACEBOOK_URL = 'https://www.facebook.com/jascommission2024';

export const SAMPLE_CATEGORIES: SampleCategory[] = [
  'All',
  'Graphic & Video',
  'Research & Docs',
  'IT & Coding',
  'Data & Excel',
  'Architecture & CAD',
];

export const SAMPLE_WORKS: SampleWork[] = [
  {
    id: 4,
    title: 'Excel Bills Compute',
    category: 'Data & Excel',
    image: '/assets/aistudio/4_ef62d57a.png',
    alt: 'Ja’s Commission sample work: Excel Bills Compute spreadsheet solution',
  },
  {
    id: 31,
    title: 'Data Analysis Excel w/ Document',
    category: 'Data & Excel',
    image: '/assets/aistudio/31_f2105440.png',
    alt: 'Ja’s Commission sample work: Data Analysis Excel with Document report',
  },
  {
    id: 42,
    title: 'Math Mean Full Solution',
    category: 'Data & Excel',
    image: '/assets/aistudio/42_2efed22d.png',
    alt: 'Ja’s Commission sample work: Math Mean Full Solution document',
  },
  {
    id: 30,
    title: 'DSWD Tarpaulin Poster',
    category: 'Graphic & Video',
    image: '/assets/aistudio/30_fcb0c863.png',
    alt: 'Ja’s Commission sample work: DSWD Tarpaulin Poster design',
  },
  {
    id: 20,
    title: 'MySQL Workbench Activity',
    category: 'IT & Coding',
    image: '/assets/aistudio/20_3325976c.png',
    alt: 'Ja’s Commission sample work: MySQL Workbench SQL query activity',
  },
  {
    id: 46,
    title: '3D Model Architecture Layout',
    category: 'Architecture & CAD',
    image: '/assets/aistudio/46_55d4d042.png',
    alt: 'Ja’s Commission sample work: 3D Model Architecture Layout',
  },
  {
    id: 2,
    title: 'Humanize Research',
    category: 'Research & Docs',
    image: '/assets/aistudio/2_24bfa11f.png',
    alt: 'Ja’s Commission sample work: Humanize Research proofreading task',
  },
  {
    id: 10,
    title: 'Demographic Survey',
    category: 'Data & Excel',
    image: '/assets/aistudio/10_1f8c27fb.png',
    alt: 'Ja’s Commission sample work: Demographic Survey data collection sheet',
  },
  {
    id: 40,
    title: 'Document Video Editing',
    category: 'Graphic & Video',
    image: '/assets/aistudio/40_fa90c223.png',
    alt: 'Ja’s Commission sample work: Document Video Editing delivery',
  },
  {
    id: 32,
    title: 'Website for Thesis',
    category: 'IT & Coding',
    image: '/assets/aistudio/32_5d0f699c.png',
    alt: 'Ja’s Commission sample work: Website for Thesis web development',
  },
  {
    id: 5,
    title: 'Film Poster',
    category: 'Graphic & Video',
    image: '/assets/aistudio/5_1766b57c.png',
    alt: 'Ja’s Commission sample work: Film Poster graphic design',
  },
  {
    id: 41,
    title: 'Brochure Trifold',
    category: 'Graphic & Video',
    image: '/assets/aistudio/41_dd40e94e.png',
    alt: 'Ja’s Commission sample work: Brochure Trifold layout design',
  },
  {
    id: 3,
    title: 'SAP Modules',
    category: 'IT & Coding',
    image: '/assets/aistudio/3_28dbed1b.png',
    alt: 'Ja’s Commission sample work: SAP Modules technical task',
  },
  {
    id: 6,
    title: 'Slogan Poster',
    category: 'Graphic & Video',
    image: '/assets/aistudio/6_fcf24afe.png',
    alt: 'Ja’s Commission sample work: Slogan Poster design',
  },
  {
    id: 7,
    title: 'Canva PPT Presentation',
    category: 'Graphic & Video',
    image: '/assets/aistudio/7_e344a97c.png',
    alt: 'Ja’s Commission sample work: Canva PPT slide deck',
  },
  {
    id: 8,
    title: 'Data Statistic Summary',
    category: 'Data & Excel',
    image: '/assets/aistudio/8_28c194e7.png',
    alt: 'Ja’s Commission sample work: Data Statistic Summary sheet',
  },
  {
    id: 9,
    title: 'RRL & RRS Research',
    category: 'Research & Docs',
    image: '/assets/aistudio/9_d2a45eaf.png',
    alt: 'Ja’s Commission sample work: RRL and RRS Research paper',
  },
  {
    id: 11,
    title: 'PSPP Data Encode',
    category: 'Data & Excel',
    image: '/assets/aistudio/11_d83fbedc.png',
    alt: 'Ja’s Commission sample work: PSPP Data Encoding task',
  },
  {
    id: 12,
    title: 'Web Developer Project',
    category: 'IT & Coding',
    image: '/assets/aistudio/12_38b3e601.png',
    alt: 'Ja’s Commission sample work: Web Developer custom project',
  },
  {
    id: 13,
    title: 'End Card Canva Video',
    category: 'Graphic & Video',
    image: '/assets/aistudio/13_c3b51644.png',
    alt: 'Ja’s Commission sample work: End Card Canva Video',
  },
  {
    id: 14,
    title: 'Moodboard Adobe File',
    category: 'Graphic & Video',
    image: '/assets/aistudio/14_11d697ed.png',
    alt: 'Ja’s Commission sample work: Moodboard Adobe File design',
  },
  {
    id: 15,
    title: 'Hazard Identification & Risk Assessment',
    category: 'Research & Docs',
    image: '/assets/aistudio/15_04cbae8b.png',
    alt: 'Ja’s Commission sample work: Hazard Identification, Risk Assessment and Control',
  },
  {
    id: 16,
    title: 'Spacing Table Content',
    category: 'Research & Docs',
    image: '/assets/aistudio/16_1522cb52.png',
    alt: 'Ja’s Commission sample work: Spacing Table Content formatting',
  },
  {
    id: 17,
    title: 'Video Editing School',
    category: 'Graphic & Video',
    image: '/assets/aistudio/17_a116ec95.png',
    alt: 'Ja’s Commission sample work: School Video Editing task',
  },
  {
    id: 18,
    title: 'JFrame Code System',
    category: 'IT & Coding',
    image: '/assets/aistudio/18_9885e641.png',
    alt: 'Ja’s Commission sample work: Java JFrame Code System',
  },
  {
    id: 19,
    title: 'Icon Adobe Animation',
    category: 'Graphic & Video',
    image: '/assets/aistudio/19_389fad1a.png',
    alt: 'Ja’s Commission sample work: Icon Adobe Animation',
  },
  {
    id: 21,
    title: 'Architecture Drafting Activity',
    category: 'Architecture & CAD',
    image: '/assets/aistudio/21_f7154c19.png',
    alt: 'Ja’s Commission sample work: Architecture Drafting Activity',
  },
  {
    id: 22,
    title: 'Video Editing Website',
    category: 'Graphic & Video',
    image: '/assets/aistudio/22_a94f7a52.png',
    alt: 'Ja’s Commission sample work: Website promo video editing',
  },
  {
    id: 23,
    title: 'Layout & Plotting Architecture',
    category: 'Architecture & CAD',
    image: '/assets/aistudio/23_9a29d155.png',
    alt: 'Ja’s Commission sample work: Layout and Plotting Architecture plan',
  },
  {
    id: 24,
    title: 'Cisco Packet Activity',
    category: 'IT & Coding',
    image: '/assets/aistudio/24_2cfbf7df.png',
    alt: 'Ja’s Commission sample work: Cisco Packet Tracer networking activity',
  },
  {
    id: 25,
    title: 'Static Treatment Activity',
    category: 'Research & Docs',
    image: '/assets/aistudio/25_f2356093.png',
    alt: 'Ja’s Commission sample work: Static Treatment Activity document',
  },
  {
    id: 26,
    title: 'Electricity Basis Cost Research',
    category: 'Research & Docs',
    image: '/assets/aistudio/26_0baec6d6.png',
    alt: 'Ja’s Commission sample work: Electricity Basis Cost Research',
  },
  {
    id: 27,
    title: 'Consultation Capstone Research I',
    category: 'Research & Docs',
    image: '/assets/aistudio/27_4829a43f.png',
    alt: 'Ja’s Commission sample work: Consultation Capstone Research Part 1',
  },
  {
    id: 28,
    title: 'Consultation Capstone Research II',
    category: 'Research & Docs',
    image: '/assets/aistudio/28_dcc7e3fc.png',
    alt: 'Ja’s Commission sample work: Consultation Capstone Research Part 2',
  },
  {
    id: 29,
    title: 'C# Activity Website School',
    category: 'IT & Coding',
    image: '/assets/aistudio/29_c7f9ef2b.png',
    alt: 'Ja’s Commission sample work: C# Activity School Website',
  },
  {
    id: 33,
    title: 'Video Document',
    category: 'Graphic & Video',
    image: '/assets/aistudio/33_3b30bd28.png',
    alt: 'Ja’s Commission sample work: Video Document editing',
  },
  {
    id: 34,
    title: 'Title Research',
    category: 'Research & Docs',
    image: '/assets/aistudio/34_a6bc9aa8.png',
    alt: 'Ja’s Commission sample work: Research Title proposal',
  },
  {
    id: 35,
    title: 'Humanize & Paraphrase Document',
    category: 'Research & Docs',
    image: '/assets/aistudio/35_ece9fb74.png',
    alt: 'Ja’s Commission sample work: Humanize and Paraphrase Document',
  },
  {
    id: 36,
    title: 'ID Scan Letter Document',
    category: 'Research & Docs',
    image: '/assets/aistudio/36_ad8f2fc6.png',
    alt: 'Ja’s Commission sample work: ID Scan Letter Document preparation',
  },
  {
    id: 37,
    title: 'Architecture Waste Drainage',
    category: 'Architecture & CAD',
    image: '/assets/aistudio/37_83080aba.png',
    alt: 'Ja’s Commission sample work: Architecture Waste Drainage plan',
  },
  {
    id: 38,
    title: 'ADVOFCC Midterm Project',
    category: 'IT & Coding',
    image: '/assets/aistudio/38_0090725f.png',
    alt: 'Ja’s Commission sample work: ADVOFCC Midterm Project',
  },
  {
    id: 39,
    title: 'Module Video Editing',
    category: 'Graphic & Video',
    image: '/assets/aistudio/39_170389eb.png',
    alt: 'Ja’s Commission sample work: Module Video Editing',
  },
  {
    id: 43,
    title: 'Chapter 4 Excel w/ Document',
    category: 'Data & Excel',
    image: '/assets/aistudio/43_b7757623.png',
    alt: 'Ja’s Commission sample work: Chapter 4 Excel with Document analysis',
  },
  {
    id: 44,
    title: 'Arduino Guide Material / Code',
    category: 'IT & Coding',
    image: '/assets/aistudio/44_08950f2e.png',
    alt: 'Ja’s Commission sample work: Arduino Guide Material and Code',
  },
  {
    id: 45,
    title: 'Survey Tally Excel',
    category: 'Data & Excel',
    image: '/assets/aistudio/45_1ccfc168.png',
    alt: 'Ja’s Commission sample work: Survey Tally Excel workbook',
  },
];

export const CLIENT_FEEDBACK_IMAGES = [
  {
    src: '/assets/jas/feedback-1.jpg',
    alt: 'Message from a Ja’s Commission client confirming task completion',
    label: 'Client feedback 1',
  },
  {
    src: '/assets/jas/feedback-2.jpg',
    alt: 'Message from a Ja’s Commission client praising the final file',
    label: 'Client feedback 2',
  },
  {
    src: '/assets/jas/feedback-3.jpg',
    alt: 'Message from a Ja’s Commission client thanking for fast delivery',
    label: 'Client feedback 3',
  },
  {
    src: '/assets/jas/feedback-4.jpg',
    alt: 'Message from a Ja’s Commission client after receiving completed commission',
    label: 'Client feedback 4',
  },
];
