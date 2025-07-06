import React from "react";
import { ChevronLeft, ChevronRight, Plus, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";

const SimpleJournalUI = () => {
  const [page, setPage] = useState<number>(1);

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
                <input
                  type="number"
                  min={1}
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                  onBlur={() => console.log("Go to page", page)} // Replace this with actual fetch or navigation
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("Go to page", page); // Replace with logic to fetch that page
                    }
                  }}
                  className="text-amber-600 text-sm bg-transparent border-b border-amber-400 focus:outline-none w-16 text-center"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Edit3 size={18} />
                  Edit
                </button>
                <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Plus size={18} />
                  New Page
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-amber-50 rounded-lg p-6 shadow-inner min-h-96 border border-amber-200">
              <div className="text-gray-800 leading-relaxed font-serif text-lg"></div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg opacity-50 cursor-not-allowed">
                <ChevronLeft size={18} />
                Previous
              </button>

              <button className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-amber-700 text-sm">
          <p>
            Click "Edit" to modify your journal entry • Use "New Page" to create
            a fresh page • Navigate with Previous/Next buttons
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleJournalUI;
