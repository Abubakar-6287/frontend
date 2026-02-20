// nodes/mathNode.jsx
import { useState } from "react";
import { BaseNode } from "./BaseNode.jsx";

export const MathNode = ({ id }) => {
  const [operation, setOperation] = useState("add");

  return (
    <BaseNode
      id={id}
      title="🔢 Math"
      inputs={[{ id: `${id}-a` }, { id: `${id}-b` }]}
      outputs={[{ id: `${id}-result` }]}
      color="emerald"
    >
      <div className="space-y-2">
        <label className="block text-sm font-semibold mb-1">Operation:</label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors cursor-pointer"
        >
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (−)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
        </select>
        <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded">
          Performs {operation} operation
        </div>
      </div>
    </BaseNode>
  );
};
