import React, { useState, useEffect } from 'react';
import SetupGuide from './components/SetupGuide';
import HomePage from './components/HomePage';
import StudentSetup from './components/StudentSetup';
import SubjectSetup from './components/SubjectSetup';
import MarksEntry from './components/MarksEntry';
import Header from './components/Header';
import { Student, Gender, Category } from './types';
import { postToGoogleSheet } from './services/googleSheetService';

type Page = 'home' | 'students' | 'subjects' | 'marks';

const App: React.FC = () => {
  const [scriptUrl, setScriptUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<string[]>(['भाषा (मराठी)', 'भाषा (हिंदी)', 'गणित']);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const savedUrl = localStorage.getItem('googleSheetScriptUrl');
    if (savedUrl) {
      setScriptUrl(savedUrl);
    }
    // Load persisted data
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }

    setIsReady(true);
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if(isReady) localStorage.setItem('students', JSON.stringify(students));
  }, [students, isReady]);

  useEffect(() => {
    if(isReady) localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects, isReady]);


  const handleConfigSave = (url: string) => {
    localStorage.setItem('googleSheetScriptUrl', url);
    setScriptUrl(url);
  };

  const handleConfigReset = () => {
    localStorage.removeItem('googleSheetScriptUrl');
    setScriptUrl(null);
  };

  const handleSubmitToSheet = async () => {
    if (students.length === 0) {
      setStatus('error');
      setMessage('No student data to submit. Please add students first.');
      setTimeout(() => setStatus('idle'), 5000);
      return;
    }
    if (subjects.length === 0) {
      setStatus('error');
      setMessage('No subjects configured. Please add subjects first.');
      setTimeout(() => setStatus('idle'), 5000);
      return;
    }

    setStatus('loading');
    setMessage('Submitting data to Google Sheet...');
    try {
      await postToGoogleSheet({ students, subjects }, scriptUrl!);
      setStatus('success');
      setMessage('Data submitted successfully!');
    } catch (error) {
      setStatus('error');
      setMessage(`Submission failed. Error: ${(error as Error).message}`);
    } finally {
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'students':
        return <StudentSetup students={students} setStudents={setStudents} />;
      case 'subjects':
        return <SubjectSetup subjects={subjects} setSubjects={setSubjects} />;
      case 'marks':
        return <MarksEntry students={students} setStudents={setStudents} subjects={subjects} />;
      case 'home':
      default:
        return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {!scriptUrl ? (
        <div className="p-4 sm:p-6 lg:p-8">
            <SetupGuide onSave={handleConfigSave} />
        </div>
      ) : (
        <>
          <Header currentPage={currentPage} setPage={setCurrentPage} onResetConfig={handleConfigReset} />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderPage()}
            </div>
          </main>
          <footer className="sticky bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm p-4 mt-8 border-t border-slate-700">
            <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-end space-x-4">
              {status !== 'idle' && (
                <div className={`text-sm p-3 rounded-lg flex-grow sm:flex-grow-0 ${
                  status === 'loading' ? 'bg-blue-900 text-blue-200' :
                  status === 'success' ? 'bg-green-900 text-green-200' :
                  'bg-red-900 text-red-200'
                }`}>
                  {message}
                </div>
              )}
              <button
                onClick={handleSubmitToSheet}
                disabled={status === 'loading'}
                className="px-5 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit All Data to Sheet'}
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
