import type { SampleCategory } from './samples';

export interface ServiceOffering {
  id: string;
  tabLabel: string;
  shortLabel: string;
  title: string;
  tagline: string;
  poster: string;
  alt: string;
  sampleCategory: SampleCategory | null;
  builderCategory: string;
  highlights: string[];
}

export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    id: 'design',
    tabLabel: 'Design',
    shortLabel: 'Graphic Design',
    title: 'Graphic Design Commission',
    tagline: 'Design stress? We’ve got you covered.',
    poster: '/assets/aistudio/1_5883ad57.png',
    alt: 'Ja’s Commission Graphic Design poster — Branding, Logos, T-shirt and ID Lace Layout, Presentations, Pubmats and Infographics',
    sampleCategory: 'Graphic & Video',
    builderCategory: 'Graphic & Video',
    highlights: [
      'Branding & logo design',
      'T-shirt and ID lace layout',
      'Presentations & pitch decks',
      'Pubmats, posters & infographics',
    ],
  },
  {
    id: 'video-editing',
    tabLabel: 'Video',
    shortLabel: 'Video Editing',
    title: 'Video Editing Commission',
    tagline: 'Editing stress? We’ve got you covered.',
    poster: '/assets/aistudio/3_9bb26626.png',
    alt: 'Ja’s Commission Video Editing poster — Short-Form Content, YouTube & Vlog, Commercial Ads, Motion Graphics, Color Grading, Podcast Editing',
    sampleCategory: 'Graphic & Video',
    builderCategory: 'Graphic & Video',
    highlights: [
      'Short-form content, YouTube & vlog editing',
      'Commercial ads & motion graphics',
      'Color grading & sound mixing',
      'Podcast editing, thumbnails & title design',
    ],
  },
  {
    id: 'excel-data',
    tabLabel: 'Excel & Data',
    shortLabel: 'Excel & Data',
    title: 'Excel Data Commission',
    tagline: 'Organise, analyse, and present your data with confidence.',
    poster: '/assets/aistudio/2_f203cd14.png',
    alt: 'Ja’s Commission Excel Data poster — Data Entry, Data Cleaning, Formulas, Charts, Dashboards, Pivot Tables, Macros, Payroll Sheets',
    sampleCategory: 'Data & Excel',
    builderCategory: 'Data & Excel',
    highlights: [
      'Spreadsheet data entry, cleaning & formatting',
      'Formulas, charts, reports & dashboard support',
      'Pivot tables, VLOOKUP, XLOOKUP & macros',
      'Invoice, budget & payroll sheets',
    ],
  },
  {
    id: 'thesis-research',
    tabLabel: 'Thesis',
    shortLabel: 'Thesis & Research',
    title: 'Thesis, Research & Essay Commission',
    tagline: 'Thesis, research, or essay stress? We’ve got you covered.',
    poster: '/assets/aistudio/COMMISSION_POSTER___SAMPLE_WORKS___6__7d841974.png',
    alt: 'Ja’s Commission Thesis, Research & Essay poster — Research Writing, RRL Revisions, Proposals, Chapter 1-5, Statistical Treatment, Citations',
    sampleCategory: 'Research & Docs',
    builderCategory: 'Research & Docs',
    highlights: [
      'Research writing, RRL revisions & proposals',
      'Thesis, capstone & Chapter 1–5 assistance',
      'Statistical treatment & table summaries',
      'Paper editing, spacing, citation & formatting',
    ],
  },
  {
    id: 'it-web',
    tabLabel: 'IT & Web',
    shortLabel: 'IT & Web Projects',
    title: 'IT & Web Project Commission',
    tagline: 'IT project stress? We’ve got you covered.',
    poster: '/assets/aistudio/Academic_Social_Post__5__97a0c57c.png',
    alt: 'Ja’s Commission IT & Web Services poster — UI/UX, Front-End, Backend, Database & API, Full-Stack Web Apps, Mobile UI, Cloud & Support',
    sampleCategory: 'IT & Coding',
    builderCategory: 'IT & Coding',
    highlights: [
      'UI/UX, responsive & e-commerce websites',
      'Front-end, backend & full-stack web apps',
      'Database, API integration & CMS development',
      'IT systems, software projects & cloud deployment',
    ],
  },
  {
    id: 'architecture',
    tabLabel: 'Architecture',
    shortLabel: 'Architecture & AutoCAD',
    title: 'Architecture & AutoCAD Commission',
    tagline: 'Technical drafting and 3D layout support built to spec.',
    poster: '/assets/aistudio/5_040fe845.png',
    alt: 'Ja’s Commission Architecture & AutoCAD poster — Residential & Commercial Drawings, Site Plans, Interior Layouts, AutoCAD 2D, 3D Modelling',
    sampleCategory: 'Architecture & CAD',
    builderCategory: 'Architecture & CAD',
    highlights: [
      'Residential & commercial architectural drawings',
      'Site plans, elevations & floor plans',
      'Interior layouts, space planning & construction details',
      'AutoCAD 2D drawings & 3D modelling support',
    ],
  },
  {
    id: 'ai-services',
    tabLabel: 'AI Services',
    shortLabel: 'AI Services',
    title: 'Artificial Intelligence Commission',
    tagline: 'Modern AI-assisted production tailored to your brand.',
    poster: '/assets/aistudio/4_6c96f179.png',
    alt: 'Ja’s Commission Artificial Intelligence poster — AI Content, Business Process Automation, Product Photoshoots, Logo, Social Creatives, Custom Integrations',
    sampleCategory: null,
    builderCategory: 'AI Services',
    highlights: [
      'AI content, copywriting & social media creatives',
      'AI business process automation & integrations',
      'AI product photoshoots, logo & brand identity',
      'AI voice & video concept production',
    ],
  },
];
