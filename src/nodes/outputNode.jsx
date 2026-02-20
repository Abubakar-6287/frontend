// nodes/outputNode.jsx
import { useState } from "react";
import { BaseNode } from "./BaseNode.jsx";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_"),
  );

  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  return (
    <BaseNode id={id} data={data} title="📤 Output" inputs={[{ id: `${id}-value` }]} color="emerald">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Name:</label>
          <input
            type="text"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
            placeholder="Enter output name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Type:</label>
          <select
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors cursor-pointer"
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
