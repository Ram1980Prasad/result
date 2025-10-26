import React, { useState } from 'react';

// Fix: The Apps Script code is now a string constant within the component.
const appsScriptCode = `
function doPost(e) {
  // Check if the script is being run manually or without required data
  if (!e || !e.postData || !e.postData.contents) {
    var message = 'This script is designed to be triggered by a POST request from the web app. Running it manually will not work.';
    Logger.log(message);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: message })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    Logger.log("Received data: " + e.postData.contents); // For debugging
    
    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (jsonError) {
      Logger.log('Failed to parse JSON: ' + e.postData.contents);
      throw new Error('Invalid data format received. Expected JSON. Error: ' + jsonError.message);
    }

    if (!payload || !Array.isArray(payload.students) || !Array.isArray(payload.subjects)) {
      throw new Error('Invalid data structure. Expected an object with "students" and "subjects" arrays.');
    }
    
    var students = payload.students;
    var subjects = payload.subjects;

    // --- Hierarchical Header Logic ---
    var staticHeaders = ["अ.नं.", "विद्यार्थ्याचे नाव", "लिंग", "संवर्ग", "इयत्ता", "हजर दिवस"];
    var subHeaders = ["आकारिक", "संकलित", "एकूण", "श्रेणी"];
    
    var headerRow1 = [].concat(staticHeaders);
    var headerRow2 = staticHeaders.map(function() { return ''; }); // Blanks for static columns

    subjects.forEach(function(subject) {
      headerRow1.push(subject, '', '', ''); // Subject name followed by 3 blanks for merging
      headerRow2 = headerRow2.concat(subHeaders);
    });

    var totalColumns = staticHeaders.length + (subjects.length * subHeaders.length);

    // --- Sheet Formatting ---
    sheet.clear(); // Clear the entire sheet for a fresh start
    
    // Write the two header rows
    sheet.getRange(1, 1, 1, headerRow1.length).setValues([headerRow1]);
    sheet.getRange(2, 1, 1, headerRow2.length).setValues([headerRow2]);
    
    // --- Merging and Styling Headers ---
    var headerRange = sheet.getRange(1, 1, 2, totalColumns);
    headerRange.setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");

    // Merge static header cells vertically
    staticHeaders.forEach(function(_, index) {
      sheet.getRange(1, index + 1, 2, 1).mergeVertically();
    });

    // Merge main subject header cells horizontally
    subjects.forEach(function(_, index) {
      var startCol = staticHeaders.length + 1 + (index * subHeaders.length);
      sheet.getRange(1, startCol, 1, subHeaders.length).mergeHorizontally();
    });
    
    sheet.setFrozenRows(2); // Freeze the two header rows

    // --- Data Row Logic ---
    var rows = students.map(function(student) {
      var rowData = [
        student.srNo,
        student.name,
        student.gender,
        student.category,
        student.class,
        student.attendance,
      ];

      subjects.forEach(function(subjectName) {
        var studentMarks = student.marks[subjectName] || {};
        rowData.push(studentMarks.formative || '');
        rowData.push(studentMarks.summative || '');
        rowData.push(studentMarks.total || '');
        rowData.push(studentMarks.grade || '');
      });
      return rowData;
    });
    
    if (rows.length > 0) {
      // Write data starting from row 3
      sheet.getRange(3, 1, rows.length, rows[0].length).setValues(rows);
      // Add borders to the entire table for a clean, printable look
      sheet.getRange(1, 1, rows.length + 2, totalColumns).setBorder(true, true, true, true, true, true);
    } else {
      // If there's no data, still add a border to the header
      headerRange.setBorder(true, true, true, true, true, true);
    }
    
    // Auto-resize columns for readability
    for (var i = 1; i <= totalColumns; i++) {
        sheet.autoResizeColumn(i);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Sheet updated successfully with new printable format.' })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString() + ' Stack: ' + error.stack);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}
`.trim();

interface SetupGuideProps {
  onSave: (url: string) => void;
}

// Fix: Replaced the Google Apps Script code with a React component.
const SetupGuide: React.FC<SetupGuideProps> = ({ onSave }) => {
  const [scriptUrl, setScriptUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (scriptUrl.trim() && scriptUrl.startsWith('https://script.google.com/macros/s/')) {
      onSave(scriptUrl.trim());
    } else {
      alert('Please enter a valid Google Apps Script Web App URL.');
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">Setup Guide</h1>
      <p className="text-slate-400 text-lg mb-8">
        To use this application, you need to connect it to a Google Sheet via a Google Apps Script Web App. Follow the steps below.
      </p>

      <div className="space-y-8">
        <Step number={1} title="Create a new Google Sheet">
          Go to <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">sheets.new</a> to create a new spreadsheet. You can name it whatever you like.
        </Step>

        <Step number={2} title="Open the Apps Script Editor">
          In your new sheet, go to <strong>Extensions &gt; Apps Script</strong>. This will open a new tab with the script editor.
        </Step>

        <Step number={3} title="Paste the Script Code">
          {/* FIX: The `...` inside `{ ... }` was likely being misparsed as a JSX spread operator. Changed to `{ /* ... */ }` to avoid the error. */}
          Delete any existing code in the editor (e.g., `function myFunction() { /* ... */ }`). Then, copy the code below and paste it into the editor.
          <div className="relative mt-4">
            <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 px-3 py-1 bg-slate-600 text-slate-200 text-xs font-semibold rounded-md hover:bg-slate-500 transition"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm">
              <code>
                {appsScriptCode}
              </code>
            </pre>
          </div>
          Save the project (click the floppy disk icon or Ctrl+S). Give it a name when prompted.
        </Step>

        <Step number={4} title="Deploy as a Web App">
          <ol className="list-decimal list-inside space-y-2 mt-2">
            <li>Click the blue <strong>Deploy</strong> button in the top right, then select <strong>New deployment</strong>.</li>
            <li>Click the gear icon next to "Select type" and choose <strong>Web app</strong>.</li>
            <li>In the "New deployment" dialog:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>For <strong>Description</strong>, you can write something like "Marksheet App Connector".</li>
                <li>For <strong>Execute as</strong>, leave it as "Me".</li>
                <li>For <strong>Who has access</strong>, you MUST select <strong>Anyone</strong>. This is critical for the app to be able to send data.</li>
              </ul>
            </li>
            <li>Click <strong>Deploy</strong>.</li>
            <li>You may be asked to authorize the script. Follow the prompts. Click "Advanced", then "Go to (unsafe)". This is normal because your script isn't verified by Google.</li>
          </ol>
        </Step>
        
        <Step number={5} title="Copy the Web App URL">
          After deploying, you will be given a <strong>Web app URL</strong>. It will look something like `https://script.google.com/macros/s/.../exec`. Copy this URL.
        </Step>

        <Step number={6} title="Save the URL">
          Paste the copied Web app URL into the field below and click "Save Configuration".
           <form onSubmit={handleSave} className="mt-4 flex flex-col sm:flex-row gap-4 items-start">
            <input
              type="url"
              value={scriptUrl}
              onChange={e => setScriptUrl(e.target.value)}
              placeholder="Paste your Web App URL here"
              required
              className="flex-grow w-full bg-slate-700 border border-slate-600 rounded-md p-3 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-transform transform hover:scale-105"
            >
              Save Configuration
            </button>
          </form>
        </Step>
      </div>
    </div>
  );
};

interface StepProps {
    number: number;
    title: string;
    children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, children }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl ring-1 ring-slate-700">
        <h2 className="text-2xl font-bold text-cyan-300 mb-3 flex items-center">
            <span className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">{number}</span>
            {title}
        </h2>
        <div className="text-slate-300 pl-12">
            {children}
        </div>
    </div>
);

export default SetupGuide;