// draggableNode.jsx
import { useEffect, useRef, useState } from 'react';
import { useStore } from './store';

export const DraggableNode = ({ type, label }) => {
    const dragRef = useRef(null);
    const buttonRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const addNode = useStore((state) => state.addNode);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 1024);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
      
      setIsDragging(true);
      
      // Create custom drag image with colors
      if (dragRef.current) {
        event.dataTransfer.setDragImage(dragRef.current, 0, 0);
      }
    };

    const onDragEnd = (event) => {
      event.target.style.cursor = 'grab';
      setIsDragging(false);
    };

    const onClick = (e) => {
      if (!isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      
      // Add node at default center position
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position: { x: 250, y: 100 },
        data: { label }
      };
      
      addNode(newNode);
    };

    const typeColors = {
      customInput: 'from-blue-500 to-blue-600',
      llm: 'from-purple-500 to-purple-600',
      customOutput: 'from-emerald-500 to-emerald-600',
      text: 'from-orange-500 to-orange-600',
    };

    const bgGradient = typeColors[type] || 'from-gray-500 to-gray-600';
  
    return (
      <>
        <div
          ref={dragRef}
          className={`hidden bg-gradient-to-br ${bgGradient} w-[80px] lg:w-[80px] h-10 px-2 rounded-md flex items-center justify-center text-white font-semibold text-sm shadow-lg`}
          style={{
            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.18)'
          }}
        >
          {label}
        </div>
        <div
          ref={buttonRef}
          className={`group cursor-grab hover:cursor-grabbing bg-gradient-to-br ${bgGradient} hover:shadow-md transition-all duration-200 transform hover:scale-103 active:scale-95 w-full lg:w-auto lg:min-w-[72px] h-10 px-3 rounded-md flex items-center justify-center text-white font-semibold text-sm shadow-sm ${isDragging ? 'dragging-button' : ''}`}
          onDragStart={!isMobile ? (event) => onDragStart(event, type) : undefined}
          onDragEnd={!isMobile ? onDragEnd : undefined}
          onClick={onClick}
          draggable={!isMobile}
          style={isDragging ? {
            opacity: 0.85,
            transform: 'scale(0.98)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.12)',
          } : {}}
        >
          <span className="transition-transform duration-200">{label}</span>
        </div>
      </>
    );
  };

export default DraggableNode;
