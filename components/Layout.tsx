import React from 'react';
import { IconMenu, IconArrowBack, IconDarkMode, IconLightMode } from './Icons';

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
  onBackClick?: () => void;
  showBack?: boolean;
  toggleTheme: () => void;
  isDark: boolean;
  onHomeClick?: () => void;
}

export const TopAppBar: React.FC<TopBarProps> = ({ 
  title, 
  onMenuClick, 
  onBackClick, 
  showBack,
  toggleTheme,
  isDark,
  onHomeClick
}) => {
  return (
    <div className="sticky top-0 z-50 w-full h-[60px] bg-primary text-white shadow-md flex items-center px-4 justify-between">
      <div className="flex items-center gap-4 overflow-hidden">
        {showBack ? (
          <button onClick={onBackClick} className="p-2 rounded-full hover:bg-white/10 transition-colors shrink-0">
            <IconArrowBack />
          </button>
        ) : (
          <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-white/10 transition-colors shrink-0">
            <IconMenu />
          </button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <h1 
            onClick={onHomeClick} 
            className="text-lg font-bold tracking-wide cursor-pointer hover:text-white/80 transition-colors whitespace-nowrap shrink-0"
          >
            ScholarFlow
          </h1>
          {title !== 'ScholarFlow' && (
            <>
              <span className="text-white/40 hidden sm:inline shrink-0">|</span>
              <span className="text-sm sm:text-lg font-normal truncate text-white/90">{title}</span>
            </>
          )}
        </div>
      </div>
      <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10 transition-colors shrink-0">
        {isDark ? <IconLightMode /> : <IconDarkMode />}
      </button>
    </div>
  );
};

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'home') => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
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
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
             User Tools
          </div>
          <button className="w-full flex items-center gap-4 p-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
             Saved Articles
          </button>
          <button className="w-full flex items-center gap-4 p-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
             My Submissions
          </button>
        </nav>
      </div>
    </>
  );
};