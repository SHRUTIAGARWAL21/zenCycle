// components/TaskStatusHandler.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";

interface Props {
  taskId: string;
  expectedTime: number;
  onClose: () => void;
  onSuccess: () => void;
}

const TaskStatusHandler: React.FC<Props> = ({
  taskId,
  expectedTime,
  onClose,
  onSuccess,
}) => {
  const [progress, setProgress] = useState(100);
  const [timeTaken, setTimeTaken] = useState<number>(expectedTime);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    const res = await axios.put("/api/tasks/updateStatus", {
      taskId,
      progress,
      totalTimeTaken: timeTaken,
    });

    if (res.data.delay > 0) {
      setShowReasonModal(true);
    } else {
      onSuccess();
      onClose();
    }
  };

  const handleReasonSubmit = async () => {
    await axios.put("/api/tasks/updateReason", {
      taskId,
      reason,
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-2xl p-8 w-60 max-w-md space-y-6 shadow-2xl border border-purple-200/30 z-[100000] transform animate-in fade-in-0 zoom-in-95 duration-300">
        {!showReasonModal ? (
          <>
            <div className="text-center">
              <h3 className="text-xl font-bold text-purple-800 mb-2">
                Update Progress
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Progress
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 px-4 py-1 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 text-purple-800 placeholder-purple-400"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-2 text-purple-500 text-sm">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Time Taken
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 px-4 py-1 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 text-purple-800 placeholder-purple-400"
                    value={timeTaken}
                    min={0}
                    max={24}
                    onChange={(e) => setTimeTaken(Number(e.target.value))}
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-2 text-purple-500 text-sm">
                    hrs
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-0">
              <button
                onClick={onClose}
                className="px-6 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Reason for Delay
              </label>
              <textarea
                className="w-full border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 text-purple-800 placeholder-purple-400 resize-none"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="what caused the delay..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6  text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReasonSubmit}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskStatusHandler;
