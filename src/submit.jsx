// submit.jsx
import { useReactFlow } from "reactflow";
import { useState } from "react";
import { useStore } from "./store";

export const SubmitButton = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentEditingId } = useStore((state) => ({
    currentEditingId: state.currentEditingId
  }));

  const exportJSON = () => {
    try {
      const nodes = getNodes();
      const edges = getEdges();
      
      if (nodes.length === 0) {
        alert('Please add at least one node before exporting');
        return;
      }

      const pipeline = {
        nodes,
        edges,
        exportedAt: new Date().toISOString()
      };

      const dataStr = JSON.stringify(pipeline, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pipeline-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setError(null);
    } catch (e) {
      setError('Failed to export pipeline: ' + e.message);
      console.error('Export error:', e);
    }
  };

  const handleSubmit = async () => {
    const nodes = getNodes();
    const edges = getEdges();

    if (nodes.length === 0) {
      setError('Please add at least one node before submitting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate nodes
      for (const node of nodes) {
        if (!node.id || !node.type) {
          throw new Error('Invalid node structure. Missing id or type.');
        }
      }

      // Validate edges
      for (const edge of edges) {
        if (!edge.source || !edge.target) {
          throw new Error('Invalid edge structure. Missing source or target.');
        }
      }

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('pipelines') || '[]');
        
        if (currentEditingId) {
          // Update existing pipeline
          const index = existing.findIndex(item => item.id === currentEditingId);
          if (index !== -1) {
            existing[index] = {
              ...existing[index],
              nodes,
              edges,
              updatedAt: new Date().toISOString()
            };
          }
        } else {
          // Add new pipeline
          const item = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            nodes,
            edges,
          };
          existing.unshift(item);
        }
        
        localStorage.setItem('pipelines', JSON.stringify(existing));
        window.dispatchEvent(new Event('pipelinesUpdated'));
      } catch (e) {
        console.error('Local save failed', e);
        setError('Failed to save to local storage: ' + e.message);
        return;
      }

      // Send to backend
      try {
        const response = await fetch("http://127.0.0.1:8000/pipelines/parse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nodes, edges }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(
            `✅ Pipeline ${currentEditingId ? 'Updated' : 'Saved'}!\n\nNodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nDAG: ${result.is_dag ? "Yes" : "No"}`,
          );
        } else {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error("Backend error:", error);
        setError('Backend error: ' + error.message);
      }
    } catch (e) {
      setError(e.message);
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-2">
          <span>⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
      )}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
          }`}
        >
          {loading ? 'Saving...' : `${currentEditingId ? '📝 Update' : '💾 Submit'} Pipeline`}
        </button>
        
        <button
          onClick={exportJSON}
          disabled={loading}
          className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-400"
          title="Export pipeline as JSON file"
        >
          📥 Export JSON
        </button>
      </div>
    </div>
  );
};

export default SubmitButton;
