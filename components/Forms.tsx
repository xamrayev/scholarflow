import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, FilledInput, Select, TextArea, FileUpload } from './Shared';
import { MOCK_JOURNALS, MOCK_ISSUES, MOCK_ARTICLES } from '../constants';
import { Journal, Issue, Article, Role } from '../types';

// --- Journal Form (Admin Only) ---
export const JournalForm: React.FC<{ isEdit?: boolean }> = ({ isEdit }) => {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const [formData, setFormData] = useState<Partial<Journal>>({
    title: '',
    description: '',
    issn: '',
    field: 'Computer Science',
    publisher: '',
    contactEmail: ''
  });

  useEffect(() => {
    if (isEdit && journalId) {
      // Mock fetch
      const found = MOCK_JOURNALS.find(j => j.id === journalId);
      if (found) setFormData(found);
    }
  }, [isEdit, journalId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Journal ${isEdit ? 'updated' : 'created'} successfully! (Mock)`);
    navigate(isEdit ? `/journal/${journalId}` : '/');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <Card>
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEdit ? 'Edit Journal Settings' : 'Add New Journal'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                {isEdit ? 'Update journal metadata and contact info.' : 'Create a new journal entry in the system.'}
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FilledInput 
                label="Journal Title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                required 
                className="md:col-span-2"
             />
             <FilledInput 
                label="ISSN" 
                value={formData.issn} 
                onChange={e => setFormData({...formData, issn: e.target.value})}
                required 
                placeholder="e.g., 1234-5678"
             />
             <Select 
                label="Academic Field"
                value={formData.field}
                onChange={e => setFormData({...formData, field: e.target.value})}
                options={[
                    { value: 'Computer Science', label: 'Computer Science' },
                    { value: 'Medicine', label: 'Medicine' },
                    { value: 'Physics', label: 'Physics' },
                    { value: 'Economics', label: 'Economics' },
                    { value: 'Biology', label: 'Biology' },
                ]}
             />
             <FilledInput 
                label="Publisher" 
                value={formData.publisher} 
                onChange={e => setFormData({...formData, publisher: e.target.value})}
             />
             <FilledInput 
                label="Contact Email" 
                type="email"
                value={formData.contactEmail} 
                onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                required 
             />
             <div className="md:col-span-2">
                 <TextArea 
                    label="Description"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Scope and aim of the journal..."
                 />
             </div>
             <div className="md:col-span-2">
                <FileUpload label="Cover Image" accept="image/*" />
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button type="button" variant="text" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" variant="filled">{isEdit ? 'Save Changes' : 'Create Journal'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- Issue Form (Admin/Editor) ---
export const IssueForm: React.FC<{ isEdit?: boolean }> = ({ isEdit }) => {
    const navigate = useNavigate();
    const { journalId, issueId } = useParams();
    const [formData, setFormData] = useState<Partial<Issue>>({
        volume: undefined,
        number: undefined,
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        if (isEdit && issueId) {
             const found = MOCK_ISSUES.find(i => i.id === issueId);
             if (found) setFormData(found);
        }
    }, [isEdit, issueId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Issue ${isEdit ? 'updated' : 'created'} successfully! (Mock)`);
        navigate(`/journal/${journalId}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 animate-fade-in">
            <Card>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEdit ? 'Edit Issue Details' : 'Publish New Issue'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <FilledInput 
                            label="Volume" 
                            type="number" 
                            value={formData.volume || ''}
                            onChange={e => setFormData({...formData, volume: parseInt(e.target.value)})}
                            required
                        />
                         <FilledInput 
                            label="Issue Number" 
                            type="number" 
                            value={formData.number || ''}
                            onChange={e => setFormData({...formData, number: parseInt(e.target.value)})}
                            required
                        />
                         <FilledInput 
                            label="Year" 
                            type="number" 
                            value={formData.year || ''}
                            onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                            required
                        />
                        <div className="col-span-2">
                            <FileUpload label="Cover Image" accept="image/*" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="text" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button type="submit" variant="filled">{isEdit ? 'Update Issue' : 'Publish Issue'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

// --- Article Submission Form (Author/Editor) ---
export const ArticleForm: React.FC<{ isEdit?: boolean }> = ({ isEdit }) => {
    const navigate = useNavigate();
    const { journalId, articleId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        authors: '', // Simple string for now "Name (Affiliation); ..."
        status: 'draft',
        keywords: ''
    });

    useEffect(() => {
        if (isEdit && articleId) {
            const found = MOCK_ARTICLES.find(a => a.id === articleId);
            if (found) {
                setFormData({
                    title: found.title,
                    abstract: found.abstract,
                    authors: found.authors.map(a => `${a.name} (${a.affiliation})`).join('; '),
                    status: found.status,
                    keywords: found.keywords.join(', ')
                });
            }
        }
    }, [isEdit, articleId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Manuscript submitted successfully! (Mock)');
        navigate(journalId ? `/journal/${journalId}` : '/');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
             <Card>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isEdit ? 'Edit Manuscript' : 'Submit Manuscript'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Please ensure all authors are listed correctly.
                        </p>
                    </div>
                    {/* Status badge for context */}
                    <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-full">
                        {formData.status}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FilledInput 
                        label="Article Title"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                        placeholder="Full title of the manuscript"
                    />

                    <TextArea 
                        label="Abstract"
                        value={formData.abstract}
                        onChange={e => setFormData({...formData, abstract: e.target.value})}
                        required
                        placeholder="Paste abstract here (max 300 words)..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FilledInput 
                            label="Keywords"
                            value={formData.keywords}
                            onChange={e => setFormData({...formData, keywords: e.target.value})}
                            placeholder="Comma separated (e.g. AI, Machine Learning)"
                            className="md:col-span-2"
                        />
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Authors</label>
                            <p className="text-xs text-gray-500 mb-2">Format: Name (Affiliation); Name (Affiliation)</p>
                            <FilledInput 
                                value={formData.authors}
                                onChange={e => setFormData({...formData, authors: e.target.value})}
                                placeholder="e.g. Jane Doe (MIT); John Smith (Stanford)"
                                required
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Files</h3>
                        <FileUpload label="Manuscript PDF" accept="application/pdf" />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Select 
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                            options={[
                                { value: 'draft', label: 'Save as Draft' },
                                { value: 'pending', label: 'Submit for Review' }
                            ]}
                            className="w-48"
                        />
                        <div className="flex gap-3">
                             <Button type="button" variant="text" onClick={() => navigate(-1)}>Cancel</Button>
                             <Button type="submit" variant="filled">
                                 {formData.status === 'draft' ? 'Save Draft' : 'Submit Manuscript'}
                             </Button>
                        </div>
                    </div>
                </form>
             </Card>
        </div>
    );
};