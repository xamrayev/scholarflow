
export interface Author {
  id: string;
  name: string;
  affiliation: string;
}

export type ArticleStatus = 'draft' | 'pending' | 'under_review' | 'published' | 'rejected';

export interface Article {
  id: string;
  title: string;
  authors: Author[];
  abstract: string;
  publishDate: string;
  keywords: string[];
  pdfUrl?: string; // Mock URL
  pageRange: string;
  issueId: string;
  journalId: string;
  status: ArticleStatus;
}

export interface Issue {
  id: string;
  volume: number;
  number: number;
  year: number;
  coverImage?: string;
  journalId: string;
}

export interface Journal {
  id: string;
  title: string;
  description: string;
  issn: string;
  field: string;
  publisher: string;
  coverImage: string;
  contactEmail: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  affiliation: string;
  avatar?: string;
}

export interface LogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'author' | 'editor' | 'general';
}

export type ViewState = 'home' | 'journal' | 'issue' | 'article';

export type Role = 'guest' | 'author' | 'editor' | 'admin';

export interface RouteParams {
  journalId?: string;
  issueId?: string;
  articleId?: string;
}
