export const MoodClock = ({ moodData = [] }) => {
  const moodColors: { [key: string]: string } = {
    happy: "#FFD700",
    sad: "#6495ED",
    angry: "#FF6347",
    anxious: "#9370DB",
    depressed: "#708090",
    neutral: "#A9A9A9",
  };

  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  const strokeWidth = 20;

  const polarToCartesian = (cx, cy, r, angle) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(radians),
      y: cy + r * Math.sin(radians),
    };
  };

  const createArcPath = (cx, cy, r, startAngle, endAngle, sw) => {
    const inner = r - sw / 2;
    const outer = r + sw / 2;

    const s1 = polarToCartesian(cx, cy, inner, endAngle);
    const e1 = polarToCartesian(cx, cy, inner, startAngle);
    const s2 = polarToCartesian(cx, cy, outer, endAngle);
    const e2 = polarToCartesian(cx, cy, outer, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      s1.x,
      s1.y,
      "A",
      inner,
      inner,
      0,
      largeArcFlag,
      0,
      e1.x,
      e1.y,
      "L",
      e2.x,
      e2.y,
      "A",
      outer,
      outer,
      0,
      largeArcFlag,
      1,
      s2.x,
      s2.y,
      "Z",
    ].join(" ");
  };

  const createHourSegments = () => {
    const moodByHour = {};
    moodData.forEach((m) => {
      const h = new Date(m.createdAt).getHours();
      if (!moodByHour[h]) moodByHour[h] = [];
      moodByHour[h].push(m);
    });

    return Array.from({ length: 24 }, (_, hour) => {
      const start = hour * 15 - 90;
      const end = (hour + 1) * 15 - 90;
      let mood = "neutral",
        max = 0;
      if (moodByHour[hour]) {
        const moodSum = {};
        moodByHour[hour].forEach((m) => {
          const type = m.moodType.toLowerCase();
          moodSum[type] = (moodSum[type] || 0) + m.moodLevel;
        });
        for (const m in moodSum) {
          if (moodSum[m] > max) {
            max = moodSum[m];
            mood = m;
          }
        }
      }
      return {
        hour,
        startAngle: start,
        endAngle: end,
        color: moodColors[mood] || moodColors.neutral,
        opacity: max > 0 ? 1 : 0.2,
      };
    });
  };

  const segments = createHourSegments();

  const hourMarkers = [];
  for (let hour = 0; hour < 24; hour += 6) {
    const angle = hour * 15 - 90;
    const start = polarToCartesian(centerX, centerY, radius - 35, angle);
    const end = polarToCartesian(centerX, centerY, radius - 25, angle);
    const label = polarToCartesian(centerX, centerY, radius - 15, angle);

    hourMarkers.push(
      <g key={hour}>
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#333"
          strokeWidth="2"
        />
        <text
          x={label.x}
          y={label.y}
          fontSize="12"
          fontWeight="bold"
          fill="#333"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {hour === 0
            ? "12AM"
            : hour < 12
            ? `${hour}AM`
            : hour === 12
            ? "12PM"
            : `${hour - 12}PM`}
        </text>
      </g>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-center gap-4">
        {/* Clock */}
        <svg width="300" height="300" className="flex-shrink-0">
          {segments.map((seg, i) => (
            <path
              key={i}
              d={createArcPath(
                centerX,
                centerY,
                radius,
                seg.startAngle,
                seg.endAngle,
                strokeWidth
              )}
              fill={seg.color}
              opacity={seg.opacity}
              stroke="white"
              strokeWidth="1"
            />
          ))}
          {hourMarkers}
          <circle cx={centerX} cy={centerY} r="15" fill="#333" />
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - radius + 10}
            stroke="red"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={centerX} cy={centerY} r="5" fill="red" />
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-2 pl-2">
          {Object.entries(moodColors).map(([mood, color]) => (
            <div key={mood} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize text-gray-600">{mood}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Each segment represents one hour. Colors show your dominant mood during
        that time.
      </p>
    </div>
  );
};
