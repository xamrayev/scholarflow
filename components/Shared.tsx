
import React, { useState, useRef, useEffect } from 'react';

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-surface dark:bg-surface-darkVariant rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 ${onClick ? 'cursor-pointer hover:border-primary/50' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'tonal' | 'danger';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'filled', icon, className = '', ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    filled: "bg-primary text-white hover:bg-primary-dark shadow-sm",
    outlined: "border border-gray-300 dark:border-gray-600 text-primary dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/5",
    text: "text-primary dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3",
    tonal: "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const FilledInput: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input 
          className={`block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm py-2.5 ${icon ? 'pl-10' : 'pl-3'}`}
          placeholder={props.placeholder || label}
          {...props}
        />
      </div>
    </div>
  );
};

// --- Autocomplete ---
interface AutocompleteProps extends Omit<InputProps, 'onSelect'> {
    options: string[];
    onSelect: (value: string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({ options, onSelect, className, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [matches, setMatches] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Filter options when input value changes
    useEffect(() => {
        if (!props.value || typeof props.value !== 'string') {
            setMatches([]);
            return;
        }
        const lower = props.value.toLowerCase();
        const filtered = options.filter(opt => opt.toLowerCase().includes(lower));
        setMatches(filtered);
    }, [props.value, options]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <FilledInput
                {...props}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                    setIsOpen(true);
                    props.onChange && props.onChange(e);
                }}
            />
            {isOpen && matches.length > 0 && (
                <ul className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
                    {matches.map((match, idx) => (
                        <li 
                            key={idx}
                            onClick={() => {
                                onSelect(match);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-900 dark:text-white"
                        >
                            {match}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- Text Area ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <textarea
        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3 min-h-[120px]"
        {...props}
      />
    </div>
  );
};

// --- File Upload ---
interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-primary cursor-pointer bg-gray-50 dark:bg-gray-800/50">
        <div className="space-y-1 text-center">
          <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
              <span>Upload a file</span>
              <input type="file" className="sr-only" {...props} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
    <div className={`relative ${className}`}>
        {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
        <select 
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
            {...props}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

// --- Checkbox ---
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => (
    <div className={`flex items-center ${className}`}>
        <input 
            type="checkbox" 
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
            {...props} 
        />
        <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            {label}
        </label>
    </div>
);

// --- Chip ---
export const Chip: React.FC<{ label: string; active?: boolean; onClick?: () => void; onDelete?: () => void }> = ({ label, active, onClick, onDelete }) => (
  <div 
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
      active 
        ? 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-100' 
        : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100'
    }`}
  >
    <span>{label}</span>
    {onDelete && (
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }} 
            className="ml-2 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        </button>
    )}
  </div>
);

// --- Accordion ---
interface AccordionProps {
    title: string;
    children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mb-2">
            <button 
                className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                </span>
            </button>
            <div 
                className={`bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 p-4 border-t border-gray-200 dark:border-gray-700' : 'max-h-0'}`}
            >
                {children}
            </div>
        </div>
    );
};
