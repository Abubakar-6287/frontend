// nodes/textNode.jsx
import { useState, useEffect, useRef } from "react";
import { BaseNode } from "./BaseNode.jsx";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
    const matches = [];
    let match;

    while ((match = regex.exec(currText)) !== null) {
      matches.push(match[1]);
    }

    const uniqueVars = [...new Set(matches)];
    setVariables(uniqueVars);
  }, [currText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [currText]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="✏️ Text"
      inputs={variables.map((variable) => ({
        id: `${id}-${variable}`,
      }))}
      outputs={[{ id: `${id}-output` }]}
      color="orange"
      style={{ minWidth: 220 }}
    >
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Text:</label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-colors font-mono text-xs resize-none"
          style={{
            minHeight: 60,
            lineHeight: '1.4',
          }}
        />
        {variables.length > 0 && (
          <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span className="font-semibold">Variables:</span> {variables.join(", ")}
          </div>
        )}
      </div>
    </BaseNode>
  );
};
