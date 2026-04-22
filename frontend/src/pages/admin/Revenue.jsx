import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { fetchRevenueSummary } from "@/api/admin/adminApis";

// ---------------- UI COMPONENTS ----------------
const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
    {children}
  </div>
);

const CardHeader = ({ icon, title, subtitle, right }) => (
  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <Icon icon={icon} className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
      </div>
    </div>
    {right}
  </div>
);

// ---------------- MAIN PAGE ----------------
const RevenuePage = () => {
  const [range, setRange] = useState("month");
  const [revenueSummary, setRevenueSummary] = useState(null);

  // ---------------- API CALL ----------------
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchRevenueSummary(range);

        if (res.data?.success) {
          setRevenueSummary(res.data.data);
        }
      } catch (err) {
        console.error("Revenue fetch failed", err);
      }
    };

    getData();
  }, [range]);

  // safe fallback (prevents crash before API loads)
  const data = revenueSummary || {
    totalRevenue: 0,
    netRevenue: 0,
    refunds: 0,
    totalTransactions: 0,
    consultations: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              Revenue Dashboard
            </h1>
            <p className="text-xs text-gray-400">
              Consultation & appointment earnings overview
            </p>
          </div>

          <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg">
            Export Report
          </button>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mb-4">
          {["day", "week", "month", "year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded-lg border ${
                range === r
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-gray-200 text-gray-500"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {/* KPI CARDS (UPDATED) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

          <Card>
            <CardHeader
              icon="mdi:cash"
              title="Total Revenue"
              right={<span className="text-xs">₹{data.totalRevenue}</span>}
            />
          </Card>

          <Card>
            <CardHeader
              icon="mdi:bank"
              title="Net Revenue"
              right={<span className="text-xs">₹{data.netRevenue}</span>}
            />
          </Card>

          <Card>
            <CardHeader
              icon="mdi:cash-refund"
              title="Refunds"
              right={<span className="text-xs">₹{data.refunds}</span>}
            />
          </Card>

          <Card>
            <CardHeader
              icon="mdi:swap-horizontal"
              title="Transactions"
              right={<span className="text-xs">{data.totalTransactions}</span>}
            />
          </Card>

        </div>

        {/* SECOND ROW STATS */}
        <div className="grid grid-cols-2 gap-4 mb-5">

          <Card>
            <CardHeader
              icon="mdi:stethoscope"
              title="Consultations"
              right={<span className="text-xs">{data.consultations}</span>}
            />
          </Card>

          <Card>
            <CardHeader
              icon="mdi:chart-line"
              title="Avg Revenue / Transaction"
              right={
                <span className="text-xs">
                  ₹
                  {data.totalTransactions
                    ? Math.round(data.totalRevenue / data.totalTransactions)
                    : 0}
                </span>
              }
            />
          </Card>

        </div>

        {/* PLACEHOLDER SECTIONS (UNCHANGED FOR NOW) */}
        <div className="grid lg:grid-cols-3 gap-4 mb-5">

          <Card>
            <CardHeader
              icon="mdi:chart-line"
              title="Revenue Trend"
              subtitle="Last 30 days"
            />
            <div className="p-6 text-xs text-gray-400">
              [ Revenue Chart Placeholder ]
            </div>
          </Card>

          <Card>
            <CardHeader
              icon="mdi:chart-pie"
              title="Revenue Breakdown"
            />
            <div className="p-4 text-xs space-y-2 text-gray-600 dark:text-gray-300">
              <div>Consultations</div>
              <div>Appointments</div>
              <div>Refund Impact</div>
            </div>
          </Card>

          <Card>
            <CardHeader
              icon="mdi:lightbulb"
              title="Insights"
            />
            <div className="p-4 text-xs space-y-2 text-gray-600 dark:text-gray-300">
              <div>Highest revenue day: Monday</div>
              <div>Top payment method: Razorpay</div>
              <div>Refund rate: {(data.refunds / (data.totalRevenue || 1) * 100).toFixed(1)}%</div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default RevenuePage;