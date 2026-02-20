// nodes/inputNode.jsx
import { useState } from "react";
import { BaseNode } from "./BaseNode.jsx";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_"),
  );

  const [inputType, setInputType] = useState(data?.inputType || "Text");

  return (
    <BaseNode id={id} data={data} title="📥 Input" outputs={[{ id: `${id}-value` }]} color="blue">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Name:</label>
          <input
            type="text"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            placeholder="Enter input name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Type:</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors cursor-pointer"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
            <option value="Number">Number</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
