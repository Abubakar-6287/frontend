// nodes/apiNode.jsx
import { useState } from "react";
import { BaseNode } from "./BaseNode.jsx";

export const APINode = ({ id }) => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");

  return (
    <BaseNode
      id={id}
      title="🌐 API"
      inputs={[{ id: `${id}-trigger` }]}
      outputs={[{ id: `${id}-response` }]}
      color="blue"
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">URL:</label>
          <input
            type="text"
            placeholder="Enter API URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors cursor-pointer"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
