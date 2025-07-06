"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Edit3 } from "lucide-react";

const SimpleJournalUI = () => {
  const [page, setPage] = useState<number>(1);
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pageExists, setPageExists] = useState<boolean>(false); // true if GET was successful

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/journal/${page}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.content || "");
          setPageExists(true);
        } else {
          setContent("");
          setPageExists(false);
        }
        setIsEditing(false); // disable editing on page change
      } catch (err) {
        console.error("Error fetching journal:", err);
      }
    };
    fetchContent();
  }, [page]);

  const handleSave = async () => {
    try {
      const url = pageExists ? `/api/journal/${page}` : `/api/journal`;
      const method = pageExists ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      if (!pageExists) {
        const data = await res.json();
        setPage(data.pageNumber); // use returned pageNumber from POST
        setPageExists(true);
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-amber-800 mb-2">
            My Digital Journal
          </h1>
          <p className="text-amber-600 font-medium">Sunday, July 6, 2025</p>
        </div>

        {/* Journal Container */}
        <div
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(45deg, #fef7cd 25%, transparent 25%),
                             linear-gradient(-45deg, #fef7cd 25%, transparent 25%),
                             linear-gradient(45deg, transparent 75%, #fef7cd 75%),
                             linear-gradient(-45deg, transparent 75%, #fef7cd 75%)`,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        >
          {/* Spiral Binding */}
          <div className="absolute left-16 top-0 bottom-0 w-2 bg-gradient-to-b from-gray-300 to-gray-400 shadow-inner">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 bg-gray-400 rounded-full shadow-md -left-2"
                style={{ top: `${i * 5 + 2}%` }}
              />
            ))}
          </div>

          {/* Red Margin Line */}
          <div className="absolute left-24 top-0 bottom-0 w-0.5 bg-red-400 opacity-30"></div>

          {/* Main Content Area */}
          <div className="pl-32 pr-8 py-12">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-left">
                <h2 className="text-2xl font-serif text-amber-800 mb-1">
                  Journal Entry
                </h2>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-md shadow border border-amber-300">
                  <span className="text-amber-700 text-sm font-medium">
                    Page
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={page}
                    onChange={(e) => setPage(Number(e.target.value))}
                    className="w-12 text-center text-sm text-amber-700 font-medium bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition shadow-lg ${
                    isEditing
                      ? "bg-gray-300 text-white cursor-not-allowed opacity-50"
                      : "bg-amber-600 text-white hover:bg-amber-700 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  <Edit3 size={18} />
                  Edit
                </button>

                <button
                  onClick={handleSave}
                  disabled={!isEditing}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition shadow-lg ${
                    isEditing
                      ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-0.5"
                      : "bg-gray-300 text-white cursor-not-allowed opacity-50"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>

            {/* Content Area - Clean Textarea */}
            <div className="bg-amber-50 rounded-lg p-4 shadow-inner border border-amber-200 min-h-[24rem]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!isEditing}
                placeholder="Start writing your thoughts..."
                rows={14}
                className={`w-full h-full resize-none bg-transparent outline-none text-gray-800 text-lg font-serif leading-relaxed placeholder:text-amber-400 ${
                  isEditing ? "" : "cursor-not-allowed"
                }`}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrev}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition shadow-lg ${
                  page > 1
                    ? "bg-amber-600 text-white hover:bg-amber-700 hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-white cursor-not-allowed opacity-50"
                }`}
                disabled={page <= 1}
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-amber-700 text-sm">
          <p>
            Click "Edit" to modify your journal entry • Use "Save" to store
            updates • Navigate with Previous/Next buttons
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleJournalUI;
