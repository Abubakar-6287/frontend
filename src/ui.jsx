// ui.jsx
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode.jsx';
import { LLMNode } from './nodes/llmNode.jsx';
import { OutputNode } from './nodes/outputNode.jsx';
import { TextNode } from './nodes/textNode.jsx';
import { CustomControls } from './customControls.jsx';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  autoSaveStatus: state.autoSaveStatus,
  autoSave: state.autoSave,
  loadDraft: state.loadDraft,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const autoSaveTimer = useRef(null);
    const darkMode = useStore((state) => state.darkMode);
    const viewportRef = useRef(null);
    
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      autoSaveStatus,
      autoSave,
      loadDraft
    } = useStore(selector, shallow);

    // Load draft on mount
    useEffect(() => {
      loadDraft();
    }, [loadDraft]);

    // keep track of viewport so theme change doesn't jump/scale
    useEffect(() => {
      if (reactFlowInstance) {
        viewportRef.current = reactFlowInstance.getViewport();
      }
    });

    // when darkMode toggles reset viewport to previous value (mitigate shift)
    useEffect(() => {
      if (reactFlowInstance && viewportRef.current) {
        // a small timeout allows any layout changes to finish
        setTimeout(() => {
          reactFlowInstance.setViewport(viewportRef.current);
        }, 0);
      }
    }, [darkMode, reactFlowInstance]);

    // Auto-save on nodes/edges change
    useEffect(() => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      
      autoSaveTimer.current = setTimeout(() => {
        autoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => {
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }
      };
    }, [nodes, edges, autoSave]);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, addNode, getNodeID]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // No wheel handler here — allow normal page/body scrolling when user scrolls over canvas

    const { saveToHistory } = useStore(state => ({ saveToHistory: state.saveToHistory }));

    const statusIndicator = {
      saving: { icon: '⏳', color: 'text-yellow-500', text: 'Saving...' },
      saved: { icon: '✅', color: 'text-green-500', text: 'Saved' },
      unsaved: { icon: '⚠️', color: 'text-orange-500', text: 'Unsaved changes' }
    };

    const status = statusIndicator[autoSaveStatus || 'saved'];

    return (
        <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-end items-center px-4 py-2 bg-gray-900 border-b border-gray-200 dark:border-gray-700m ">
            <span className={`text-sm font-medium ${status.color} flex items-center gap-1`}>
              {status.icon} {status.text}
            </span>
          </div>
            <div ref={reactFlowWrapper} className="w-full relative" style={{height: '80vh', minHeight: '600px'}}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onInit={setReactFlowInstance}
                  onNodeDragStop={(event, node) => {
                    // record final position in history, prevents intermediate entries during drag
                    saveToHistory();
                  }}
                  zoomOnScroll={true}
                  zoomOnPinch={true}
                  panOnScroll={true}
                  nodeTypes={nodeTypes}
                  proOptions={proOptions}
                  snapGrid={[gridSize, gridSize]}
                  connectionLineType='smoothstep'
              >
                  <Background color="#ccc" gap={gridSize} className="dark:invert" />
                  <CustomControls />
                  <MiniMap />
              </ReactFlow>
          </div>
        </div>
    )
}
