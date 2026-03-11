// savedList.jsx
import React, { useEffect, useState } from 'react';
import { useStore } from './store';

const SyntaxHighlighter = ({ jsonString }) => {
  const highlightJSON = (str) => {
    // Escape HTML special characters
    let escaped = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Highlight ONLY brackets, braces, colons, and commas in yellow
    escaped = escaped.replace(/([{}[\]:,])/g, '<span style="color: #FBBF24; font-weight: bold;">$1</span>');
    
    return escaped;
  };

  return (
    <pre 
      className="mt-3 max-h-48 overflow-auto text-xs bg-gray-50 text-green-300 bg-gray-900 p-3 rounded border border-gray-200 wrap font-mono"
      dangerouslySetInnerHTML={{ __html: highlightJSON(jsonString) }}
    />
  );
};

export const SavedList = () => {
  const [items, setItems] = useState([]);
  const { nodes, edges, setFromPipeline } = useStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
    setFromPipeline: state.setFromPipeline,
  }));

  const load = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('pipelines') || '[]');
      setItems(existing);
    } catch (e) {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('pipelinesUpdated', h);
    return () => window.removeEventListener('pipelinesUpdated', h);
  }, []);

  const deletePipeline = (id) => {
    try {
      const existing = JSON.parse(localStorage.getItem('pipelines') || '[]');
      const filtered = existing.filter(item => item.id !== id);
      localStorage.setItem('pipelines', JSON.stringify(filtered));
      setItems(filtered);
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const editPipeline = (item) => {
    if (setFromPipeline) {
      setFromPipeline(item.nodes, item.edges, item.id);
      alert('Pipeline loaded for editing. Make changes and submit to update.');
    }
  };

  if (!items || items.length === 0) return (
    <div className="mt-12 p-8 text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
      <p className="text-gray-600 dark:text-gray-400 text-lg">📭 No saved pipelines yet. Submit your first pipeline!</p>
    </div>
  );

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900  text-white">📊 Saved Pipelines</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <article 
            key={item.id} 
            className="p-5 rounded-lg shadow-md  bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 "
          >
            <div className="flex text-white items-center justify-between mb-3 ">
              <div className="text-xs font-medium text-black  bg-gray-100  px-2.5 py-1 rounded-full">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
              <div className="flex bg-gray-600 gap-2 text-white">
                <button
                  onClick={() => editPipeline(item)}
                  className="text-blue-100 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded transition-colors"
                  title="Edit pipeline"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deletePipeline(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
                  title="Delete pipeline"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="text-sm text-white bg-gray-600 mb-2">
              <span className="font-semibold">Nodes:</span> {item.nodes?.length || 0} | <span className="font-semibold">Edges:</span> {item.edges?.length || 0}
            </div>
            <details className="text-sm text-gray-700    cursor-pointer">
              <summary className="font-medium p-2 hover:text-indigo-600 hover:bg-gray-900 bg-gray-600 text-blue-300  transition-colors">View Details</summary>
              <SyntaxHighlighter jsonString={JSON.stringify(item, null, 2)} />
            </details>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SavedList;
