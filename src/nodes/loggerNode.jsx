// nodes/loggerNode.jsx
import { BaseNode } from "./BaseNode.jsx";

export const LoggerNode = ({ id }) => {
  return (
    <BaseNode
      id={id}
      title="📝 Logger"
      inputs={[{ id: `${id}-input` }]}
      outputs={[]}
      color="blue"
    >
      <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded">
        Logs and displays incoming data
      </div>
    </BaseNode>
  );
};
