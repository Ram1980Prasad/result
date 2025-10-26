import { Student } from '../types';

interface SheetData {
  students: Student[];
  subjects: string[];
}

export const postToGoogleSheet = async (data: SheetData, scriptUrl: string): Promise<void> => {
  if (!scriptUrl || !scriptUrl.startsWith('https://script.google.com/macros/s/')) {
    throw new Error('Invalid or missing Google Apps Script URL. Please configure it on the setup page.');
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read error response.');
      throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}. Response: ${errorText}`);
    }
    
    const responseText = await response.text();
    try {
      const result = JSON.parse(responseText);
      if (result.status !== 'success') {
        throw new Error(result.message || 'An error occurred in the Apps Script.');
      }
    } catch (e) {
      throw new Error(`Failed to parse response from Google Apps Script. It's likely a server error. Response: ${responseText}`);
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
       throw new Error('Submission failed due to a network error, likely a CORS issue. Please double-check the Apps Script deployment settings, especially the "Who has access" permission.');
    }
    throw error;
  }
};