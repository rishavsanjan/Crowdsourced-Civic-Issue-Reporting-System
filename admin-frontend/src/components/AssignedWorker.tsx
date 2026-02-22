import { useState } from "react";

interface AssignedWorkerProps {
  worker?: {
    name: string;
    status: string;
    avatarUrl?: string;
    priority: "Low" | "Medium" | "High";
    assignedAt: string;
  };
}

export default function AssignedWorker({
  worker = {
    name: "Marcus Chen",
    status: "In Transit",
    priority: "High",
    assignedAt: "09-14-2025 • 2:45 PM",
  },
}: AssignedWorkerProps) {
  const [messaging, setMessaging] = useState(false);

  const priorityColor =
    worker.priority === "High"
      ? "text-red-500"
      : worker.priority === "Medium"
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <section className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Assigned Worker
        </h2>
        <span className="text-xs font-semibold tracking-wide bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full uppercase">
          Active
        </span>
      </div>

      {/* Worker Identity */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative shrink-0">
          {worker.avatarUrl ? (
            <img
              src={worker.avatarUrl}
              alt={worker.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 text-lg font-semibold">
              {worker.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white leading-tight">
            {worker.name}
          </p>
          <p className="text-sm text-green-500 flex items-center gap-1 mt-0.5">
            <span>💬</span>
            {worker.status}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-slate-700 mb-4" />

      {/* Meta */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">
            Priority
          </p>
          <p className={`text-sm font-semibold flex items-center gap-1 ${priorityColor}`}>
            <span className="w-2 h-2 rounded-full bg-current inline-block" />
            {worker.priority}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">
            Assigned
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {worker.assignedAt}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => setMessaging(!messaging)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-2.5 rounded-md transition-all duration-150 shadow-sm shadow-blue-500/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
          </svg>
          Message Worker
        </button>

        <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-[0.98] text-slate-700 dark:text-slate-200 font-medium py-2.5 rounded-md border border-slate-200 dark:border-slate-600 transition-all duration-150">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
          </svg>
          Reassign
        </button>
      </div>
    </section>
  );
}