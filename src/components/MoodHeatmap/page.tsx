// "use client";
// import React, { useState, useEffect } from "react";

// type MoodDay = {
//   date: string;
//   mood: string;
//   intensity: number;
// };

// const moodColors: Record<string, string> = {
//   happy: "#FFD700",
//   sad: "#4A90E2",
//   angry: "#FF6B6B",
//   anxious: "#9B59B6",
//   depressed: "#7F8C8D",
//   neutral: "#95A5A6",
// };

// function hexToRGBA(hex: string, alpha: number): string {
//   const bigint = parseInt(hex.slice(1), 16);
//   const r = (bigint >> 16) & 255;
//   const g = (bigint >> 8) & 255;
//   const b = bigint & 255;
//   return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
// }

// function getMonthLabel(date: Date | null): string {
//   if (!date) return "";
//   return date.toLocaleString("default", { month: "short" });
// }

// export default function MoodHeatmap() {
//   const [moodData, setMoodData] = useState<MoodDay[]>([]);
//   const [hoveredCell, setHoveredCell] = useState<string | null>(null);

//   useEffect(() => {
//     // Fetch data from your backend API
//     const fetchMoodData = async () => {
//       try {
//         const res = await fetch("/api/moods/mood-history");
//         const data = await res.json();
//         setMoodData(data);
//       } catch (error) {
//         console.error("Error fetching mood data:", error);
//       }
//     };

//     fetchMoodData();
//   }, []);

//   const moodMap = new Map(moodData.map((m) => [m.date, m]));

//   // Generate 1 year of weeks with month breaks
//   const end = new Date();
//   const start = new Date();
//   start.setDate(end.getDate() - 365);

//   // Move start to Sunday
//   while (start.getDay() !== 0) {
//     start.setDate(start.getDate() - 1);
//   }

//   const weeks: Date[][] = [];
//   let current = new Date(start);
//   let currentMonth = current.getMonth();

//   while (current <= end) {
//     const week: Date[] = [];
//     let weekHasNewMonth = false;
//     let lastDayOfPrevMonth = -1;

//     // Check if this week contains a new month
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(current);
//       date.setDate(current.getDate() + i);
//       if (date.getMonth() !== currentMonth && date <= end) {
//         weekHasNewMonth = true;
//         lastDayOfPrevMonth = i - 1; // Last day of previous month in this week
//         break;
//       }
//     }

//     // If new month starts mid-week, end current week early and start new column
//     if (weekHasNewMonth && weeks.length > 0) {
//       // Fill current week until month change
//       let daysInCurrentWeek = 0;
//       while (daysInCurrentWeek < 7 && current.getMonth() === currentMonth) {
//         week.push(new Date(current));
//         current.setDate(current.getDate() + 1);
//         daysInCurrentWeek++;
//       }

//       // Fill rest of week with empty slots if needed
//       while (week.length < 7) {
//         week.push(null as any);
//       }

//       weeks.push(week);
//       currentMonth = current.getMonth();

//       // Create new column for new month starting from next row
//       const newMonthWeek: Date[] = [];
//       const startRowForNewMonth = daysInCurrentWeek; // Next row after last entry

//       // Add empty slots before the new month starts
//       for (let i = 0; i < startRowForNewMonth; i++) {
//         newMonthWeek.push(null as any);
//       }

//       // Add dates for the new month
//       for (let i = startRowForNewMonth; i < 7; i++) {
//         if (current <= end) {
//           newMonthWeek.push(new Date(current));
//           current.setDate(current.getDate() + 1);
//         } else {
//           newMonthWeek.push(null as any);
//         }
//       }

//       weeks.push(newMonthWeek);
//       continue;
//     }

//     // Normal week processing
//     for (let i = 0; i < 7; i++) {
//       if (current <= end) {
//         week.push(new Date(current));
//         current.setDate(current.getDate() + 1);
//       } else {
//         week.push(null as any);
//       }
//     }
//     weeks.push(week);

//     if (current.getMonth() !== currentMonth) {
//       currentMonth = current.getMonth();
//     }
//   }

//   // Helper function to check if a new month starts
//   const isNewMonth = (weekIndex: number): boolean => {
//     if (weekIndex === 0) return true;
//     const currentWeek = weeks[weekIndex];
//     const prevWeek = weeks[weekIndex - 1];

//     // Find first valid date in current week
//     const currentFirstDate = currentWeek.find((d) => d !== null);
//     const prevFirstDate = prevWeek.find((d) => d !== null);

//     if (!currentFirstDate || !prevFirstDate) return false;

//     return getMonthLabel(currentFirstDate) !== getMonthLabel(prevFirstDate);
//   };

//   // Helper function to get the first valid date from a week
//   const getFirstValidDate = (week: (Date | null)[]): Date | null => {
//     return week.find((d) => d !== null) || null;
//   };

//   const getIntensityLevel = (intensity: number): number => {
//     if (intensity === 0) return 0;
//     if (intensity <= 25) return 1;
//     if (intensity <= 50) return 2;
//     if (intensity <= 75) return 3;
//     return 4;
//   };

//   const getCellColor = (entry: MoodDay | undefined): string => {
//     if (!entry) return "#ebedf0";

//     const baseColor = moodColors[entry.mood] || "#95A5A6";
//     const level = getIntensityLevel(entry.intensity);

//     switch (level) {
//       case 0:
//         return "#ebedf0";
//       case 1:
//         return hexToRGBA(baseColor, 0.3);
//       case 2:
//         return hexToRGBA(baseColor, 0.5);
//       case 3:
//         return hexToRGBA(baseColor, 0.7);
//       case 4:
//         return hexToRGBA(baseColor, 0.9);
//       default:
//         return "#ebedf0";
//     }
//   };

//   const formatDate = (date: Date): string => {
//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-sm">
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-2">
//           Mood Activity
//         </h2>
//         <p className="text-sm text-gray-600">
//           Track your daily mood patterns over the past year
//         </p>
//       </div>

//       <div className="overflow-x-auto">
//         <div className="inline-block min-w-full">
//           {/* Month Labels */}
//           <div className="flex mb-1 pl-8">
//             {weeks?.map((week, idx) => {
//               const firstDate = getFirstValidDate(week);
//               const showMonth = isNewMonth(idx);
//               const marginLeft = isNewMonth(idx) && idx > 0 ? "12px" : "0px";

//               return (
//                 <div
//                   key={idx}
//                   className="w-3 text-xs text-gray-500 text-center"
//                   style={{
//                     marginRight: "2px",
//                     marginLeft: marginLeft,
//                   }}
//                 >
//                   {showMonth && firstDate ? getMonthLabel(firstDate) : ""}
//                 </div>
//               );
//             })}
//           </div>

//           <div className="flex">
//             {/* Day Labels */}
//             <div className="flex flex-col justify-between mr-1 text-xs text-gray-400 pr-1">
//               {["Sun", "", "Tue", "", "Thu", "", "Sat"].map((day, i) => (
//                 <div key={i} className="h-3 leading-3 text-right">
//                   {day}
//                 </div>
//               ))}
//             </div>

//             {/* Heatmap Grid */}
//             <div className="flex gap-0.5">
//               {weeks.map((week, weekIdx) => {
//                 const marginLeft =
//                   isNewMonth(weekIdx) && weekIdx > 0 ? "12px" : "0px";

//                 return (
//                   <div
//                     key={weekIdx}
//                     className="flex flex-col gap-0.5"
//                     style={{ marginLeft: marginLeft }}
//                   >
//                     {week.map((date, dayIdx) => {
//                       // Handle null dates (empty slots)
//                       if (!date) {
//                         return (
//                           <div
//                             key={`empty-${weekIdx}-${dayIdx}`}
//                             className="w-3 h-3"
//                           />
//                         );
//                       }

//                       const key = date.toISOString().split("T")[0];
//                       const entry = moodMap.get(key);
//                       const isToday =
//                         key === new Date().toISOString().split("T")[0];
//                       const isFuture = date > new Date();

//                       return (
//                         <div
//                           key={key}
//                           className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200  ${
//                             isFuture ? "opacity-30" : ""
//                           }`}
//                           style={{
//                             backgroundColor: isFuture
//                               ? "#ebedf0"
//                               : getCellColor(entry),
//                             transform:
//                               hoveredCell === key ? "scale(1.1)" : "scale(1)",
//                           }}
//                           onMouseEnter={() => setHoveredCell(key)}
//                           onMouseLeave={() => setHoveredCell(null)}
//                           title={
//                             isFuture
//                               ? `${formatDate(date)} (Future)`
//                               : entry
//                               ? `${formatDate(date)}: ${entry.mood} (${
//                                   entry.intensity
//                                 }% intensity)`
//                               : `${formatDate(date)}: No mood recorded`
//                           }
//                         />
//                       );
//                     })}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="mt-4 flex items-center justify-between">
//         <div className="flex items-center gap-2 text-xs text-gray-600">
//           <span>Less</span>
//           <div className="flex gap-1">
//             {[0, 1, 2, 3, 4].map((level) => (
//               <div
//                 key={level}
//                 className="w-3 h-3 rounded-sm"
//                 style={{
//                   backgroundColor:
//                     level === 0
//                       ? "#ebedf0"
//                       : hexToRGBA("#22c55e", 0.2 + level * 0.2),
//                 }}
//               />
//             ))}
//           </div>
//           <span>More</span>
//         </div>

//         <div className="text-xs text-gray-500">
//           {moodData.length} entries in the last year
//         </div>
//       </div>

//       {/* Mood Legend */}
//       <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//         <h3 className="text-sm font-medium text-gray-900 mb-2">Mood Colors</h3>
//         <div className="flex flex-wrap gap-3">
//           {Object.entries(moodColors).map(([mood, color]) => (
//             <div key={mood} className="flex items-center gap-1">
//               <div
//                 className="w-3 h-3 rounded-sm"
//                 style={{ backgroundColor: hexToRGBA(color, 0.7) }}
//               />
//               <span className="text-xs text-gray-600 capitalize">{mood}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";

// Type for each day’s mood
type MoodDay = {
  date: string; // "YYYY-MM-DD"
  mood: string;
  intensity: number; // 0 to 100
};

// Mood base colors
const moodColors: Record<string, string> = {
  happy: "#FFD700",
  sad: "#4A90E2",
  angry: "#FF6B6B",
  anxious: "#9B59B6",
  depressed: "#7F8C8D",
  neutral: "#95A5A6",
};

// Convert hex color to RGBA
function hexToRGBA(hex: string, alpha: number): string {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

function getMonthLabel(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleString("default", { month: "short" });
}

export default function MoodHeatmap() {
  const [moodData, setMoodData] = useState<MoodDay[]>([]);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from your backend API
    const fetchMoodData = async () => {
      try {
        const res = await fetch("/api/moods/mood-history");
        const data = await res.json();
        setMoodData(data);
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    };

    fetchMoodData();
  }, []);

  const moodMap = new Map(moodData.map((m) => [m.date, m]));

  // Generate calendar grid for past year
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 365);
  while (start.getDay() !== 0) start.setDate(start.getDate() - 1);

  const weeks: Date[][] = [];
  let current = new Date(start);
  let currentMonth = current.getMonth();

  while (current <= end) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      if (current <= end) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      } else {
        week.push(null as any);
      }
    }
    weeks.push(week);
  }

  const isNewMonth = (weekIndex: number): boolean => {
    if (weekIndex === 0) return true;
    const currentWeek = weeks[weekIndex];
    const prevWeek = weeks[weekIndex - 1];
    const currDate = currentWeek.find((d) => d !== null);
    const prevDate = prevWeek.find((d) => d !== null);
    if (!currDate || !prevDate) return false;
    return currDate.getMonth() !== prevDate.getMonth();
  };

  const getIntensityLevel = (intensity: number): number => {
    if (intensity === 0) return 0;
    if (intensity <= 25) return 1;
    if (intensity <= 50) return 2;
    if (intensity <= 75) return 3;
    return 4;
  };

  const getCellColor = (entry: MoodDay | undefined): string => {
    if (!entry) return "#ebedf0";
    const base = moodColors[entry.mood] || "#95A5A6";
    const level = getIntensityLevel(entry.intensity);
    const alphas = [0, 0.3, 0.5, 0.7, 0.9];
    return hexToRGBA(base, alphas[level]);
  };

  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Mood Activity
        </h2>
        <p className="text-sm text-gray-600">
          Track your daily mood patterns over the past year
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          <div className="flex mb-1 pl-8">
            {weeks.map((week, idx) => {
              const firstDate = week.find((d) => d !== null);
              return (
                <div
                  key={idx}
                  className="w-3 text-xs text-gray-500 text-center"
                  style={{
                    marginRight: "2px",
                    marginLeft: isNewMonth(idx) && idx > 0 ? "12px" : "0px",
                  }}
                >
                  {isNewMonth(idx) && firstDate ? getMonthLabel(firstDate) : ""}
                </div>
              );
            })}
          </div>

          <div className="flex">
            {/* Day Labels */}
            <div className="flex flex-col justify-between mr-1 text-xs text-gray-400 pr-1">
              {["Sun", "", "Tue", "", "Thu", "", "Sat"].map((day, i) => (
                <div key={i} className="h-3 leading-3 text-right">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-0.5">
              {weeks.map((week, weekIdx) => (
                <div
                  key={weekIdx}
                  className="flex flex-col gap-0.5"
                  style={{
                    marginLeft: isNewMonth(weekIdx) && weekIdx > 0 ? "12px" : 0,
                  }}
                >
                  {week.map((date, dayIdx) => {
                    if (!date)
                      return (
                        <div
                          key={`empty-${weekIdx}-${dayIdx}`}
                          className="w-3 h-3"
                        />
                      );

                    const key = date.toISOString().split("T")[0];
                    const entry = moodMap.get(key);
                    const isToday =
                      key === new Date().toISOString().split("T")[0];
                    const isFuture = date > new Date();

                    return (
                      <div
                        key={key}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 ${
                          isFuture ? "opacity-30" : ""
                        }`}
                        style={{
                          backgroundColor: isFuture
                            ? "#ebedf0"
                            : getCellColor(entry),
                          transform:
                            hoveredCell === key ? "scale(1.1)" : "scale(1)",
                        }}
                        onMouseEnter={() => setHoveredCell(key)}
                        onMouseLeave={() => setHoveredCell(null)}
                        title={
                          isFuture
                            ? `${formatDate(date)} (Future)`
                            : entry
                            ? `${formatDate(date)}: ${entry.mood} (${
                                entry.intensity
                              }%)`
                            : `${formatDate(date)}: No mood recorded`
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    level === 0
                      ? "#ebedf0"
                      : hexToRGBA("#22c55e", 0.2 + level * 0.2),
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
        <div className="text-xs text-gray-500">
          {moodData.length} entries in the last year
        </div>
      </div>

      {/* Mood Color Key */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Mood Colors</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(moodColors).map(([mood, color]) => (
            <div key={mood} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: hexToRGBA(color, 0.7) }}
              />
              <span className="text-xs text-gray-600 capitalize">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
