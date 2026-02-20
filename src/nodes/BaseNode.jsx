// nodes/BaseNode.jsx
import { Handle, Position } from "reactflow";
import { useEffect, useState } from "react";
import { useStore } from "../store";

export const BaseNode = ({
  id,
  title,
  children,
  data = {},
  inputs = [],
  outputs = [],
  color = 'indigo',
  style = {},
}) => {
  const isDark = document.documentElement.classList.contains('dark');
  const [opacity, setOpacity] = useState(() => {
    const saved = localStorage.getItem('nodeOpacity');
    return saved ? parseFloat(saved) / 100 : 1;
  });
  
  const [showCommentEdit, setShowCommentEdit] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { updateNodeComment } = useStore((state) => ({
    updateNodeComment: state.updateNodeComment
  }));

  useEffect(() => {
    const handleOpacityChange = () => {
      const saved = localStorage.getItem('nodeOpacity');
      setOpacity(saved ? parseFloat(saved) / 100 : 1);
    };

    window.addEventListener('opacityChanged', handleOpacityChange);
    return () => window.removeEventListener('opacityChanged', handleOpacityChange);
  }, []);

  const colorSchemes = {
    indigo: { light: '#e0e7ff', border: '#818cf8', text: '#1e1b4b', dark: '#4c1d95', darkBorder: '#7c3aed', gradStart: '#6366F1', gradEnd: '#7C3AED' },
    blue: { light: '#dbeafe', border: '#3b82f6', text: '#001f3f', dark: '#1e3a8a', darkBorder: '#2563eb', gradStart: '#3B82F6', gradEnd: '#2563EB' },
    purple: { light: '#e9d5ff', border: '#a855f7', text: '#2d1b4e', dark: '#5b21b6', darkBorder: '#7c3aed', gradStart: '#A855F7', gradEnd: '#7C3AED' },
    emerald: { light: '#d1fae5', border: '#10b981', text: '#064e3b', dark: '#047857', darkBorder: '#059669', gradStart: '#10B981', gradEnd: '#059669' },
    orange: { light: '#fed7aa', border: '#f97316', text: '#5a2a0a', dark: '#d97706', darkBorder: '#ea580c', gradStart: '#FB923C', gradEnd: '#F97316' },
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;

  const bgColor = isDark ? scheme.dark : scheme.light;
  const borderColor = isDark ? scheme.darkBorder : scheme.border;
  const textColor = isDark ? '#f3f4f6' : scheme.text;

  // Convert hex to RGBA for opacity
  const hexToRgba = (hex, alpha) => {
    try {
      const r = parseInt(hex.slice(1,3), 16);
      const g = parseInt(hex.slice(3,5), 16);
      const b = parseInt(hex.slice(5,7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (e) {
      return hex; // fallback to original hex if parse fails
    }
  };

  const bgColorWithOpacity = hexToRgba(bgColor, opacity);
  // Use gradient matching draggable button, applying opacity to both stops
  const gradStart = scheme.gradStart || scheme.light;
  const gradEnd = scheme.gradEnd || scheme.border;
  const gradStartRgba = hexToRgba(gradStart, opacity);
  const gradEndRgba = hexToRgba(gradEnd, opacity);
  const gradientCss = `linear-gradient(135deg, ${gradStartRgba}, ${gradEndRgba})`;
  // Use gradient as background; if opacity === 1 it will be fully opaque
  const effectiveBackground = gradientCss;

  const handleSaveComment = () => {
    updateNodeComment(id, commentText);
    setShowCommentEdit(false);
  };

  const comment = data?.comment || '';

  return (
      <div
      className={`rounded-lg shadow-lg border-2 transition-all duration-300 hover:shadow-xl`}
      style={{
        minWidth: 320,
        minHeight: 100,
        padding: 14,
        // Use solid background color so nodes remain visually distinct
        background: effectiveBackground,
        color: textColor,
        borderColor: borderColor,
        fontSize: 14,
        ...style,
      }}
    >
      <div
        style={{
          fontWeight: "700",
          marginBottom: 12,
          borderBottom: `2px solid ${borderColor}`,
          paddingBottom: 8,
          fontSize: 15,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{title}</span>
        <button
          onClick={() => {
            setCommentText(comment || '');
            setShowCommentEdit(!showCommentEdit);
          }}
          className="text-xs bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white px-2 py-1 rounded transition-colors"
          title="Add/Edit comment"
        >
          💬
        </button>
      </div>

      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            background: "#4f46e5",
            top: 60 + index * 30,
            width: 22,
            height: 22,
            border: '3px solid white',
            boxShadow: '0 0 12px rgba(79, 70, 229, 0.9)',
          }}
        />
      ))}

      <div className="space-y-2">{children}</div>

      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            background: "#22c55e",
            top: 60 + index * 30,
            width: 22,
            height: 22,
            border: '3px solid white',
            boxShadow: '0 0 12px rgba(34, 197, 94, 0.9)',
          }}
        />
      ))}

      {comment && !showCommentEdit && (
        <div style={{ 
          marginTop: 12, 
          paddingTop: 12, 
          borderTop: `1px solid ${borderColor}`,
          fontSize: '12px',
          fontStyle: 'italic',
          opacity: 0.8,
          maxHeight: '80px',
          overflow: 'auto'
        }}>
          📝 {comment}
        </div>
      )}

      {showCommentEdit && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${borderColor}` }}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '8px',
              fontSize: '12px',
              borderRadius: '4px',
              border: `1px solid ${borderColor}`,
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
              color: textColor,
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={handleSaveComment}
              style={{
                flex: 1,
                padding: '6px 12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Save
            </button>
            <button
              onClick={() => setShowCommentEdit(false)}
              style={{
                flex: 1,
                padding: '6px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
