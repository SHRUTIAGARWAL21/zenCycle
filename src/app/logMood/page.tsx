"use client";
import { useState } from "react";

export default function MoodLogger() {
  const [moodType, setMoodType] = useState("");
  const [moodLevel, setMoodLevel] = useState(3);
  const [reason, setReason] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const reasons = ["exam", "sleep", "family", "work", "health", "friends"];

  const toggleReason = (item: string) => {
    if (reason.includes(item)) {
      setReason(reason.filter((r) => r !== item));
    } else {
      setReason([...reason, item]);
    }
  };

  const submitMood = async () => {
    const res = await fetch("/api/moods/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moodType, moodLevel, reason, note }),
    });

    const data = await res.json();
    console.log("Result:", data);
    alert(data.message || data.error);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Log Your Mood</h2>

      <div>
        <label>Mood Type:</label>
        <input
          type="text"
          className="border p-1 w-full"
          value={moodType}
          onChange={(e) => setMoodType(e.target.value)}
          placeholder="e.g. happy, sad"
        />
      </div>

      <div>
        <label>Mood Level (1–5):</label>
        <input
          type="range"
          min="1"
          max="5"
          value={moodLevel}
          onChange={(e) => setMoodLevel(Number(e.target.value))}
        />
        <span className="ml-2">{moodLevel}</span>
      </div>

      <div>
        <label>Reason:</label>
        <div className="flex flex-wrap gap-2">
          {reasons.map((r) => (
            <button
              key={r}
              className={`px-2 py-1 border rounded ${
                reason.includes(r) ? "bg-blue-300" : ""
              }`}
              type="button"
              onClick={() => toggleReason(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label>Note (optional):</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border w-full p-1"
        />
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={submitMood}
      >
        Submit Mood
      </button>
    </div>
  );
}
