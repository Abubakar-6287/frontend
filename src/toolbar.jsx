// toolbar.jsx

import React, { useState, useEffect } from 'react';
import { DraggableNode } from './draggableNode.jsx';
import { useStore } from './store';

export const PipelineToolbar = () => {
    // use global store for theme so other components can respond
    const dark = useStore((state) => state.darkMode);
    const setDark = useStore((state) => state.setDarkMode);
    
    const resetCanvas = useStore((state) => state.resetCanvas);

    useEffect(() => {
        const root = document.documentElement;
        if (dark) root.classList.add('dark');
        else root.classList.remove('dark');
        // store.darkMode setter already writes localStorage
    }, [dark]);


    const [showClearModal, setShowClearModal] = useState(false);

    const handleReset = () => {
        setShowClearModal(true);
    };

    const confirmClear = () => {
        resetCanvas();
        setShowClearModal(false);
    };

    const cancelClear = () => {
        setShowClearModal(false);
    };

    const nodes = [
        { type: 'customInput', label: 'Input', title: 'Input data entry point' },
        { type: 'llm', label: 'LLM', title: 'Language model processing' },
        { type: 'customOutput', label: 'Output', title: 'Pipeline output' },
        { type: 'text', label: 'Text', title: 'Text transformation' },
    ];

    return (
        <div className=" w-full py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto w-full flex flex-wrap lg:flex-nowrap items-center gap-2">
                {/* Shift + Pipeline */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center shrink-0">
                        <div className="w-[50px] h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">Shift</div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white shrink-0">Pipeline</div>
                </div>

                {/* Node Buttons - mobile: full width row, desktop: inline */}
                <div className="flex items-center gap-2 flex-wrap w-full order-3 lg:order-none lg:w-auto lg:flex-nowrap lg:flex-1">
                    {nodes.map(node => (
                        <div key={node.type} title={node.title} className="group flex-1 lg:flex-none">
                            <DraggableNode type={node.type} label={node.label} />
                        </div>
                    ))}
                </div>

                {/* Clear + Dark */}
                <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
                    <button 
                        onClick={handleReset}
                        className="h-9 px-3 rounded-md font-medium transition-all duration-200 bg-red-500 hover:bg-red-600 text-white shadow-sm flex items-center justify-center"
                        title="Clear canvas and start fresh"
                    >
                        🗑️ Clear
                    </button>
                    <button 
                        onClick={() => setDark(!dark)}
                        className={`h-9 px-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                            dark ? 'bg-yellow-500 hover:bg-yellow-200 text-gray-900' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } shadow-sm`}
                        title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {dark ? '☀️ Light' : '🌙 Dark'}
                    </button>
                </div>
                {showClearModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-40" onClick={cancelClear}></div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 z-10 w-80">
                            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Clear Canvas</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to clear the entire canvas? This will remove all nodes and edges.</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={cancelClear} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">Cancel</button>
                                <button onClick={confirmClear} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white">Clear</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
