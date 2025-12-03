
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, FilledInput, Select, Chip } from './Shared';
import { User, Role, Article } from '../types';
import { MOCK_USERS, MOCK_ARTICLES, MOCK_JOURNALS } from '../constants';
import { IconSearch } from './Icons';

// --- User Profile Page ---
export const UserProfile: React.FC<{ role: Role }> = ({ role }) => {
    const navigate = useNavigate();
    
    // In a real app, we'd get the current user from context/auth
    // For demo, we select a mock user based on the current role
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[3]; 

    // Filter articles where this user is an author (matching by name for this mock)
    const myArticles = useMemo(() => {
        return MOCK_ARTICLES.filter(a => a.authors.some(au => au.name === user.name));
    }, [user]);

    // Filter journals for editors (mock logic: assume they manage journals in their field or just all for demo)
    const managedJournals = useMemo(() => {
        if (role !== 'editor') return [];
        return MOCK_JOURNALS.slice(0, 2); // Mock: Editor manages first 2 journals
    }, [role]);

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-blue-800 to-blue-600"></div>
                <div className="px-8 pb-8 flex flex-col md:flex-row items-end md:items-end -mt-12 gap-6">
                    <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-white"
                    />
                    <div className="flex-grow mb-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{user.affiliation}</p>
                    </div>
                    <div className="mb-4 flex gap-3">
                        <Button variant="outlined">Edit Profile</Button>
                        <Button variant="filled">Settings</Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">About</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-gray-500">Email</span>
                                <span className="text-gray-900 dark:text-gray-300">{user.email}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Role</span>
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded uppercase mt-1">
                                    {user.role}
                                </span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Joined</span>
                                <span className="text-gray-900 dark:text-gray-300">Jan 12, 2023</span>
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Activity</h3>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-2xl font-bold text-primary">{myArticles.length}</div>
                                <div className="text-xs text-gray-500">Publications</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-2xl font-bold text-primary">142</div>
                                <div className="text-xs text-gray-500">Citations</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Editor Section */}
                    {role === 'editor' && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Managed Journals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {managedJournals.map(journal => (
                                    <div key={journal.id} onClick={() => navigate(`/journal/${journal.id}`)} className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden shrink-0">
                                                <img src={journal.coverImage} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{journal.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{journal.field}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Author Section */}
                    {(role === 'author' || role === 'editor' || role === 'admin') && (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Submissions</h2>
                                <Button variant="text" className="text-sm" onClick={() => navigate('/journal/j1/submit')}>+ New Submission</Button>
                            </div>
                            
                            {myArticles.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
                                    No submissions found. Start writing!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myArticles.map(article => (
                                        <div key={article.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {article.status}
                                                </span>
                                                <span className="text-xs text-gray-500">{article.publishDate}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 hover:text-primary cursor-pointer" onClick={() => navigate(`/journal/${article.journalId}/issue/${article.issueId}/article/${article.id}`)}>
                                                {article.title}
                                            </h3>
                                            <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <Button variant="outlined" className="!py-1 !px-3 !text-xs" onClick={() => navigate(`/submit/${article.id}`)}>Edit</Button>
                                                <Button variant="text" className="!py-1 !px-3 !text-xs text-red-600 hover:bg-red-50">Withdraw</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Admin User Management Page ---
export const AdminUserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('All');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User>>({});

    const filteredUsers = useMemo(() => {
        let res = users;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            res = res.filter(u => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower));
        }
        if (filterRole !== 'All') {
            res = res.filter(u => u.role === filterRole);
        }
        return res;
    }, [users, searchTerm, filterRole]);

    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser.id) {
            // Update
            setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...currentUser } as User : u));
        } else {
            // Create
            const newUser = { ...currentUser, id: `u${Date.now()}`, avatar: `https://ui-avatars.com/api/?name=${currentUser.name}&background=random` } as User;
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-sm text-gray-500">Manage system access and roles</p>
                </div>
                <Button variant="filled" onClick={() => { setCurrentUser({ role: 'guest' }); setIsModalOpen(true); }}>
                    + Add User
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <FilledInput 
                        placeholder="Search users by name or email..." 
                        icon={<IconSearch />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select 
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        options={[
                            { value: 'All', label: 'All Roles' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'editor', label: 'Editor' },
                            { value: 'author', label: 'Author' },
                            { value: 'guest', label: 'Guest' },
                        ]}
                    />
                </div>
            </div>

            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredUsers.map(user => (
                    <Card key={user.id} className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                  user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                                  user.role === 'author' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                            `}>
                                {user.role}
                            </span>
                            <span className="text-xs text-gray-500">{user.affiliation}</span>
                        </div>
                        <div className="flex justify-end gap-3 mt-1">
                            <Button variant="text" className="!px-2 h-8 text-xs" onClick={() => handleEdit(user)}>Edit</Button>
                            <Button variant="text" className="!px-2 h-8 text-xs text-red-600" onClick={() => handleDelete(user.id)}>Delete</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Affiliation</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                              user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                                              user.role === 'author' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                                        `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{user.affiliation}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-lg md:rounded-t-none border border-t-0 border-gray-200 dark:border-gray-700">No users found.</div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <Card className="relative w-full max-w-md bg-white dark:bg-gray-900 z-10 p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{currentUser.id ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <FilledInput 
                                label="Full Name" 
                                value={currentUser.name || ''} 
                                onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                                required
                            />
                            <FilledInput 
                                label="Email Address" 
                                type="email"
                                value={currentUser.email || ''} 
                                onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                                required
                            />
                            <Select 
                                label="Role"
                                value={currentUser.role}
                                onChange={e => setCurrentUser({...currentUser, role: e.target.value as Role})}
                                options={[
                                    { value: 'guest', label: 'Guest' },
                                    { value: 'author', label: 'Author' },
                                    { value: 'editor', label: 'Editor' },
                                    { value: 'admin', label: 'Administrator' },
                                ]}
                            />
                             <FilledInput 
                                label="Affiliation" 
                                value={currentUser.affiliation || ''} 
                                onChange={e => setCurrentUser({...currentUser, affiliation: e.target.value})}
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="text" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" variant="filled">Save User</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};
