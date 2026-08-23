import { Cpu, Code2, Trophy, Rocket, Users, Lightbulb, Palette, Camera, Megaphone, GraduationCap, Heart, Dumbbell, Wallet, UserPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  section: 'hod' | 'faculty' | 'core';
  photo: string;
  designation?: string;
  bio?: string;
}

export interface EventItem {
  id: string;
  name: string;
  tagline: string;
  category: 'upcoming' | 'past';
  date: string;
  icon: LucideIcon;
  description: string;
  schedule: { time: string; title: string }[];
  gallery: string[];
  highlights: string[];
}

export interface Achievement {
  id: number;
  year: string;
  title: string;
  description: string;
  type: 'trophy' | 'medal' | 'code';
}

// ─── Team Data (from demo10-seven.vercel.app) ────────────────────

export const team: TeamMember[] = [
  // HOD
  { id: 1, name: 'Dr. Jayashree Katti', role: 'Head of Department', section: 'hod', photo: '', designation: 'Head of Department, Information Technology', bio: 'Guides the Information Technology department and supports the student community at PCCOE.' },
  // Faculty Coordinators
  { id: 2, name: 'Mrs. Tanuja Patankar', role: 'SDW Coordinator', section: 'faculty', photo: '', designation: 'Student Development and Welfare Coordinator', bio: 'Supports student development, activities, and department initiatives.' },
  { id: 3, name: 'Mrs. Shraddha Tawade', role: 'ITSA Coordinator', section: 'faculty', photo: '', designation: 'ITSA Coordinator', bio: 'Coordinates ITSA activities and mentors the student team throughout the year.' },
  // Core Team — Lead Executives
  { id: 4, name: 'Bhagyseh Mali', role: 'President', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676914/IMG-20250822-WA0294_yd6rp1.jpg' },
  { id: 5, name: 'Sharwari Kathole', role: 'Vice President', section: 'core', photo: 'https://drive.google.com/uc?export=view&id=1eejZ4Nqjl7-NeFtvajnYghZ1aa9rfMRV' },
  { id: 6, name: 'Saloni Khandelwal', role: 'Secretary', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676970/Saloni_ryefx1.jpg' },
  { id: 7, name: 'Ishan Toraskar', role: 'Treasurer', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676919/Ishan_Toraskar_o1fdi8.jpg' },
  { id: 8, name: 'Sampada Sawant', role: 'Joint Secretary', section: 'core', photo: 'https://drive.google.com/uc?export=view&id=1iih1-pVxbozFwjqWc7XxGIRCWXqpZ7RP' },
  // Core Team
  { id: 9, name: 'Piyusha Kate', role: 'Core Team', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676976/PiyushaKate_ej2vde.jpg' },
  { id: 10, name: 'Aditya Solunke', role: 'Core Team', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676914/aditya_bwqnbm.jpg' },
  // Technical Team
  { id: 11, name: 'Vedant Sarode', role: 'Technical Lead', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676977/Vedant_Sarode_omvwyd.jpg' },
  { id: 12, name: 'Shriya Marlegaonkar', role: 'Technical Team', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676963/Shriya_Marlegaonkar_aoinh9.jpg' },
  { id: 13, name: 'Uday Lingayat', role: 'Technical Team', section: 'core', photo: '' },
  { id: 14, name: 'Vikrant Tavhare', role: 'Technical Team', section: 'core', photo: '' },
  // Webmasters
  { id: 15, name: 'Vikas Shirsath', role: 'Webmasters', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676975/Vikas_Shirsath_ib2frq.jpg' },
  { id: 16, name: 'Pradnya Kulkarni', role: 'Webmasters', section: 'core', photo: 'https://res.cloudinary.com/dtmrnm1lq/image/upload/v1760260880/Pradnya_Kulkarni_1_q6rncg.png' },
  { id: 17, name: 'Soham Awati', role: 'Webmasters', section: 'core', photo: 'https://drive.google.com/uc?export=view&id=11pjCGh1TkLLqE-n_yxbUfDbAf2dHnkF5' },
  { id: 18, name: 'Aditya Deore', role: 'Webmasters', section: 'core', photo: '' },
  { id: 19, name: 'Madhura Hukkire', role: 'Webmasters', section: 'core', photo: '' },
  { id: 20, name: 'Prajjwal Singh', role: 'Webmasters', section: 'core', photo: '' },
  // Event Management & Logistics
  { id: 21, name: 'Pratik Mulik', role: 'Event Management & Logistics Lead', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676933/Pratik_Mulik_tvrbnx.jpg' },
  { id: 22, name: 'Vansh Raina', role: 'Event Management & Logistics', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676574/Vansh_Sanjay_Raina_jbwgyy.jpg' },
  { id: 23, name: 'Mandar Patil', role: 'Event Management & Logistics', section: 'core', photo: '' },
  { id: 24, name: 'Trijal Katti', role: 'Event Management & Logistics', section: 'core', photo: '' },
  { id: 25, name: 'Ayush Chandwadkar', role: 'Event Management & Logistics', section: 'core', photo: '' },
  { id: 26, name: 'Saleha Shaikh', role: 'Event Management & Logistics', section: 'core', photo: '' },
  { id: 27, name: 'Kaumudi Gite', role: 'Event Management & Logistics', section: 'core', photo: '' },
  { id: 28, name: 'Sarang Kolekar', role: 'Event Management & Logistics', section: 'core', photo: '' },
  { id: 29, name: 'Om Polawar', role: 'Event Management & Logistics', section: 'core', photo: '' },
  // Event Documentation
  { id: 30, name: 'Saniya Patil', role: 'Event Documentation', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676575/Saniya_Patil_bow7ng.jpg' },
  { id: 31, name: 'Vedant Kengalei', role: 'Event Documentation', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676974/Vedant_Kengale_im1ggx.jpg' },
  { id: 32, name: 'Bhaktee Patil', role: 'Event Documentation', section: 'core', photo: '' },
  { id: 33, name: 'Viraj Pathare', role: 'Event Documentation', section: 'core', photo: '' },
  // Video Editing and Photography
  { id: 34, name: 'Sarang Gaikwad', role: 'Video Editing and Photography', section: 'core', photo: '' },
  { id: 35, name: 'Ayush Kate', role: 'Video Editing and Photography', section: 'core', photo: '' },
  { id: 36, name: 'Aniket Gawande', role: 'Video Editing and Photography', section: 'core', photo: '' },
  // Design Team
  { id: 37, name: 'Gauri Chavan', role: 'Design Team', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676915/Gauri_Chavan_uoziga.jpg' },
  { id: 38, name: 'Swastika Sinha', role: 'Design Team', section: 'core', photo: '' },
  { id: 39, name: 'Prathamesh Pawar', role: 'Design Team', section: 'core', photo: '' },
  { id: 40, name: 'Khushi Fulwani', role: 'Design Team', section: 'core', photo: '' },
  { id: 41, name: 'Pranav Shirode', role: 'Design Team', section: 'core', photo: '' },
  { id: 42, name: 'Nida Kamil', role: 'Design Team', section: 'core', photo: '' },
  { id: 43, name: 'Samiksha Mote', role: 'Design Team', section: 'core', photo: '' },
  { id: 44, name: 'Anannya Jadhav', role: 'Design Team', section: 'core', photo: '' },
  // Publicity Team
  { id: 45, name: 'Shreya Birla', role: 'Publicity Team', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676961/Shreya_birla_wnarh6.jpg' },
  { id: 46, name: 'Shruti Jadhav', role: 'Publicity Team', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676569/Shruti_Jadhav_e6xar4.jpg' },
  { id: 47, name: 'Heet Oswal', role: 'Publicity Team', section: 'core', photo: '' },
  { id: 48, name: 'Vaidehi Behare', role: 'Publicity Team', section: 'core', photo: '' },
  { id: 49, name: 'Siddhi More', role: 'Publicity Team', section: 'core', photo: '' },
  { id: 50, name: 'Badal Dadwani', role: 'Publicity Team', section: 'core', photo: '' },
  // Higher Studies & CDPC
  { id: 51, name: 'Kshitija Ahire', role: 'Higher Studies & CDPC', section: 'core', photo: 'https://drive.google.com/uc?export=view&id=1O6U00wj5ffMIsISc5lwfc7CiNKH_FJFl' },
  { id: 52, name: 'Parth Jadhav', role: 'Higher Studies & CDPC', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676924/Parth_Jadhav_iwykce.jpg' },
  { id: 53, name: 'Ojas Barhate', role: 'Higher Studies & CDPC', section: 'core', photo: '' },
  // ISR & NSS
  { id: 54, name: 'Parth Patil', role: 'ISR & NSS', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676991/Parth_Patil_f4dgse.jpg' },
  { id: 55, name: 'Soham Sapkal', role: 'ISR & NSS', section: 'core', photo: '' },
  { id: 56, name: 'Samarth Gawade', role: 'ISR & NSS', section: 'core', photo: '' },
  { id: 57, name: 'Apurv Sagare', role: 'ISR & NSS', section: 'core', photo: '' },
  // Art Circle
  { id: 58, name: 'Atharva Thakur', role: 'Art Circle', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676929/atharva_thakur_zzsxpm.jpg' },
  { id: 59, name: 'Aastha Chaudhari', role: 'Art Circle', section: 'core', photo: '' },
  // Sports
  { id: 60, name: 'Om Shelke', role: 'Sports', section: 'core', photo: 'https://res.cloudinary.com/devyriv6o/image/upload/v1759676937/Om_shelke_mmq1ts.jpg' },
  { id: 61, name: 'Sanket Yamgar', role: 'Sports', section: 'core', photo: '' },
  { id: 62, name: 'Shravani Patil', role: 'Sports', section: 'core', photo: '' },
  { id: 63, name: 'Atharva Deshmukh', role: 'Sports', section: 'core', photo: '' },
  // Sponsorship and Budget
  { id: 64, name: 'Nishtha Parve', role: 'Sponsorship and Budget', section: 'core', photo: '' },
  { id: 65, name: 'Kanak Kushwaha', role: 'Sponsorship and Budget', section: 'core', photo: '' },
  { id: 66, name: 'Rehaan Shaikh', role: 'Sponsorship and Budget', section: 'core', photo: '' },
  // SY Interaction Coordinator
  { id: 67, name: 'Adi Maitre', role: 'SY Interaction Coordinator', section: 'core', photo: '' },
  { id: 68, name: 'Ishwari Jadhav', role: 'SY Interaction Coordinator', section: 'core', photo: '' },
];

// ─── Events Data (from demo10-seven.vercel.app) ──────────────────

export const events: EventItem[] = [
  {
    id: 'bruteforge-code-rush',
    name: 'BRUTEFORGE - Code Rush',
    tagline: 'A high-energy coding challenge for competitive builders.',
    category: 'past',
    date: '17th September, 2025',
    icon: Code2,
    description: 'BRUTEFORGE Code Rush is ITSA\'s flagship competitive programming event. Participants face intense algorithmic challenges under time pressure, testing their problem-solving speed and coding accuracy. The event brings together the best coders for a thrilling competition.',
    schedule: [
      { time: '09:00 AM', title: 'Registration & Check-in' },
      { time: '10:00 AM', title: 'Round 1 — Qualifiers' },
      { time: '01:00 PM', title: 'Lunch Break' },
      { time: '02:00 PM', title: 'Round 2 — Finals' },
      { time: '04:30 PM', title: 'Results & Awards' },
    ],
    gallery: [
      'https://res.cloudinary.com/devyriv6o/image/upload/v1760284685/bruteforge1_n1bij2.jpg',
      'https://res.cloudinary.com/devyriv6o/image/upload/v1760284685/bruteforge2_fx1arg.jpg',
      'https://res.cloudinary.com/devyriv6o/image/upload/v1760284684/bruteforge3_d9zmfj.jpg',
      'https://res.cloudinary.com/devyriv6o/image/upload/v1760284684/bruteforge4_imqjiy.jpg',
    ],
    highlights: ['Flagship ITSA competition', 'Intense algorithmic challenges', 'Live leaderboard', 'Cash prizes for winners'],
  },
  {
    id: 'bruteforge-ai-innovation-forge',
    name: 'BRUTEFORGE - AI Innovation Forge',
    tagline: 'An innovation challenge focused on practical artificial intelligence.',
    category: 'past',
    date: '17th September, 2025',
    icon: Cpu,
    description: 'BRUTEFORGE AI Innovation Forge challenges participants to build practical AI solutions for real-world problems. Teams design, prototype, and pitch AI-powered applications, with mentorship from industry experts throughout the event.',
    schedule: [
      { time: '09:00 AM', title: 'Registration & Briefing' },
      { time: '10:00 AM', title: 'Problem Statement Release' },
      { time: '01:00 PM', title: 'Mentorship Round' },
      { time: '04:00 PM', title: 'Final Presentations' },
      { time: '05:00 PM', title: 'Results & Awards' },
    ],
    gallery: [],
    highlights: ['Build practical AI solutions', 'Industry expert mentorship', 'Team-based innovation challenge', 'Pitch to judges'],
  },
  {
    id: 'webcrafter',
    name: 'Webcrafter',
    tagline: 'Create and present an engaging web experience.',
    category: 'past',
    date: '17th September, 2025',
    icon: Rocket,
    description: 'Webcrafter is a web design and development competition where participants create engaging, responsive web experiences from scratch. Teams showcase their creativity, technical skills, and design sensibility in a time-bound challenge.',
    schedule: [
      { time: '09:30 AM', title: 'Registration' },
      { time: '10:00 AM', title: 'Design & Build Phase' },
      { time: '02:00 PM', title: 'Presentations' },
      { time: '04:00 PM', title: 'Judging & Results' },
    ],
    gallery: [],
    highlights: ['Web design competition', 'Responsive design challenge', 'Creative freedom', 'Expert judging panel'],
  },
  {
    id: 'ai-workshop',
    name: 'AI Workshop',
    tagline: 'A practical introduction to modern artificial intelligence.',
    category: 'past',
    date: '21st July, 2025',
    icon: Cpu,
    description: 'A hands-on workshop introducing students to modern AI concepts, tools, and frameworks. Participants learn the fundamentals of machine learning, neural networks, and get practical experience building AI-powered applications.',
    schedule: [
      { time: '10:00 AM', title: 'Introduction to AI' },
      { time: '11:30 AM', title: 'Hands-on ML Basics' },
      { time: '02:00 PM', title: 'Building Neural Networks' },
      { time: '04:00 PM', title: 'Project Showcase' },
    ],
    gallery: [],
    highlights: ['Hands-on AI learning', 'ML & neural network basics', 'Build AI applications', 'Take-home resources'],
  },
  {
    id: 'diya-painting-workshop',
    name: 'Diya Painting Workshop',
    tagline: 'A creative workshop bringing students together through art.',
    category: 'past',
    date: '10th October, 2025',
    icon: Palette,
    description: 'A creative and cultural workshop where students come together to paint diyas for Diwali celebrations. The event fosters community bonding, creativity, and cultural appreciation among ITSA members.',
    schedule: [
      { time: '11:00 AM', title: 'Welcome & Materials Distribution' },
      { time: '11:30 AM', title: 'Diya Painting Session' },
      { time: '01:00 PM', title: 'Showcase & Photos' },
    ],
    gallery: [],
    highlights: ['Creative cultural event', 'Community bonding', 'Festive celebration', 'All materials provided'],
  },
  {
    id: 'higher-studies-gate',
    name: 'Higher Studies Sessions & GATE Mock Exam',
    tagline: 'Guidance and practice for higher studies and competitive exams.',
    category: 'past',
    date: '5th September, 2025',
    icon: GraduationCap,
    description: 'A comprehensive session covering higher studies opportunities, GATE exam preparation strategies, and a mock exam to help students assess their readiness. Expert guidance from faculty and alumni.',
    schedule: [
      { time: '09:00 AM', title: 'Higher Studies Guidance Session' },
      { time: '11:00 AM', title: 'GATE Strategy Workshop' },
      { time: '02:00 PM', title: 'Mock GATE Exam' },
      { time: '05:00 PM', title: 'Results & Analysis' },
    ],
    gallery: [
      'https://res.cloudinary.com/devyriv6o/image/upload/v1760286535/Gate_exam_jz4kpg.jpg',
    ],
    highlights: ['Expert guidance on higher studies', 'GATE preparation strategies', 'Full mock exam', 'Detailed performance analysis'],
  },
  {
    id: 'tree-plantation',
    name: 'Tree Plantation',
    tagline: 'A student-led initiative for a greener campus.',
    category: 'past',
    date: '21st August, 2025',
    icon: Heart,
    description: 'A student-led environmental initiative where ITSA members planted trees across the PCCOE campus. The drive promotes environmental awareness and sustainability among the student community.',
    schedule: [
      { time: '08:00 AM', title: 'Assembly & Briefing' },
      { time: '08:30 AM', title: 'Tree Plantation Drive' },
      { time: '10:30 AM', title: 'Group Photo & Refreshments' },
    ],
    gallery: [],
    highlights: ['Environmental initiative', 'Campus greening drive', 'Student community participation', 'Sustainability awareness'],
  },
  {
    id: 'techroom-inauguration',
    name: 'TechRoom and Inauguration',
    tagline: 'A new space for collaboration, projects, and technical learning.',
    category: 'past',
    date: '18th August, 2025',
    icon: Lightbulb,
    description: 'The inauguration of ITSA\'s dedicated TechRoom — a new space designed for collaboration, project building, and technical learning. The event marked a significant milestone in ITSA\'s infrastructure development.',
    schedule: [
      { time: '10:00 AM', title: 'Welcome Address' },
      { time: '10:30 AM', title: 'TechRoom Inauguration' },
      { time: '11:00 AM', title: 'Tour & Demonstrations' },
      { time: '12:00 PM', title: 'Networking & Refreshments' },
    ],
    gallery: [],
    highlights: ['New dedicated tech space', 'Collaboration hub', 'Project building area', 'Milestone for ITSA'],
  },
  {
    id: 'induction',
    name: 'Induction',
    tagline: 'Welcoming the new IT department community.',
    category: 'past',
    date: '30th July, 2025',
    icon: UserPlus,
    description: 'ITSA\'s annual induction ceremony welcoming new students to the Information Technology department. The event introduces freshmen to ITSA, its activities, and the vibrant tech community at PCCOE.',
    schedule: [
      { time: '10:00 AM', title: 'Welcome & Introduction' },
      { time: '11:00 AM', title: 'ITSA Presentation' },
      { time: '12:00 PM', title: 'Ice Breaker Activities' },
      { time: '01:00 PM', title: 'Lunch & Networking' },
    ],
    gallery: [],
    highlights: ['Welcoming new students', 'ITSA introduction', 'Ice breaker activities', 'Community building'],
  },
];

// ─── Achievements ────────────────────────────────────────────────

export const achievements: Achievement[] = [
  { id: 1, year: '2025', title: 'BRUTEFORGE Flagship Success', description: 'ITSA\'s BRUTEFORGE competition became one of the most anticipated tech events at PCCOE, drawing participation from across departments and setting new standards for student-led competitions.', type: 'trophy' },
  { id: 2, year: '2025', title: 'TechRoom Inauguration', description: 'ITSA inaugurated a dedicated TechRoom space, providing students with a permanent hub for collaboration, project building, and technical learning.', type: 'code' },
  { id: 3, year: '2025', title: 'AI Workshop Series', description: 'Successfully conducted a series of AI and machine learning workshops, equipping students with practical skills in modern artificial intelligence.', type: 'medal' },
  { id: 4, year: '2025', title: 'Community Outreach', description: 'Through NSS activities, tree plantation drives, and school outreach programs, ITSA members demonstrated commitment to social responsibility.', type: 'medal' },
  { id: 5, year: '2024', title: 'Best Student Chapter Award', description: 'ITSA was recognized as the Best Student Chapter among all PCCOE technical clubs for outstanding events and community impact.', type: 'trophy' },
  { id: 6, year: '2024', title: 'Webcrafter Competition Launch', description: 'Successfully launched Webcrafter, a web design and development competition that became a highlight of the ITSA event calendar.', type: 'code' },
  { id: 7, year: '2023', title: 'Inter-College Coding Cup', description: 'ITSA secured the Inter-College Coding Cup, dominating the algorithmic contest against teams from across the region.', type: 'trophy' },
];

// ─── Gallery Images (from demo10-seven.vercel.app) ───────────────

export const galleryImages: { url: string; title: string; span: string }[] = [
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760284685/bruteforge1_n1bij2.jpg', title: 'BRUTEFORGE Code Rush', span: 'row-span-2' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760284685/bruteforge2_fx1arg.jpg', title: 'BRUTEFORGE Competition', span: '' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760285804/IMG-20250721-WA0013_jrh0dn.jpg', title: 'Induction Day', span: '' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760284684/bruteforge3_d9zmfj.jpg', title: 'BRUTEFORGE Finals', span: 'row-span-2' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760284684/bruteforge4_imqjiy.jpg', title: 'Code Rush Action', span: '' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760286253/IMG_20251010_162139_a0ubyf.jpg', title: 'Diya Painting Workshop', span: '' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760286535/Gate_exam_jz4kpg.jpg', title: 'GATE Mock Exam', span: 'row-span-2' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760286666/IMG_20250924_164541_obldfo.jpg', title: 'TechRoom Session', span: '' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760287639/IMG_20250908_155928_qrs2cl.jpg', title: 'Workshop Activity', span: '' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760287768/IMG-20251006-WA0114_qpdj8o.jpg', title: 'Team Event', span: '' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760289086/IMG-20250906-WA0010_xbrmqp.jpg', title: 'Community Outreach', span: '' },
  { url: 'https://res.cloudinary.com/devyriv6o/image/upload/v1760288331/Screenshot_2025-10-12_222823_qyl5wg.png', title: 'Event Highlights', span: 'row-span-2' },
];
