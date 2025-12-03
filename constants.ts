
import { Journal, Issue, Article, User, LogEntry, FAQItem } from './types';

export const MOCK_JOURNALS: Journal[] = [
  {
    id: 'j1',
    title: 'Journal of Advanced Artificial Intelligence',
    description: 'A leading peer-reviewed journal covering machine learning, neural networks, and cognitive computing.',
    issn: '2045-1234',
    field: 'Computer Science',
    publisher: 'TechScience Press',
    coverImage: 'https://picsum.photos/400/600?random=1',
    contactEmail: 'editor@jaai.org'
  },
  {
    id: 'j2',
    title: 'Modern Medical Research',
    description: 'Clinical studies, reviews, and updates in general medicine and specialized healthcare fields.',
    issn: '1098-7654',
    field: 'Medicine',
    publisher: 'HealthCorp Global',
    coverImage: 'https://picsum.photos/400/600?random=2',
    contactEmail: 'submit@modmed.com'
  },
  {
    id: 'j3',
    title: 'Quantum Physics Review',
    description: 'Exploring the fundamental nature of reality through quantum mechanics and theoretical physics.',
    issn: '5544-3322',
    field: 'Physics',
    publisher: 'Universe Publishing',
    coverImage: 'https://picsum.photos/400/600?random=3',
    contactEmail: 'quantum@physicsreview.net'
  },
  {
    id: 'j4',
    title: 'Global Economics Quarterly',
    description: 'Analysis of global market trends, macroeconomics, and fiscal policy.',
    issn: '9988-7766',
    field: 'Economics',
    publisher: 'EconWorld',
    coverImage: 'https://picsum.photos/400/600?random=4',
    contactEmail: 'info@geq.org'
  }
];

export const MOCK_ISSUES: Issue[] = [
  { id: 'i1', volume: 12, number: 1, year: 2024, journalId: 'j1', coverImage: 'https://picsum.photos/300/400?random=10' },
  { id: 'i2', volume: 11, number: 4, year: 2023, journalId: 'j1', coverImage: 'https://picsum.photos/300/400?random=11' },
  { id: 'i3', volume: 45, number: 2, year: 2024, journalId: 'j2', coverImage: 'https://picsum.photos/300/400?random=12' },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'Transformer Architectures in Low-Resource Languages',
    authors: [
      { id: 'au1', name: 'Dr. Jane Smith', affiliation: 'MIT' },
      { id: 'au2', name: 'John Doe', affiliation: 'Stanford' }
    ],
    abstract: 'This paper explores the efficacy of transformer models when applied to languages with limited training datasets. We propose a new transfer learning technique that improves accuracy by 15%.',
    publishDate: '2024-03-15',
    keywords: ['NLP', 'Transformers', 'AI'],
    pageRange: '12-24',
    issueId: 'i1',
    journalId: 'j1',
    status: 'published'
  },
  {
    id: 'a2',
    title: 'Ethical Implications of AGI',
    authors: [
      { id: 'au3', name: 'Sarah Connor', affiliation: 'Tech Ethics Board' }
    ],
    abstract: 'As we approach Artificial General Intelligence, the alignment problem becomes critical. This article surveys current alignment strategies and proposes a multi-layered safety framework.',
    publishDate: '2024-03-20',
    keywords: ['AGI', 'Ethics', 'Safety'],
    pageRange: '25-34',
    issueId: 'i1',
    journalId: 'j1',
    status: 'published'
  },
  {
    id: 'a3',
    title: 'CRISPR Advances in 2023',
    authors: [
      { id: 'au4', name: 'Dr. House', affiliation: 'Princeton Plainsboro' }
    ],
    abstract: 'A review of the major breakthroughs in gene editing utilizing CRISPR-Cas9 technologies over the past year, focusing on therapeutic applications for hereditary diseases.',
    publishDate: '2024-02-10',
    keywords: ['Genetics', 'CRISPR', 'Medicine'],
    pageRange: '100-115',
    issueId: 'i3',
    journalId: 'j2',
    status: 'published'
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'System Admin', email: 'admin@scholarflow.com', role: 'admin', affiliation: 'ScholarFlow HQ', avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=0D8ABC&color=fff' },
  { id: 'u2', name: 'Dr. Jane Smith', email: 'jane@mit.edu', role: 'author', affiliation: 'MIT', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random' },
  { id: 'u3', name: 'Editor John', email: 'john@journal.org', role: 'editor', affiliation: 'Science Press', avatar: 'https://ui-avatars.com/api/?name=Editor+John&background=random' },
  { id: 'u4', name: 'Guest User', email: 'guest@example.com', role: 'guest', affiliation: 'Independent', avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=random' },
];

export const MOCK_LOGS: LogEntry[] = [
    { id: 'l1', userId: 'u1', userName: 'System Admin', action: 'Create Journal', details: 'Created "Journal of AI"', timestamp: '2024-03-25 10:30 AM' },
    { id: 'l2', userId: 'u2', userName: 'Dr. Jane Smith', action: 'Submit Article', details: 'Submitted "Transformers..."', timestamp: '2024-03-24 14:15 PM' },
    { id: 'l3', userId: 'u3', userName: 'Editor John', action: 'Update Issue', details: 'Updated Vol 12, Issue 1', timestamp: '2024-03-23 09:00 AM' },
    { id: 'l4', userId: 'u1', userName: 'System Admin', action: 'Delete User', details: 'Deleted user "SpamBot"', timestamp: '2024-03-22 16:45 PM' },
];

export const MOCK_FAQS: FAQItem[] = [
    { id: 'f1', category: 'general', question: 'How do I subscribe to a journal?', answer: 'You can subscribe by navigating to the journal page and clicking the "Subscribe" button. Some journals are open access and do not require subscription.' },
    { id: 'f2', category: 'author', question: 'How do I submit an article?', answer: 'Register as an author, navigate to the target journal, and click "Submit Manuscript". You will need to upload a PDF and provide metadata.' },
    { id: 'f3', category: 'editor', question: 'How do I review submissions?', answer: 'Log in to your dashboard. Pending submissions will appear in your "My Profile" page under "Managed Journals".' },
    { id: 'f4', category: 'general', question: 'Is the review process double-blind?', answer: 'Yes, most of our journals follow a double-blind peer review process to ensure impartiality.' },
];
