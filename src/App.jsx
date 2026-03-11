import React from 'react';
import { PipelineToolbar } from './toolbar.jsx';
import { PipelineUI } from './ui.jsx';
import { SubmitButton } from './submit.jsx';
import { SavedList } from './savedList.jsx';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 bg-red-800 bg-gray-900">
      <PipelineToolbar />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-900">
        <PipelineUI />
        <SubmitButton />
        <SavedList />
      </main>
    </div>
  );
}

export default App;
