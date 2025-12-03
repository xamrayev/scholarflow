
import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, FilledInput, TextArea, Accordion, Select } from './Shared';
import { MOCK_LOGS, MOCK_FAQS } from '../constants';
import { IconSearch } from './Icons';
import { Role } from '../types';

// --- Error Page (404 / 403) ---
interface ErrorPageProps {
    code: '404' | '403';
    title: string;
    message: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ code, title, message }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4 select-none">{code}</h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">{message}</p>
            <Button variant="filled" onClick={() => navigate('/')}>Return Home</Button>
        </div>
    );
};

// --- About & Contact Page ---
export const AboutPage: React.FC = () => {
    const [sent, setSent] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-12 animate-fade-in">
            {/* About Section */}
            <section className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About ScholarFlow</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    ScholarFlow is a modern academic journal management system designed to streamline the peer review process, simplify publishing, and make research accessible to everyone. Built with the latest technologies, we bridge the gap between rigorous academic standards and intuitive user experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <h3 className="font-bold text-primary text-xl mb-2">Open Access</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Promoting free and unlimited access to scientific records.</p>
                    </div>
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <h3 className="font-bold text-primary text-xl mb-2">Peer Review</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Robust double-blind review system for quality assurance.</p>
                    </div>
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <h3 className="font-bold text-primary text-xl mb-2">AI Integration</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Leveraging AI for semantic search and content summarization.</p>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Contact Us</h2>
                {sent ? (
                    <div className="text-center p-8 text-green-600 font-medium bg-green-50 rounded-lg">
                        Message sent successfully! We will get back to you shortly.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <FilledInput label="First Name" required />
                            <FilledInput label="Last Name" required />
                        </div>
                        <FilledInput label="Email Address" type="email" required />
                        <TextArea label="Message" required placeholder="How can we help you?" />
                        <Button type="submit" variant="filled" className="w-full">Send Message</Button>
                    </form>
                )}
            </section>
        </div>
    );
};

// --- FAQ & Instructions Page ---
export const FAQPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'author' | 'editor'>('all');

    const filteredFAQs = useMemo(() => {
        if (filter === 'all') return MOCK_FAQS;
        return MOCK_FAQS.filter(f => f.category === filter);
    }, [filter]);

    return (
        <div className="max-w-3xl mx-auto p-6 sm:p-10 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Help Center</h1>
            <p className="text-gray-500 mb-8">Frequently asked questions and guides.</p>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <Button variant={filter === 'all' ? 'filled' : 'outlined'} onClick={() => setFilter('all')} className="!py-1 !px-4 !text-xs rounded-full">All</Button>
                <Button variant={filter === 'author' ? 'filled' : 'outlined'} onClick={() => setFilter('author')} className="!py-1 !px-4 !text-xs rounded-full">For Authors</Button>
                <Button variant={filter === 'editor' ? 'filled' : 'outlined'} onClick={() => setFilter('editor')} className="!py-1 !px-4 !text-xs rounded-full">For Editors</Button>
            </div>

            <div className="space-y-4">
                {filteredFAQs.map(faq => (
                    <Accordion key={faq.id} title={faq.question}>
                        <p>{faq.answer}</p>
                    </Accordion>
                ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Still have questions?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Can't find the answer you're looking for? Please check our detailed documentation or contact support.</p>
                <div className="flex gap-4">
                    <Button variant="outlined" onClick={() => window.open('#', '_blank')}>Documentation</Button>
                    <Button variant="text">Contact Support</Button>
                </div>
            </div>
        </div>
    );
};

// --- Action Logs (Admin) ---
export const ActionLogsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredLogs = MOCK_LOGS.filter(l => 
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Audit Logs</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center gap-4">
                    <div className="w-full max-w-md">
                        <FilledInput 
                            placeholder="Search logs..." 
                            icon={<IconSearch />} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="!py-0"
                        />
                    </div>
                    <Button variant="outlined" onClick={() => alert('Exporting...')}>Export CSV</Button>
                </div>
                
                {/* Mobile View */}
                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                    {filteredLogs.map(log => (
                        <Card key={log.id} className="text-sm !p-4 bg-gray-50 dark:bg-gray-800/50">
                           <div className="flex justify-between text-gray-500 text-xs mb-2">
                             <span>{log.timestamp}</span>
                             <span className="font-mono">{log.userName}</span>
                           </div>
                           <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase">{log.action}</span>
                           </div>
                           <p className="text-gray-700 dark:text-gray-300">{log.details}</p>
                        </Card>
                    ))}
                    {filteredLogs.length === 0 && <div className="text-center text-gray-500">No logs found.</div>}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-mono whitespace-nowrap">{log.timestamp}</td>
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">{log.userName}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase">{log.action}</span>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredLogs.length === 0 && <div className="p-8 text-center text-gray-500">No logs found.</div>}
                </div>
            </div>
        </div>
    );
};

// --- Delete Confirmation Page ---
export const DeleteConfirmationPage: React.FC = () => {
    const { resourceType, resourceId } = useParams();
    const navigate = useNavigate();

    const handleConfirm = () => {
        // Mock API call
        alert(`Successfully deleted ${resourceType} with ID ${resourceId}`);
        navigate('/');
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center p-8 border-t-4 border-t-red-600">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    ⚠️
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Delete {resourceType}?</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Are you sure you want to delete this {resourceType}? This action cannot be undone and will remove all associated data.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirm}>Yes, Delete</Button>
                </div>
            </Card>
        </div>
    );
};
