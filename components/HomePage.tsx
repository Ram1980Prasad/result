import React from 'react';

type Page = 'home' | 'students' | 'subjects' | 'marks';

interface HomePageProps {
  setPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-4">Student Marksheet Management</h1>
      <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
        A streamlined solution for managing student data, subjects, and marks with seamless Google Sheets integration.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <NavCard
          title="Manage Students"
          description="Add, view, and edit student information to build your class roster."
          onClick={() => setPage('students')}
        />
        <NavCard
          title="Configure Subjects"
          description="Define the subjects for your curriculum. Add or remove subjects as needed."
          onClick={() => setPage('subjects')}
        />
        <NavCard
          title="Enter Marks"
          description="Select a student and enter their marks for all configured subjects."
          onClick={() => setPage('marks')}
        />
      </div>
    </div>
  );
};

interface NavCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const NavCard: React.FC<NavCardProps> = ({ title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-slate-800 p-8 rounded-lg shadow-xl ring-1 ring-slate-700 text-left hover:ring-cyan-500 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 transform hover:-translate-y-1"
  >
    <h2 className="text-2xl font-bold text-cyan-300 mb-3">{title}</h2>
    <p className="text-slate-400">{description}</p>
  </button>
);

export default HomePage;
