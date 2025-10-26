import React, { useState } from 'react';
import { Student, Gender, Category } from '../types';

interface StudentSetupProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
const selectClass = "w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
const buttonClass = "px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-transform transform hover:scale-105";


const StudentSetup: React.FC<StudentSetupProps> = ({ students, setStudents }) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<Gender>(Gender.MALE);
  const [newStudentCategory, setNewStudentCategory] = useState<Category>(Category.OPEN);
  const [newStudentClass, setNewStudentClass] = useState('');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentClass.trim()) {
      alert("Please fill in the student's name and class.");
      return;
    }

    const newStudent: Student = {
      id: crypto.randomUUID(),
      srNo: students.length + 1,
      name: newStudentName.trim(),
      gender: newStudentGender,
      category: newStudentCategory,
      class: newStudentClass.trim(),
      attendance: '',
      marks: {},
    };

    setStudents(prev => [...prev, newStudent]);

    // Reset form
    setNewStudentName('');
    setNewStudentClass('');
    setNewStudentGender(Gender.MALE);
    setNewStudentCategory(Category.OPEN);
  };
  
  const handleRemoveStudent = (id: string) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      setStudents(prev => prev.filter(s => s.id !== id).map((s, index) => ({ ...s, srNo: index + 1 })));
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Manage Students</h1>
      
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl ring-1 ring-slate-700 mb-8">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">Add New Student</h2>
        <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">विद्यार्थ्याचे नाव (Name)</label>
            <input type="text" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">लिंग (Gender)</label>
            <select value={newStudentGender} onChange={e => setNewStudentGender(e.target.value as Gender)} className={selectClass}>
              {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">संवर्ग (Category)</label>
            <select value={newStudentCategory} onChange={e => setNewStudentCategory(e.target.value as Category)} className={selectClass}>
              {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">इयत्ता (Class)</label>
            <input type="text" value={newStudentClass} onChange={e => setNewStudentClass(e.target.value)} className={inputClass} required />
          </div>
          <div className="md:col-start-5">
            <button type="submit" className={`${buttonClass} w-full`}>Add Student</button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-xl ring-1 ring-slate-700 overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-300">
          <thead className="bg-slate-700/50 text-xs text-cyan-300 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">अ.नं.</th>
              <th className="px-4 py-3">विद्यार्थ्याचे नाव</th>
              <th className="px-4 py-3">लिंग</th>
              <th className="px-4 py-3">संवर्ग</th>
              <th className="px-4 py-3">इयत्ता</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">No students added yet.</td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.id} className={`${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'} border-b border-slate-700`}>
                  <td className="px-4 py-3">{student.srNo}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.gender}</td>
                  <td className="px-4 py-3">{student.category}</td>
                  <td className="px-4 py-3">{student.class}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleRemoveStudent(student.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSetup;
