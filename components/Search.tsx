import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, FilledInput, Button, Autocomplete, Checkbox, Select, Chip } from './Shared';
import { IconSearch, IconFilter, IconCalendar, IconClose } from './Icons';
import { MOCK_ARTICLES, MOCK_JOURNALS } from '../constants';
import { Article, Role, ArticleStatus } from '../types';

interface SearchFilters {
    dateFrom: string;
    dateTo: string;
    journals: string[]; // Journal IDs
    author: string;
    status: ArticleStatus[];
}

export const SearchPage: React.FC<{ role: Role }> = ({ role }) => {
    const navigate = useNavigate();
    
    // State
    const [query, setQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter drawer
    const [filters, setFilters] = useState<SearchFilters>({
        dateFrom: '',
        dateTo: '',
        journals: [],
        author: '',
        status: ['published']
    });
    const [sort, setSort] = useState<'relevance' | 'date_desc' | 'date_asc' | 'title'>('relevance');
    const [results, setResults] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Options for Autocomplete
    const allAuthors = useMemo(() => {
        const set = new Set<string>();
        MOCK_ARTICLES.forEach(a => a.authors.forEach(au => set.add(au.name)));
        return Array.from(set);
    }, []);

    const allJournals = useMemo(() => MOCK_JOURNALS, []);

    // Filter Logic (Simulated AJAX)
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            let filtered = MOCK_ARTICLES;

            // 1. Text Search
            if (query) {
                const lower = query.toLowerCase();
                filtered = filtered.filter(a => 
                    a.title.toLowerCase().includes(lower) || 
                    a.abstract.toLowerCase().includes(lower) ||
                    a.keywords.some(k => k.toLowerCase().includes(lower))
                );
            }

            // 2. Filters
            if (filters.author) {
                filtered = filtered.filter(a => a.authors.some(au => au.name.toLowerCase().includes(filters.author.toLowerCase())));
            }

            if (filters.journals.length > 0) {
                filtered = filtered.filter(a => filters.journals.includes(a.journalId));
            }

            if (filters.dateFrom) {
                filtered = filtered.filter(a => a.publishDate >= filters.dateFrom);
            }
            if (filters.dateTo) {
                filtered = filtered.filter(a => a.publishDate <= filters.dateTo);
            }

            if (filters.status.length > 0) {
                filtered = filtered.filter(a => filters.status.includes(a.status));
            }

            // 3. Sort
            if (sort === 'date_desc') {
                filtered = filtered.sort((a,b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
            } else if (sort === 'date_asc') {
                filtered = filtered.sort((a,b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
            } else if (sort === 'title') {
                filtered = filtered.sort((a,b) => a.title.localeCompare(b.title));
            }

            setResults(filtered);
            setIsLoading(false);
        }, 300); // Simulate network delay

        return () => clearTimeout(timer);
    }, [query, filters, sort]);

    // Handlers
    const toggleStatus = (s: ArticleStatus) => {
        setFilters(prev => {
            if (prev.status.includes(s)) {
                return { ...prev, status: prev.status.filter(st => st !== s) };
            } else {
                return { ...prev, status: [...prev.status, s] };
            }
        });
    };

    const addJournalFilter = (journalTitle: string) => {
        const j = allJournals.find(j => j.title === journalTitle);
        if (j && !filters.journals.includes(j.id)) {
            setFilters(prev => ({ ...prev, journals: [...prev.journals, j.id] }));
        }
    };

    const removeJournalFilter = (journalId: string) => {
        setFilters(prev => ({ ...prev, journals: prev.journals.filter(id => id !== journalId) }));
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Button variant="outlined" onClick={() => setIsFilterOpen(!isFilterOpen)} icon={<IconFilter />} className="w-full">
                    {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`
                ${isFilterOpen ? 'block' : 'hidden'} 
                md:block w-full md:w-72 shrink-0 p-6 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto
            `}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-gray-900 dark:text-white">Filters</h2>
                    <button 
                        onClick={() => setFilters({ dateFrom: '', dateTo: '', journals: [], author: '', status: ['published'] })}
                        className="text-xs text-primary hover:underline"
                    >
                        Clear All
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Status Filter (Role Protected) */}
                    {(role === 'admin' || role === 'editor' || role === 'author') && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Status</h3>
                            <div className="space-y-2">
                                <Checkbox label="Published" checked={filters.status.includes('published')} onChange={() => toggleStatus('published')} />
                                <Checkbox label="Draft" checked={filters.status.includes('draft')} onChange={() => toggleStatus('draft')} />
                                <Checkbox label="Pending Review" checked={filters.status.includes('pending')} onChange={() => toggleStatus('pending')} />
                            </div>
                        </div>
                    )}

                    {/* Date Range */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <IconCalendar /> Publication Date
                        </h3>
                        <div className="space-y-3">
                            <FilledInput 
                                type="date" 
                                label="From" 
                                value={filters.dateFrom} 
                                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} 
                                className="text-sm"
                            />
                            <FilledInput 
                                type="date" 
                                label="To" 
                                value={filters.dateTo} 
                                onChange={(e) => setFilters({...filters, dateTo: e.target.value})} 
                                className="text-sm"
                            />
                        </div>
                    </div>

                    {/* Journals */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Journals</h3>
                        <Autocomplete 
                            placeholder="Type to search journals..." 
                            options={allJournals.map(j => j.title)}
                            onSelect={addJournalFilter}
                            className="mb-3"
                        />
                        <div className="flex flex-wrap gap-2">
                            {filters.journals.map(jid => {
                                const j = allJournals.find(x => x.id === jid);
                                return j ? (
                                    <Chip 
                                        key={jid} 
                                        label={j.title.length > 20 ? j.title.substring(0,20)+'...' : j.title} 
                                        onDelete={() => removeJournalFilter(jid)} 
                                        active
                                    />
                                ) : null;
                            })}
                        </div>
                    </div>

                    {/* Author */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Author</h3>
                        <Autocomplete 
                            placeholder="Find author..." 
                            options={allAuthors}
                            value={filters.author}
                            onChange={(e) => setFilters({...filters, author: e.target.value})}
                            onSelect={(val) => setFilters({...filters, author: val})}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-8 bg-gray-50 dark:bg-background-dark overflow-y-auto">
                {/* Search Bar & Sort */}
                <div className="max-w-4xl mx-auto mb-8 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-grow">
                            <FilledInput 
                                placeholder="Search articles by title, abstract, or keywords..." 
                                icon={<IconSearch />}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="w-48 shrink-0">
                            <Select 
                                options={[
                                    { value: 'relevance', label: 'Relevance' },
                                    { value: 'date_desc', label: 'Newest First' },
                                    { value: 'date_asc', label: 'Oldest First' },
                                    { value: 'title', label: 'Title A-Z' },
                                ]}
                                value={sort}
                                onChange={(e) => setSort(e.target.value as any)}
                            />
                        </div>
                    </div>
                    {/* Active Filters Display (Mobile friendly summary could go here) */}
                </div>

                {/* Results List */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">Searching database...</div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No results found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        results.map(article => {
                            const journal = allJournals.find(j => j.id === article.journalId);
                            return (
                                <Card key={article.id} onClick={() => navigate(`/journal/${article.journalId}/issue/${article.issueId}/article/${article.id}`)} className="group cursor-pointer hover:border-primary">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                        <div>
                                            <div className="text-xs text-primary font-bold uppercase mb-1">{journal?.title}</div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                                {article.abstract}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                                <span>{article.publishDate}</span>
                                                <span>•</span>
                                                <span>{article.authors.map(a => a.name).join(', ')}</span>
                                                {article.status !== 'published' && (
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-2">
                                                        {article.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex items-center">
                                            <Button variant="text" className="text-sm">Read &rarr;</Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};