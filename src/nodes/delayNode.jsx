// nodes/delayNode.jsx
import { useState } from "react";
import { BaseNode } from "./BaseNode.jsx";

export const DelayNode = ({ id }) => {
  const [delay, setDelay] = useState(1000);

  return (
    <BaseNode
      id={id}
      title="⏱️ Delay"
      inputs={[{ id: `${id}-input` }]}
      outputs={[{ id: `${id}-output` }]}
      color="indigo"
    >
      <div className="space-y-2">
        <label className="block text-sm font-semibold mb-1">Delay (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(e.target.value)}
          min="0"
          step="100"
          className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
        />
      </div>
    </BaseNode>
  );
};
