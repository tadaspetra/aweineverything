import { useState } from "react";

interface CounterProps {
  initialValue?: number;
  label?: string;
}

export default function Counter({
  initialValue = 0,
  label = "Count",
}: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="my-6 p-4 rounded-lg border border-dashed border-neutral-400 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {label}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCount((c) => c - 1)}
            className="w-8 h-8 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors text-lg font-medium"
          >
            -
          </button>
          <span className="w-12 text-center text-lg font-medium text-neutral-800 dark:text-neutral-100 tabular-nums">
            {count}
          </span>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="w-8 h-8 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors text-lg font-medium"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
