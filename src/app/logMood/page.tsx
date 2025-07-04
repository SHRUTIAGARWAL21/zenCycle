"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const moods = [
  { label: "Very Happy", emoji: "😊" },
  { label: "Happy", emoji: "🙂" },
  { label: "Neutral", emoji: "😐" },
  { label: "Sad", emoji: "😢" },
  { label: "Very Sad", emoji: "😭" },
];

const reasons = [
  "home",
  "work",
  "health",
  "sleep",
  "friends",
  "success",
  "game",
  "gym",
  "relationship",
  "studies",
  "weather",
  "other",
];

export default function MoodLogger() {
  const [step, setStep] = useState(1);
  const [moodType, setMoodType] = useState("");
  const [moodLevel, setMoodLevel] = useState(3);
  const [reason, setReason] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const router = useRouter();

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
    alert(data.message || data.error);
    router.push("/moods");
  };

  return (
    <main className="pt-24 bg-gradient-to-b from-[#cfb5cc] to-white">
      <div className="max-w-md mx-auto p-4 py-8 bg-white shadow rounded-lg">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 w-full mx-1 rounded-full ${
                s <= step ? "bg-[#665164]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-[#694f67]  mb-4">
              How was your mood today?
            </h2>
            <div className="space-y-2">
              {moods.map((m) => (
                <label
                  key={m.label}
                  className={`flex items-center justify-between border rounded-xl px-3 py-2 cursor-pointer ${
                    moodType === m.label ? "bg-[#fff2fe] border-[#83667f]" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="mood"
                    value={m.label}
                    className="hidden"
                    onChange={() => setMoodType(m.label)}
                  />
                  <span>{m.label}</span>
                  <span>{m.emoji}</span>
                </label>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-[#665164] text-white px-4 py-2 rounded"
              onClick={() => setStep(2)}
              disabled={!moodType}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-lg font-bold mb-4">Select Mood Intensity</h2>
            <input
              type="range"
              min="1"
              max="5"
              value={moodLevel}
              onChange={(e) => setMoodLevel(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-2 text-xl font-semibold">
              Intensity: {moodLevel}
            </div>

            <div className="mt-4 flex justify-between gap-4">
              <button
                className="w-1/2 bg-gray-200 text-[#665164] px-4 py-2 rounded"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button
                className="w-1/2 bg-[#665164] text-white px-4 py-2 rounded"
                onClick={() => setStep(step + 1)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg text-[#665164] font-bold mb-4">
              What influenced your mood?
            </h2>
            <div className="flex flex-wrap gap-2">
              {reasons.map((r) => (
                <button
                  key={r}
                  className={`px-3 py-1 border rounded-full text-sm ${
                    reason.includes(r) ? "bg-[#f7e1f5]" : "bg-gray-100"
                  }`}
                  onClick={() => toggleReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-between gap-4">
              <button
                className="w-1/2 bg-gray-200 text-[#665164] px-4 py-2 rounded"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button
                className="w-1/2 bg-[#665164] text-white px-4 py-2 rounded"
                onClick={() => setStep(step + 1)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg text-[#665164] font-serif mb-4">
              Want to add a note?
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border w-full p-2 rounded min-h-[100px]"
              placeholder="Optional: describe your mood or reason"
            />
            <div className="mt-4 flex justify-between gap-4">
              <button
                className="w-1/2 bg-gray-200 text-[#665164] px-4 py-2 rounded"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button
                className="w-1/2 bg-[#665164] text-white px-4 py-2 rounded"
                onClick={submitMood}
              >
                Submit Mood
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
