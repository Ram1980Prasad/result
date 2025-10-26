import React, { useState } from 'react';

interface SubjectSetupProps {
  subjects: string[];
  setSubjects: React.Dispatch<React.SetStateAction<string[]>>;
}

const SubjectSetup: React.FC<SubjectSetupProps> = ({ subjects, setSubjects }) => {
  const [newSubject, setNewSubject] = useState('');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSubject = newSubject.trim();
    if (trimmedSubject && !subjects.includes(trimmedSubject)) {
      setSubjects(prev => [...prev, trimmedSubject]);
      setNewSubject('');
    } else {
        alert("Subject cannot be empty or a duplicate.");
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setSubjects(prev => prev.filter(s => s !== subjectToRemove));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Configure Subjects</h1>

      <div className="bg-slate-800 p-6 rounded-lg shadow-xl ring-1 ring-slate-700 mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">Add New Subject</h2>
        <form onSubmit={handleAddSubject} className="flex gap-4">
          <input
            type="text"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            placeholder="e.g., परिसर अभ्यास १"
            className="flex-grow bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          >
            Add Subject
          </button>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-xl ring-1 ring-slate-700">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">Current Subjects</h2>
        {subjects.length === 0 ? (
          <p className="text-slate-400">No subjects configured. Add one above to get started.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {subjects.map(subject => (
              <span key={subject} className="flex items-center bg-slate-700 text-cyan-300 text-sm font-medium px-3 py-1.5 rounded-full">
                {subject}
                <button
                  onClick={() => handleRemoveSubject(subject)}
                  className="ml-2.5 text-slate-400 hover:text-white"
                  aria-label={`Remove ${subject}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectSetup;
