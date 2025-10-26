import React, { useState, useEffect } from 'react';
import { Student, SubjectScores } from '../types';

interface MarksEntryProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  subjects: string[];
}

const inputClass = "w-full bg-slate-700/50 border-slate-600 rounded-md p-1.5 focus:ring-cyan-500 focus:border-cyan-500 transition";
const readOnlyInputClass = "w-full bg-slate-600 border-slate-500 rounded-md p-1.5 cursor-not-allowed";

const createEmptyScores = (): SubjectScores => ({
  formative: '',
  summative: '',
  total: '',
  grade: '',
});

const calculateGrade = (total: number): string => {
    if (total > 100 || total < 0) return 'Error';
    if (total >= 91) return 'अ-1';
    if (total >= 81) return 'अ-2';
    if (total >= 71) return 'ब-1';
    if (total >= 61) return 'ब-2';
    if (total >= 51) return 'क-1';
    if (total >= 41) return 'क-2';
    if (total >= 33) return 'ड';
    return 'ई';
};


const MarksEntry: React.FC<MarksEntryProps> = ({ students, setStudents, subjects }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  useEffect(() => {
    if (selectedStudentId && !students.some(s => s.id === selectedStudentId)) {
        setSelectedStudentId('');
    }
  }, [students, selectedStudentId]);

  const handleMarksChange = (subjectName: string, field: 'formative' | 'summative', value: string) => {
    setStudents(prev => 
      prev.map(student => {
        if (student.id === selectedStudentId) {
          const newMarks = { ...student.marks };
          const subjectScores = newMarks[subjectName] || createEmptyScores();
          
          const updatedScores = { ...subjectScores, [field]: value };

          const formative = Number(field === 'formative' ? value : updatedScores.formative) || 0;
          const summative = Number(field === 'summative' ? value : updatedScores.summative) || 0;
          const total = formative + summative;
          
          updatedScores.total = total > 0 ? total : '';
          updatedScores.grade = total > 0 ? calculateGrade(total) : '';

          newMarks[subjectName] = updatedScores;
          
          return { ...student, marks: newMarks };
        }
        return student;
      })
    );
  };
  
  const handleAttendanceChange = (value: string) => {
    setStudents(prev => 
        prev.map(student => student.id === selectedStudentId ? { ...student, attendance: value } : student)
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Enter Marks</h1>

      {students.length === 0 || subjects.length === 0 ? (
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl ring-1 ring-slate-700 text-center">
            <p className="text-slate-400">Please add students and configure subjects before entering marks.</p>
        </div>
      ) : (
        <>
            <div className="mb-6 max-w-sm">
                <label htmlFor="student-select" className="block text-sm font-medium text-slate-300 mb-1">Select Student</label>
                <select 
                    id="student-select"
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                >
                    <option value="" disabled>-- Select a student --</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            {selectedStudent && (
                <div className="overflow-x-auto bg-slate-800 rounded-lg shadow-xl ring-1 ring-slate-700">
                    <table className="min-w-full text-sm text-left text-slate-300">
                        <thead className="bg-slate-700/50 text-xs text-cyan-300 uppercase tracking-wider whitespace-nowrap">
                            <tr>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">आकारिक (Formative)</th>
                                <th className="px-4 py-3">संकलित (Summative)</th>
                                <th className="px-4 py-3">एकूण (Total)</th>
                                <th className="px-4 py-3">श्रेणी (Grade)</th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr className="bg-slate-800/50 border-b border-slate-700">
                                <td className="px-4 py-2 font-bold text-cyan-300">हजर दिवस (Attendance)</td>
                                <td colSpan={4} className="px-2 py-2">
                                    <input 
                                        type="number" 
                                        value={selectedStudent.attendance} 
                                        onChange={e => handleAttendanceChange(e.target.value)} 
                                        className={`${inputClass} max-w-xs`} 
                                    />
                                </td>
                            </tr>
                            {subjects.map((subject, index) => {
                                const studentMarks = selectedStudent.marks[subject] || createEmptyScores();
                                return (
                                <tr key={subject} className={`${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'} border-b border-slate-700`}>
                                    <td className="px-4 py-2 font-bold text-slate-300">{subject}</td>
                                    <td className="px-2 py-2"><input type="number" value={studentMarks.formative} onChange={e => handleMarksChange(subject, 'formative', e.target.value)} className={inputClass} /></td>
                                    <td className="px-2 py-2"><input type="number" value={studentMarks.summative} onChange={e => handleMarksChange(subject, 'summative', e.target.value)} className={inputClass} /></td>
                                    <td className="px-2 py-2"><input type="number" value={studentMarks.total} readOnly className={readOnlyInputClass} /></td>
                                    <td className="px-2 py-2"><input type="text" value={studentMarks.grade} readOnly className={readOnlyInputClass} /></td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default MarksEntry;