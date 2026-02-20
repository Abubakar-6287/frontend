// nodes/llmNode.jsx
import { useState } from "react";
import { BaseNode } from "./BaseNode.jsx";

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState(0.7);

  return (
    <BaseNode
      id={id}
      data={data}
      title="🤖 LLM"
      inputs={[{ id: `${id}-system` }, { id: `${id}-prompt` }]}
      outputs={[{ id: `${id}-response` }]}
      color="purple"
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors cursor-pointer"
          >
            <option>gpt-3.5-turbo</option>
            <option>gpt-4</option>
            <option>claude-2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Temperature:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full accent-purple-500"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">{temperature}</span>
        </div>
      </div>
    </BaseNode>
  );
};
