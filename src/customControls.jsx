// customControls.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { useStore } from './store';

export const CustomControls = () => {
  const { getZoom, zoomIn, zoomOut, fitView } = useReactFlow();
  const [zoom, setZoom] = useState(100);
  const [opacity, setOpacity] = useState(() => {
    const saved = localStorage.getItem('nodeOpacity');
    return saved ? parseFloat(saved) : 100;
  });
  
  const { undo, redo, saveToHistory, history, historyIndex } = useStore((state) => ({
    undo: state.undo,
    redo: state.redo,
    saveToHistory: state.saveToHistory,
    history: state.history,
    historyIndex: state.historyIndex
  }));

  // Listen to zoom events in real-time
  useEffect(() => {
    const updateZoomValue = () => {
      setZoom(Math.round(getZoom() * 100));
    };

    // Update on every animation frame for smooth tracking
    let animationId;
    const trackZoom = () => {
      updateZoomValue();
      animationId = requestAnimationFrame(trackZoom);
    };
    trackZoom();

    return () => cancelAnimationFrame(animationId);
  }, [getZoom]);

  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView();
  }, [fitView]);

  const handleOpacityChange = (value) => {
    setOpacity(value);
    localStorage.setItem('nodeOpacity', value);
    window.dispatchEvent(new Event('opacityChanged'));
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;

  return (
    <div className="absolute bottom-[-12px] left-0 z-10
flex flex-col md:flex-row 
md:flex-wrap   
items-start gap-2
rounded-lg shadow-lg p-3

transition-colors duration-300
max-w-md  
bg-gray-700
">
      <button
        onClick={handleZoomIn}
        disabled={zoom >= 1990}
        className="flex-1 min-w-[45px] p-2.5 rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold transition-all duration-200 transform hover:scale-110 active:scale-95 hover:shadow-md h-12 flex items-center justify-center 
"
        title="Zoom In (Max 1990%)"
      >
        <span className="text-lg">+</span>
      </button>

      <div className="flex-1 min-w-[45px]  
  h-12 text-center bg-gray-100 dark:bg-red-700 rounded-md px-1 py-2 flex flex-col justify-center">
        <div className="text-[11px]  font-bold text-gray-900 dark:text-white ">{Math.max(10, Math.min(1990, zoom))}%</div>
        <div className="text-xs text-gray-600 dark:text-gray-300">Zoom</div>
      </div>

      <button
        onClick={handleZoomOut}
        disabled={zoom <= 10}
        className="flex-1 min-w-[45px] p-2.5 rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold transition-all duration-200 transform hover:scale-110 active:scale-95 hover:shadow-md h-12 flex items-center justify-center"
        title="Zoom Out (Min 10%)"
      >
        <span className="text-lg">−</span>
      </button>

      <button
        onClick={handleFitView}
        className="flex-1 min-w-[45px] p-2.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-200 transform hover:scale-110 active:scale-95 hover:shadow-md text-sm h-12 flex items-center justify-center "
        title="Fit to Screen"
      >
        ↔
      </button>

      <button
        onClick={undo}
        disabled={!canUndo}
        className="flex-1 min-w-[45px] p-2.5 rounded-md bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold transition-all duration-200 transform hover:scale-110 active:scale-95 hover:shadow-md text-sm h-12 flex items-center justify-center"
        title="Undo (Ctrl+Z)"
      >
        ↶
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className="flex-1 min-w-[45px] p-2.5 rounded-md bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold transition-all duration-200 transform hover:scale-110 active:scale-95 hover:shadow-md text-sm h-12 flex items-center justify-center"
        title="Redo (Ctrl+Y)"
      >
        ↷
      </button>

      <div className="w-min h-px bg-gray-300 dark:bg-gray-700 my-1"></div>

      <div className="w-full px-1 py-2 bg-gray-50 bg-gray-900 rounded-md 
      
      ">
        <label className="text-xs font-semibold  text-white block mb-2">
          Transparency: {opacity}%
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={opacity}
          onChange={(e) => handleOpacityChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          title="Adjust node transparency (10-100%)"
        />
      </div>
    </div>
  );
};
