// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    autoSaveStatus: 'saved', // 'saving', 'saved', 'unsaved'
    lastAutoSave: null,
    
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node],
            autoSaveStatus: 'unsaved'
        });
    },
    
    onNodesChange: (changes) => {
      const newNodes = applyNodeChanges(changes, get().nodes);
      set({
        nodes: newNodes,
        autoSaveStatus: 'unsaved'
      });
      // history entry will be created explicitly by UI (e.g. on drag stop)
    },
    
    onEdgesChange: (changes) => {
      const newEdges = applyEdgeChanges(changes, get().edges);
      set({
        edges: newEdges,
        autoSaveStatus: 'unsaved'
      });
      // for edge modifications (connect/disconnect) history may be saved by caller if needed
    },
    
    onConnect: (connection) => {
      const newEdges = addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges);
      set({
        edges: newEdges,
        autoSaveStatus: 'unsaved'
      });
      // Save to history for undo/redo
      setTimeout(() => get().saveToHistory(), 0);
    },
    
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
        autoSaveStatus: 'unsaved'
      });
    },
    
    autoSave: () => {
      const state = get();
      set({ autoSaveStatus: 'saving' });
      
      try {
        const draft = {
          id: 'draft-' + Date.now(),
          createdAt: new Date().toISOString(),
          nodes: state.nodes,
          edges: state.edges,
          isDraft: true
        };
        localStorage.setItem('pipeline-draft', JSON.stringify(draft));
        set({ 
          autoSaveStatus: 'saved',
          lastAutoSave: new Date().toISOString()
        });
      } catch (e) {
        console.error('Auto-save failed', e);
        set({ autoSaveStatus: 'unsaved' });
      }
    },
    
    loadDraft: () => {
      try {
        const draft = JSON.parse(localStorage.getItem('pipeline-draft'));
        if (draft && draft.nodes && draft.edges) {
          // Remove comments from nodes to avoid clutter
          const nodesWithoutComments = draft.nodes.map(node => ({
            ...node,
            data: { ...node.data, comment: '' }
          }));
          set({
            nodes: nodesWithoutComments,
            edges: draft.edges,
            autoSaveStatus: 'saved'
          });
          return true;
        }
      } catch (e) {
        console.error('Load draft failed', e);
      }
      return false;
    },
    
    clearDraft: () => {
      localStorage.removeItem('pipeline-draft');
      set({ autoSaveStatus: 'saved' });
    },
    
    resetCanvas: () => {
      set({
        nodes: [],
        edges: [],
        nodeIDs: {},
        autoSaveStatus: 'unsaved',
        currentEditingId: null,
        history: [],
        historyIndex: -1
      });
      localStorage.removeItem('pipeline-draft');
    },

    // theme support
    darkMode: (() => {
      try {
        return localStorage.getItem('darkMode') === 'true';
      } catch (e) {
        return false;
      }
    })(),
    setDarkMode: (val) => {
      try {
        localStorage.setItem('darkMode', val ? 'true' : 'false');
      } catch (e) {}
      set({ darkMode: val });
    },
    
    currentEditingId: null,
    history: [],
    historyIndex: -1,
    
    saveToHistory: () => {
      const state = get();
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        nodes: [...state.nodes],
        edges: [...state.edges]
      });
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1
      });
    },
    
    undo: () => {
      const state = get();
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        const historyItem = state.history[newIndex];
        set({
          nodes: historyItem.nodes,
          edges: historyItem.edges,
          historyIndex: newIndex,
          autoSaveStatus: 'unsaved'
        });
      }
    },
    
    redo: () => {
      const state = get();
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        const historyItem = state.history[newIndex];
        set({
          nodes: historyItem.nodes,
          edges: historyItem.edges,
          historyIndex: newIndex,
          autoSaveStatus: 'unsaved'
        });
      }
    },
    
    setFromPipeline: (loadedNodes, loadedEdges, pipelineId) => {
      // Keep comments for loaded pipelines
      set({
        nodes: loadedNodes,
        edges: loadedEdges,
        currentEditingId: pipelineId,
        autoSaveStatus: 'saved',
        history: [{nodes: loadedNodes, edges: loadedEdges}],
        historyIndex: 0
      });
    },
    
    updateNodeComment: (nodeId, comment) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, comment: comment }
            };
          }
          return node;
        }),
        autoSaveStatus: 'unsaved'
      });
    }
  }));
