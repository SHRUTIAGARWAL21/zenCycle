import DailySummary from "@/components/dailySummary";
import ProductivityCalendar from "@/components/monthlyCalander";
import React from "react";

export default function DailySummaryPage() {
  return (
    <div className="p-4">
      <DailySummary />
      <ProductivityCalendar />
    </div>
  );
}
