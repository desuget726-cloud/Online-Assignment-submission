import heroImg1 from '../assets/1.jpg'
import heroImg2 from '../assets/images.jpg'
import heroImg3 from '../assets/logo.jpg'

export const heroImages = [
  { src: heroImg1, alt: 'Mekdela Amba University campus' },
  { src: heroImg2, alt: 'Students studying in a university classroom' },
  { src: heroImg3, alt: 'Mekdela Amba University seal display' },
]

export const topBarInfo = {
  email: 'info@mekdela.edu.et',
  phone: '+251 00 000 0000',
  workingHours: 'Mon-Fri, 8:30 AM - 5:30 PM',
}

export const topBarQuickLinks = [
  { label: 'Student Portal', page: 'login', role: 'student' },
  { label: 'Instructor Portal', page: 'login', role: 'instructor' },
  { label: 'Help / Support', page: 'contact' },
]

export const topBarSocialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook' },
  { label: 'Telegram', href: 'https://telegram.org/', icon: 'telegram' },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
]

export const homeContent = {
  hero: {
    eyebrow: 'MEKDELA AMBA UNIVERSITY',
    title: 'Online Assignment Submission and Evaluation System',
    description:
      'A connected academic workspace for submitting coursework, reviewing progress, and sharing timely feedback.',
  },
  about: {
    title: 'A clearer path from assignment to feedback',
    paragraphs: [
      'The Online Assignment Submission and Evaluation System supports the academic community at Mekdela Amba University with a shared space for coursework.',
      'Students can keep track of assignments and submit their work online. Instructors can organize submissions, evaluate work, and return grades and feedback through a consistent process.',
    ],
  },
  contact: {
    address: 'Main Campus, Mekdela Amba University',
    phone: '+251 00 000 0000',
    email: 'info@mekdela.edu.et',
    hours: 'Mon-Fri, 8:30 AM - 5:30 PM',
    note: 'Contact details shown here are sample values and should be confirmed by the university.',
  },
}

export const homeFeatures = [
  {
    icon: 'submission',
    title: 'Assignment Submission',
    description: 'Submit coursework online and keep a clear record of each submission.',
  },
  {
    icon: 'grading',
    title: 'Grading',
    description: 'Give instructors a focused workflow for reviewing and grading student work.',
  },
  {
    icon: 'feedback',
    title: 'Feedback',
    description: 'Share useful comments and evaluation results with students in one place.',
  },
  {
    icon: 'notifications',
    title: 'Notifications',
    description: 'Keep assignment deadlines, updates, and important activity visible.',
  },
  {
    icon: 'performance',
    title: 'Performance Tracking',
    description: 'Review submission history and grades to follow academic progress.',
  },
]

export const homeWorkflows = [
  {
    role: 'Students',
    description: 'Follow your coursework from the assignment brief through feedback.',
    steps: ['Register or log in', 'View assignments', 'Submit work', 'Receive grade and feedback'],
  },
  {
    role: 'Instructors',
    description: 'Manage assignments and provide clear, timely evaluations.',
    steps: ['Log in', 'Create assignment', 'Review submissions', 'Grade and give feedback'],
  },
]

export const announcements = [
  {
    date: '2026-10-22',
    title: 'Assignment submission portal is open',
    text: 'Students can use the portal to review active coursework and submit work before each listed deadline.',
    category: 'Assignment Update',
  },
  {
    date: '2026-10-20',
    title: 'Review assignment deadlines',
    text: 'Check your course assignments regularly so you have time to prepare and submit your work.',
    category: 'Academic Notice',
  },
  {
    date: '2026-10-18',
    title: 'Welcome to the online system',
    text: 'The system brings assignment submission, evaluation, and feedback together in one academic workspace.',
    category: 'System Announcement',
  },
]
