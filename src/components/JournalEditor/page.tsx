"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Edit3 } from "lucide-react";

interface JournalEntry {
  content: string;
  pageNumber?: number;
}

interface ApiResponse {
  content?: string;
  pageNumber?: number;
  error?: string;
}

const SimpleJournalUI: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pageExists, setPageExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Find the next available page on first load
  useEffect(() => {
    const findNextAvailablePage = async (): Promise<void> => {
      try {
        setIsLoading(true);
        let currentPage = 1;

        // Keep checking pages until we find one that doesn't exist
        while (true) {
          const res = await fetch(`/api/journal/${currentPage}`);
          if (!res.ok) {
            // This page doesn't exist, so it's our next available page
            setPage(currentPage);
            break;
          }
          currentPage++;

          // Safety check to prevent infinite loop
          if (currentPage > 1000) {
            setPage(1);
            break;
          }
        }
      } catch (err) {
        console.error("Error finding next page:", err);
        setPage(1); // Default to page 1 if error
      } finally {
        setIsLoading(false);
      }
    };
    findNextAvailablePage();
  }, []);

  useEffect(() => {
    const fetchContent = async (): Promise<void> => {
      if (page < 1 || isLoading) return; // Don't fetch if invalid page or still loading

      try {
        const res = await fetch(`/api/journal/${page}`);
        if (res.ok) {
          const data: ApiResponse = await res.json();
          setContent(data.content || "");
          setPageExists(true);
          setIsEditing(false); // Existing page, not editable by default
        } else if (res.status === 404) {
          // Page doesn't exist - new page
          setContent("");
          setPageExists(false);
          setIsEditing(true); // New page, automatically editable
        } else {
          // Other error
          console.error("Error fetching journal:", res.status);
          setContent("");
          setPageExists(false);
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Error fetching journal:", err);
        // On error, treat as new page
        setContent("");
        setPageExists(false);
        setIsEditing(true);
      }
    };

    fetchContent();
  }, [page, isLoading]);

  const handleSave = async (): Promise<void> => {
    if (!content.trim()) {
      alert("Please write something before saving!");
      return;
    }

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

      if (!res.ok) {
        const errorData: ApiResponse = await res.json();
        throw new Error(errorData.error || "Failed to save entry");
      }

      if (!pageExists) {
        const data: ApiResponse = await res.json();
        if (data.pageNumber) {
          setPage(data.pageNumber); // use returned pageNumber from POST
        }
        setPageExists(true);
      }

      setIsEditing(false);
      alert("Entry saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert(`Save failed: ${errorMessage}`);
    }
  };

  const handleNext = (): void => setPage((prev) => prev + 1);
  const handlePrev = (): void => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  const handlePageChange = (newPage: number): void => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    handlePageChange(value);
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setContent(e.target.value);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-700 font-medium">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pt-24 min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200"
      style={{ backgroundColor: "#f3f0ff" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-purple-900 mb-2">
            My Digital Journal
          </h1>
          <p className="text-purple-700 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Journal Container */}
        <div
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(45deg, #f8f5ff 25%, transparent 25%),
                             linear-gradient(-45deg, #f8f5ff 25%, transparent 25%),
                             linear-gradient(45deg, transparent 75%, #f8f5ff 75%),
                             linear-gradient(-45deg, transparent 75%, #f8f5ff 75%)`,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        >
          {/* Spiral Binding */}
          <div className="absolute left-16 top-0 bottom-0 w-2 bg-gradient-to-b from-purple-300 to-purple-400 shadow-inner">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 bg-purple-400 rounded-full shadow-md -left-2"
                style={{ top: `${i * 5 + 2}%` }}
              />
            ))}
          </div>

          {/* Lavender Margin Line */}
          <div className="absolute left-24 top-0 bottom-0 w-0.5 bg-purple-400 opacity-40"></div>

          {/* Main Content Area */}
          <div className="pl-32 pr-8 py-12">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-left">
                <h2 className="text-2xl font-serif text-purple-900 mb-1">
                  Journal Entry
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-md shadow border border-purple-300">
                    <span className="text-purple-700 text-sm font-medium">
                      Page
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={page}
                      onChange={handleInputChange}
                      className="w-12 text-center text-sm text-purple-700 font-medium bg-transparent focus:outline-none"
                    />
                  </div>
                  {!pageExists && (
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      New Page
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition shadow-lg ${
                    isEditing
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                      : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  <Edit3 size={18} />
                  {isEditing ? "Editing..." : "Edit"}
                </button>

                <button
                  onClick={handleSave}
                  disabled={!isEditing || !content.trim()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition shadow-lg ${
                    isEditing && content.trim()
                      ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-0.5"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>

            {/* Content Area - Clean Textarea */}
            <div className="bg-purple-50 rounded-lg p-4 shadow-inner border border-purple-200 min-h-[24rem]">
              <textarea
                value={content}
                onChange={handleTextareaChange}
                disabled={!isEditing}
                placeholder={
                  !pageExists
                    ? "Start writing your thoughts... (This is a new page, you can start writing immediately!)"
                    : "Click 'Edit' to modify this entry..."
                }
                rows={14}
                className={`w-full h-full resize-none bg-transparent outline-none text-gray-800 text-lg font-serif leading-relaxed placeholder:text-purple-400 ${
                  isEditing
                    ? "focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
                    : "cursor-not-allowed"
                }`}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrev}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition shadow-lg ${
                  page > 1
                    ? "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                }`}
                disabled={page <= 1}
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <div className="text-center">
                <p className="text-purple-600 text-sm">
                  {pageExists ? "Saved Entry" : "Unsaved Entry"}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-purple-700 text-sm">
          <p>
            New pages are automatically editable • Click "Edit" to modify
            existing entries • Use "Save" to store updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleJournalUI;
