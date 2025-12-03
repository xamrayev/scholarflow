
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { TopAppBar, NavigationDrawer } from './components/Layout';
import { Card, Button, FilledInput, Select, Chip } from './components/Shared';
import { IconSearch, IconFilter, IconAutoAwesome, IconDownload } from './components/Icons';
import { MOCK_JOURNALS, MOCK_ISSUES, MOCK_ARTICLES } from './constants';
import { Journal, Issue, Article, Role } from './types';
import { summarizeContent, semanticSearch } from './services/geminiService';
import { JournalForm, IssueForm, ArticleForm } from './components/Forms';
import { SearchPage } from './components/Search';
import { UserProfile, AdminUserList } from './components/Users';
import { ErrorPage, AboutPage, FAQPage, ActionLogsPage, DeleteConfirmationPage } from './components/Auxiliary';

// --- Home Page ---
const HomePage: React.FC<{ role: Role }> = ({ role }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('All');
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>(MOCK_JOURNALS);
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  // Extract unique fields
  const fields = useMemo(() => ['All', ...Array.from(new Set(MOCK_JOURNALS.map(j => j.field)))], []);

  // Filter Logic
  useEffect(() => {
    let result = MOCK_JOURNALS;
    
    // 1. Text Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(lower) || 
        j.description.toLowerCase().includes(lower)
      );
    }

    // 2. Field Filter
    if (selectedField !== 'All') {
      result = result.filter(j => j.field === selectedField);
    }

    setFilteredJournals(result);
  }, [searchTerm, selectedField]);

  const handleAISearch = async () => {
    if (!searchTerm) return;
    setIsSearchingAI(true);
    const journalNames = MOCK_JOURNALS.map(j => j.title);
    const relevantTitles = await semanticSearch(searchTerm, journalNames);
    
    if (relevantTitles.length > 0) {
      const matched = MOCK_JOURNALS.filter(j => relevantTitles.includes(j.title));
      setFilteredJournals(matched);
      setSelectedField('All'); 
    }
    setIsSearchingAI(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Admin Quick Action */}
      {role === 'admin' && (
          <div className="flex justify-end gap-3">
              <Button onClick={() => navigate('/admin/logs')} variant="text">View Logs</Button>
              <Button onClick={() => navigate('/admin/users')} variant="outlined">Manage Users</Button>
              <Button onClick={() => navigate('/admin/journal/new')} variant="filled">+ Add New Journal</Button>
          </div>
      )}

      {/* Search Header */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Journal Directory</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
             <FilledInput 
               label="Search Journals" 
               placeholder="Enter journal name, ISSN, or keywords..."
               value={searchTerm} 
               onChange={(e) => setSearchTerm(e.target.value)}
               icon={<IconSearch />}
               onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
             />
          </div>
          <div className="md:col-span-3">
             <Select 
                label="Academic Field"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                options={fields.map(f => ({ value: f, label: f }))}
             />
          </div>
          <div className="md:col-span-3">
             <Button variant="tonal" onClick={handleAISearch} disabled={isSearchingAI} icon={<IconAutoAwesome />} className="w-full h-[42px]">
               {isSearchingAI ? 'Analyzing...' : 'AI Semantic Search'}
             </Button>
          </div>
        </div>
        <div className="mt-4 text-right">
             <button onClick={() => navigate('/search')} className="text-sm text-primary font-medium hover:underline">Go to Advanced Article Search &rarr;</button>
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredJournals.map(journal => (
          <Card key={journal.id} onClick={() => navigate(`/journal/${journal.id}`)} className="flex flex-col h-full group hover:border-primary relative">
            {role === 'admin' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/admin/journal/${journal.id}/edit`); }}
                  className="absolute top-2 right-2 bg-white/90 text-gray-700 px-2 py-1 rounded text-xs hover:bg-white border shadow-sm z-10"
                >
                    Edit
                </button>
            )}
            <div className="h-32 w-full overflow-hidden rounded-md bg-gray-100 mb-4 border border-gray-100">
               <img src={journal.coverImage} alt={journal.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"/>
            </div>
            <div className="flex flex-col flex-grow">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{journal.field}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">{journal.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">{journal.description}</p>
              <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">ISSN: {journal.issn}</span>
                <span className="text-sm font-medium text-primary group-hover:underline">Access &rarr;</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Journal Page ---
const JournalPage: React.FC<{ role: Role }> = ({ role }) => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const journal = MOCK_JOURNALS.find(j => j.id === journalId);
  const issues = MOCK_ISSUES.filter(i => i.journalId === journalId).sort((a,b) => b.year - a.year);
  const [activeTab, setActiveTab] = useState<'issues' | 'about'>('issues');

  if (!journal) return <div className="p-8 text-center text-gray-500">Journal not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Journal Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-8 mb-8 relative">
        {(role === 'admin' || role === 'editor') && (
            <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="outlined" className="!py-1 !px-3 !text-xs" onClick={() => navigate(`/admin/journal/${journalId}/edit`)}>Edit Journal</Button>
                <Button variant="filled" className="!py-1 !px-3 !text-xs" onClick={() => navigate(`/admin/journal/${journalId}/issue/new`)}>+ New Issue</Button>
            </div>
        )}
        <div className="shrink-0">
             <img src={journal.coverImage} className="w-40 h-56 object-cover rounded shadow-md border border-gray-200" alt="Cover" />
        </div>
        <div className="flex-grow flex flex-col justify-between pt-6 md:pt-0">
          <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold uppercase">{journal.field}</span>
                <span className="text-gray-500 text-sm">ISSN: {journal.issn}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{journal.title}</h1>
              <p className="text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed">{journal.description}</p>
          </div>
          <div className="flex gap-4 mt-6">
             <Button variant="filled" onClick={() => navigate(`/journal/${journalId}/submit`)}>Submit Manuscript</Button>
             <Button variant="outlined">Subscribe</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('issues')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'issues' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Browse Issues
        </button>
        <button 
           onClick={() => setActiveTab('about')}
           className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'about' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Editorial Board & Info
        </button>
      </div>

      {/* Content */}
      {activeTab === 'issues' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Volumes & Issues</h3>
             <div className="text-sm text-gray-500">Sorted by Year (Desc)</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {issues.map(issue => (
               <Card key={issue.id} onClick={() => navigate(`/journal/${journalId}/issue/${issue.id}`)} className="group cursor-pointer hover:ring-2 hover:ring-primary/20 relative">
                 {(role === 'admin' || role === 'editor') && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/journal/${journalId}/issue/${issue.id}/edit`); }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary"
                     >
                         <span className="sr-only">Edit</span>
                         ✏️
                     </button>
                 )}
                 <div className="flex items-start gap-3">
                    <div className="w-12 h-16 bg-gray-200 rounded shrink-0 overflow-hidden border border-gray-300">
                        <img src={issue.coverImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white">Vol. {issue.volume}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Issue {issue.number}</div>
                        <div className="text-xs text-gray-400 mt-1">{issue.year}</div>
                    </div>
                 </div>
               </Card>
             ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
           <div className="grid md:grid-cols-2 gap-8">
               <div>
                   <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Publication Details</h3>
                   <div className="space-y-4 text-sm">
                       <div>
                           <span className="block text-gray-500">Publisher</span>
                           <span className="font-medium">{journal.publisher}</span>
                       </div>
                       <div>
                           <span className="block text-gray-500">Frequency</span>
                           <span className="font-medium">Quarterly</span>
                       </div>
                       <div>
                           <span className="block text-gray-500">Primary Language</span>
                           <span className="font-medium">English</span>
                       </div>
                   </div>
               </div>
               <div>
                   <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Contact</h3>
                   <div className="space-y-2 text-sm">
                       <p>For editorial inquiries, please contact:</p>
                       <a href={`mailto:${journal.contactEmail}`} className="text-primary hover:underline">{journal.contactEmail}</a>
                       <p className="mt-4 text-gray-500">
                           123 Science Park Drive<br/>
                           Innovation City, 90210
                       </p>
                   </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Issue Page ---
const IssuePage: React.FC<{ role: Role }> = ({ role }) => {
  const { journalId, issueId } = useParams();
  const navigate = useNavigate();
  const issue = MOCK_ISSUES.find(i => i.id === issueId);
  const journal = MOCK_JOURNALS.find(j => j.id === journalId);
  
  // Sorting State
  const [sortMethod, setSortMethod] = useState<'page' | 'title'>('page');

  if (!issue || !journal) return <div>Issue not found</div>;

  const articles = useMemo(() => {
      let list = MOCK_ARTICLES.filter(a => a.issueId === issueId);
      if (sortMethod === 'title') {
          return list.sort((a,b) => a.title.localeCompare(b.title));
      }
      return list; 
  }, [issueId, sortMethod]);

  return (
     <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <Button variant="text" icon={<span className="text-xl">&larr;</span>} onClick={() => navigate(`/journal/${journalId}`)} className="mb-4 pl-0">
            Back to Journal
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
               <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Volume {issue.volume}, Issue {issue.number}</h2>
               <p className="text-gray-600 dark:text-gray-400 mt-1">{journal.title} &bull; {issue.year}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
                 {(role === 'admin' || role === 'editor') && (
                    <Button variant="outlined" onClick={() => navigate(`/admin/journal/${journalId}/issue/${issueId}/edit`)}>Edit Issue</Button>
                 )}
                <Select 
                    options={[
                        { value: 'page', label: 'Sort by Page Number' },
                        { value: 'title', label: 'Sort by Title' }
                    ]}
                    value={sortMethod}
                    onChange={(e) => setSortMethod(e.target.value as any)}
                />
            </div>
        </div>

        <div className="space-y-4">
           {articles.length === 0 ? <p className="text-gray-500 italic p-4 text-center">No articles listed yet.</p> : null}
           {articles.map(article => (
             <div key={article.id} onClick={() => navigate(`/journal/${journalId}/issue/${issueId}/article/${article.id}`)} className="group cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all relative">
                {(role === 'admin' || role === 'editor' || role === 'author') && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/submit/${article.id}`); }} // Mock edit for author too
                        className="absolute top-4 right-4 text-xs text-gray-400 hover:text-primary z-10"
                     >
                         Edit Article
                     </button>
                 )}
                 {(role === 'admin' || role === 'editor') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/confirm-delete/article/${article.id}`); }}
                        className="absolute top-4 right-20 text-xs text-red-400 hover:text-red-600 z-10"
                      >
                          Delete
                      </button>
                 )}
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                   <div className="flex-grow">
                     <div className="flex gap-2 mb-2">
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Research Article</span>
                         {article.keywords.slice(0,2).map(k => (
                             <span key={k} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 rounded-full">{k}</span>
                         ))}
                         {article.status && article.status !== 'published' && (
                             <span className="text-xs bg-yellow-100 text-yellow-800 px-2 rounded-full uppercase">{article.status}</span>
                         )}
                     </div>
                     <h3 className="text-xl font-bold text-primary dark:text-blue-400 mb-2 group-hover:underline">{article.title}</h3>
                     <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                       {article.authors.map(a => a.name).join(', ')}
                     </p>
                   </div>
                   <div className="shrink-0 text-right">
                       <span className="block text-sm font-mono text-gray-500">pp. {article.pageRange}</span>
                       <Button variant="text" className="mt-2 text-sm !px-0">Abstract &darr;</Button>
                   </div>
                </div>
             </div>
           ))}
        </div>
     </div>
  );
};

// --- Article Page ---
const ArticlePage: React.FC<{ role: Role }> = ({ role }) => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const article = MOCK_ARTICLES.find(a => a.id === articleId);
  const journal = MOCK_JOURNALS.find(j => j.id === article?.journalId);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  if (!article) return <div>Article not found</div>;

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const result = await summarizeContent(article.abstract);
    setSummary(result);
    setLoadingSummary(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
       {/* Meta Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
             <span className="font-semibold text-primary dark:text-blue-400">{journal?.title}</span>
             <span>&bull;</span>
             <span>{article.publishDate}</span>
             <span>&bull;</span>
             <span>pp. {article.pageRange}</span>
             {(role === 'editor' || role === 'admin') && (
                 <span 
                    className="text-red-500 cursor-pointer ml-auto hover:underline" 
                    onClick={() => navigate(`/confirm-delete/article/${articleId}`)}
                 >
                    Delete Article
                 </span>
             )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{article.title}</h1>
        
        <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-grow">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Authors</h3>
                <div className="flex flex-col gap-2">
                {article.authors.map(a => (
                    <div key={a.id} className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-900 dark:text-gray-200 underline decoration-dotted">{a.name}</span>
                        <span className="text-gray-500 italic">- {a.affiliation}</span>
                    </div>
                ))}
                </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
                <Button variant="filled" icon={<IconDownload />} className="w-full justify-center">Download PDF</Button>
                <Button 
                variant="tonal" 
                icon={<IconAutoAwesome />} 
                onClick={handleSummarize}
                disabled={loadingSummary}
                className="w-full justify-center"
                >
                {loadingSummary ? 'Thinking...' : 'AI Summary'}
                </Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
             {/* AI Summary Section */}
            {summary && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-6 rounded-r-lg">
                    <h3 className="text-primary font-bold flex items-center gap-2 mb-3">
                        <IconAutoAwesome /> AI Generated Summary
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm">{summary}</p>
                </div>
            )}

            {/* Abstract */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Abstract</h2>
                <div className="article-text text-gray-700 dark:text-gray-300 leading-8 text-lg text-justify">
                    {article.abstract}
                </div>
            </section>
            
            {/* Keywords */}
            <section>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                    {article.keywords.map(k => (
                        <Chip key={k} label={k} />
                    ))}
                </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Metrics</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between"><span>Views</span> <span>1,204</span></div>
                      <div className="flex justify-between"><span>Downloads</span> <span>432</span></div>
                      <div className="flex justify-between"><span>Citations</span> <span>12</span></div>
                  </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Related References</h3>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-3">
                    <li className="hover:text-primary cursor-pointer">Smith, J. et al. (2022). Foundations of AI. <i>Journal of Tech</i>.</li>
                    <li className="hover:text-primary cursor-pointer">Doe, R. (2021). The Future of Medicine. <i>MedPress</i>.</li>
                    <li className="hover:text-primary cursor-pointer">Zhang, Y. (2023). Quantum Leaps. <i>Physics Today</i>.</li>
                </ul>
              </div>
          </div>
      </div>
    </div>
  );
};

interface NavigationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: 'home') => void;
    role: Role;
    setRole: (r: Role) => void;
  }
  
  const RoleAwareDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose, onNavigate, role, setRole }) => {
    const navigate = useNavigate();
    return (
      <>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-gray-900/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={onClose}
        />
        {/* Drawer */}
        <div className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-900 z-50 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
            <h2 className="text-xl font-bold text-primary dark:text-blue-400">ScholarFlow</h2>
            <p className="text-xs text-gray-500 mt-1">Academic Journal System</p>
          </div>
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => { onNavigate('home'); onClose(); }}
              className="w-full flex items-center gap-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
               <span>Journals</span>
            </button>
             <button 
              onClick={() => { navigate('/search'); onClose(); }}
              className="w-full flex items-center gap-4 p-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
               <span>Search Articles</span>
            </button>
            <button 
              onClick={() => { navigate('/about'); onClose(); }}
              className="w-full flex items-center gap-4 p-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
               <span>About Us</span>
            </button>
            <button 
              onClick={() => { navigate('/faq'); onClose(); }}
              className="w-full flex items-center gap-4 p-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
               <span>FAQ</span>
            </button>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
               User Tools
            </div>
            
            {(role === 'author' || role === 'editor' || role === 'admin') && (
                <button 
                    onClick={() => { navigate('/profile'); onClose(); }}
                    className="w-full flex items-center gap-4 p-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <span>My Profile</span>
                </button>
            )}
            
            {role === 'admin' && (
                <>
                <button 
                    onClick={() => { navigate('/admin/users'); onClose(); }}
                    className="w-full flex items-center gap-4 p-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <span>User Management</span>
                </button>
                <button 
                    onClick={() => { navigate('/admin/logs'); onClose(); }}
                    className="w-full flex items-center gap-4 p-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <span>System Logs</span>
                </button>
                </>
            )}
            
            {/* Role Switcher for Demo */}
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">View As (Demo)</label>
                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full p-2 text-sm border rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
                >
                    <option value="guest">Guest</option>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
          </nav>
        </div>
      </>
    );
  };

// --- Main App Wrapper ---
const AppContent: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState<Role>('guest'); // Default Role
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Determine Title based on route
  const getTitle = () => {
    if (location.pathname.includes('/admin/journal/new')) return 'Create Journal';
    if (location.pathname.includes('/edit')) return 'Edit Mode';
    if (location.pathname.includes('/submit')) return 'Submit Manuscript';
    if (location.pathname.includes('/article/')) return 'Article Viewer';
    if (location.pathname.includes('/issue/')) return 'Issue Details';
    if (location.pathname.includes('/journal/')) return 'Journal Profile';
    if (location.pathname.includes('/search')) return 'Advanced Search';
    if (location.pathname.includes('/profile')) return 'My Profile';
    if (location.pathname.includes('/admin/users')) return 'User Management';
    if (location.pathname.includes('/admin/logs')) return 'System Logs';
    if (location.pathname.includes('/about')) return 'About Us';
    if (location.pathname.includes('/faq')) return 'FAQ';
    if (location.pathname.includes('/confirm-delete')) return 'Confirm Deletion';
    return 'ScholarFlow';
  };

  const showBack = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col">
      <TopAppBar 
        title={getTitle()} 
        onMenuClick={() => setDrawerOpen(true)}
        showBack={showBack}
        onBackClick={() => navigate(-1)}
        toggleTheme={() => setDarkMode(!darkMode)}
        isDark={darkMode}
        onHomeClick={() => navigate('/')}
      />
      
      <RoleAwareDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        onNavigate={(view) => navigate('/')}
        role={role}
        setRole={setRole}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage role={role} />} />
          <Route path="/search" element={<SearchPage role={role} />} />
          <Route path="/journal/:journalId" element={<JournalPage role={role} />} />
          <Route path="/journal/:journalId/issue/:issueId" element={<IssuePage role={role} />} />
          <Route path="/journal/:journalId/issue/:issueId/article/:articleId" element={<ArticlePage role={role} />} />
          
          {/* User & Admin Routes */}
          <Route path="/profile" element={<UserProfile role={role} />} />
          <Route path="/admin/users" element={<AdminUserList />} />
          <Route path="/admin/logs" element={<ActionLogsPage />} />
          
          {/* Form Routes */}
          <Route path="/admin/journal/new" element={<JournalForm />} />
          <Route path="/admin/journal/:journalId/edit" element={<JournalForm isEdit />} />
          <Route path="/admin/journal/:journalId/issue/new" element={<IssueForm />} />
          <Route path="/admin/journal/:journalId/issue/:issueId/edit" element={<IssueForm isEdit />} />
          <Route path="/journal/:journalId/submit" element={<ArticleForm />} />
          <Route path="/submit/:articleId" element={<ArticleForm isEdit />} />
          
          {/* Auxiliary Routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/confirm-delete/:resourceType/:resourceId" element={<DeleteConfirmationPage />} />
          
          {/* Error Routes */}
          <Route path="*" element={<ErrorPage code="404" title="Page Not Found" message="The page you are looking for does not exist or has been moved." />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500">
         <p>&copy; 2024 ScholarFlow. All rights reserved.</p>
         <div className="flex justify-center gap-4 mt-2">
             <span onClick={() => navigate('/about')} className="hover:text-primary cursor-pointer">About</span>
             <span onClick={() => navigate('/faq')} className="hover:text-primary cursor-pointer">Help</span>
             <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
         </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
