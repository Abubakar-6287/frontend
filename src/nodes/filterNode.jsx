// nodes/filterNode.jsx
import { useState } from "react";
import { BaseNode } from "./BaseNode.jsx";

export const FilterNode = ({ id }) => {
  const [filterType, setFilterType] = useState("contains");
  const [filterValue, setFilterValue] = useState("");

  return (
    <BaseNode
      id={id}
      title="🔍 Filter"
      inputs={[{ id: `${id}-input` }]}
      outputs={[{ id: `${id}-filtered` }]}
      color="purple"
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Filter Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors cursor-pointer"
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts With</option>
            <option value="endsWith">Ends With</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Value:</label>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Filter value"
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
          />
        </div>
      </div>
    </BaseNode>
  );
};
