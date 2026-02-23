import type { Complaint } from "../types/complaint";
import { formatDate } from "../utils/helper";

interface Props {
  complaint : Complaint
}

export default function AssignedWorker({ complaint }: Props) {
 
  return (
    <section className="bg-white light:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 light:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900 light:text-white">
          Assigned Worker
        </h2>
        <span className="text-xs font-semibold tracking-wide bg-slate-100 light:bg-slate-700 text-slate-600 light:text-slate-300 px-2.5 py-1 rounded-full uppercase">
          {complaint.workAssigneds[0].status}
        </span>
      </div>

      {/* Worker Identity */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative shrink-0">
          {/* {worker.name ? (
            <img
              alt={worker.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : ( */}
            <div className="w-12 h-12 rounded-full bg-slate-200 light:bg-slate-600 flex items-center justify-center text-slate-500 light:text-slate-300 text-lg font-semibold">
              {complaint.worker.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          {/* )} */}
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white light:border-slate-800 rounded-full" />
        </div>

        <div>
          <p className="font-semibold text-slate-900 light:text-white leading-tight">
            {complaint.worker.name}
          </p>
          <p className="text-sm text-green-500 flex items-center gap-1 mt-0.5">
            {complaint.workAssigneds[0].status}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 light:border-slate-700 mb-4" />

      {/* Meta */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">
            Assigned
          </p>
          <p className="text-sm text-slate-700 light:text-slate-300">
            {formatDate(String(complaint.workAssigneds[0].createdAt))}
          </p>
        </div>
      </div>

    
    </section>
  );
}