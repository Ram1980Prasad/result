import React from 'react';

type Page = 'home' | 'students' | 'subjects' | 'marks';

interface HeaderProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  onResetConfig: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setPage, onResetConfig }) => {
  
  const navLinkClass = (page: Page) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentPage === page 
      ? 'bg-cyan-600 text-white' 
      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;
  
  return (
    <header className="bg-slate-800 shadow-md sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-lg text-cyan-400">Marksheet App</span>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => setPage('home')} className={navLinkClass('home')}>Home</button>
                <button onClick={() => setPage('students')} className={navLinkClass('students')}>Students</button>
                <button onClick={() => setPage('subjects')} className={navLinkClass('subjects')}>Subjects</button>
                <button onClick={() => setPage('marks')} className={navLinkClass('marks')}>Marks</button>
              </div>
            </div>
          </div>
          <button 
            onClick={onResetConfig}
            className="px-3 py-2 bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
        >
            Change Sheet URL
        </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
