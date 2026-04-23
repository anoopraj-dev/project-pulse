
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  fetchRevenueSummary,
  requestRevenueExport,
  getRevenueExportStatus,
} from "@/api/admin/adminApis";
import toast from "react-hot-toast";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";

// ---------------- Shared UI (matches Dashboard) ----------------
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ icon, iconBg, iconColor, title, subtitle, right }) => (
  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon icon={icon} className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {right && <div>{right}</div>}
  </div>
);

const StatCard = ({ label, value, change, changeType, icon, iconBg, iconColor }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <div
        className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon icon={icon} className={`w-4 h-4 ${iconColor}`} />
      </div>
    </div>
    <p className="text-2xl font-semibold text-gray-900 dark:text-white leading-none">
      {value ?? "..."}
    </p>
    {change && (
      <p
        className={`text-[11px] mt-2 flex items-center gap-1 ${
          changeType === "up"
            ? "text-emerald-600 dark:text-emerald-400"
            : changeType === "down"
            ? "text-red-500"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        {changeType === "up" && <Icon icon="mdi:trending-up" className="w-3 h-3" />}
        {changeType === "down" && <Icon icon="mdi:trending-down" className="w-3 h-3" />}
        {changeType === "neutral" && <Icon icon="mdi:clock-outline" className="w-3 h-3" />}
        {change}
      </p>
    )}
  </div>
);

// ---------------- Revenue Page ----------------
const RevenuePage = () => {
  const [range, setRange] = useState("month");
  const [data, setData] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRevenueSummary(range);
        if (res.data?.success) setData(res.data.data);
      } catch {
        toast.error("Failed to load revenue data");
      }
    };
    load();
  }, [range]);

  const revenue = data || {
    grossVolume: 0,
    platformProfit: 0,
    penalty: 0,
    refunds: 0,
    doctorPayouts: 0,
    totalTransactions: 0,
    consultations: 0,
  };

  // ---------------- CONVERSIONS ----------------
  const gross      = revenue.grossVolume    / 100;
  const platform   = revenue.platformProfit / 100;
  const penalty    = revenue.penalty        / 100;
  const refunds    = revenue.refunds        / 100;
  const payouts    = revenue.doctorPayouts  / 100;
  const totalProfit = platform + penalty;

  const refundRate   = gross ? ((refunds      / gross) * 100).toFixed(1) : "0.0";
  const payoutRate   = gross ? ((payouts      / gross) * 100).toFixed(1) : "0.0";
  const profitMargin = gross ? ((totalProfit  / gross) * 100).toFixed(1) : "0.0";

  // ---------------- EXPORT ----------------
  const handleExport = async () => {
    try {
      setExporting(true);
      const toastId = toast.loading("Preparing revenue report...");
      const res = await requestRevenueExport();
      const exportId = res?.data?.exportId;

      if (!exportId) {
        toast.dismiss(toastId);
        toast.error("Export failed to start");
        setExporting(false);
        return;
      }

      let attempts = 0;
      const maxAttempts = 20;

      const interval = setInterval(async () => {
        try {
          attempts++;
          const statusRes = await getRevenueExportStatus(exportId);
          const status = statusRes?.data?.status;

          if (status === "completed") {
            clearInterval(interval);
            toast.dismiss(toastId);
            toast.success("Revenue report ready!");
            setDownloadUrl(`http://localhost:3000${statusRes.data.fileUrl}`);
            setExporting(false);
          }
          if (status === "failed" || attempts >= maxAttempts) {
            clearInterval(interval);
            toast.dismiss(toastId);
            toast.error(status === "failed" ? "Export failed" : "Export timed out");
            setExporting(false);
          }
        } catch {
          clearInterval(interval);
          toast.dismiss(toastId);
          toast.error("Error checking export status");
          setExporting(false);
        }
      }, 3000);
    } catch {
      toast.error("Error generating report");
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-950 font-sans">
      <div className="w-full mx-auto px-4 py-6 pb-16">

        {/* HEADER */}
        <PageBanner config={pageBannerConfig.adminRevenue} />

        {/* ---------------- RANGE SELECTOR ---------------- */}
        <div className="flex items-center gap-1 mb-5 p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl w-fit">
          {["day", "week", "month", "year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-all duration-150 capitalize ${
                range === r
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* ---------------- ROW 1 — STAT CARDS ---------------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard
            label="Gross volume"
            value={`₹${gross.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            change="Total collected"
            changeType="neutral"
            icon="mdi:cash-multiple"
            iconBg="bg-amber-50 dark:bg-amber-950"
            iconColor="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            label="Net profit"
            value={`₹${totalProfit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            change={`${profitMargin}% margin`}
            changeType="up"
            icon="mdi:trending-up"
            iconBg="bg-emerald-50 dark:bg-emerald-950"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label="Total outflows"
            value={`₹${(refunds + payouts).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            change="Refunds + payouts"
            changeType="down"
            icon="mdi:cash-minus"
            iconBg="bg-red-50 dark:bg-red-950"
            iconColor="text-red-600 dark:text-red-400"
          />
          <StatCard
            label="Transactions"
            value={revenue.totalTransactions}
            change={`${revenue.consultations} consultations`}
            changeType="neutral"
            icon="mdi:swap-horizontal"
            iconBg="bg-blue-50 dark:bg-blue-950"
            iconColor="text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* ---------------- ROW 2 — BREAKDOWN + INSIGHTS ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">

          {/* Revenue Breakdown */}
          <Card className="lg:col-span-3">
            <CardHeader
              icon="mdi:cash"
              iconBg="bg-amber-50 dark:bg-amber-950"
              iconColor="text-amber-600 dark:text-amber-400"
              title="Revenue breakdown"
              subtitle="Inflow & earnings detail"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 uppercase tracking-wide">
                  {range}
                </span>
              }
            />
            <div className="p-5 space-y-3">

              {/* Gross row */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:cash-multiple" className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Gross volume</p>
                    <p className="text-[10px] text-gray-400">Total collected from patients</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ₹{gross.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Platform fee row */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:percent" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Platform fee</p>
                    <p className="text-[10px] text-gray-400">Commission on consultations</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ₹{platform.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Penalty row */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:gavel" className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Penalty income</p>
                    <p className="text-[10px] text-gray-400">Cancellation & no-show fees</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  ₹{penalty.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Doctor payouts row */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:doctor" className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Doctor payouts</p>
                    <p className="text-[10px] text-gray-400">{payoutRate}% of gross</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                  − ₹{payouts.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Refunds row */}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:cash-refund" className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Refunds</p>
                    <p className="text-[10px] text-gray-400">{refundRate}% refund rate</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                  − ₹{refunds.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Net Profit total */}
              <div className="flex items-center justify-between pt-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Net profit</p>
                <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                  ₹{totalProfit.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </Card>

          {/* Insights Panel */}
          <Card className="lg:col-span-2">
            <CardHeader
              icon="mdi:lightbulb-outline"
              iconBg="bg-yellow-50 dark:bg-yellow-950"
              iconColor="text-yellow-600 dark:text-yellow-400"
              title="Insights"
              subtitle="Auto-generated analytics"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900 uppercase tracking-wide">
                  Live
                </span>
              }
            />
            <div className="p-5 space-y-3">

              {/* Profit margin */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900">
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide mb-1">Profit margin</p>
                <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">{profitMargin}%</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5">of gross volume</p>
              </div>

              {/* Refund rate */}
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900">
                <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wide mb-1">Refund rate</p>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">{refundRate}%</p>
                <p className="text-[10px] text-red-400 mt-0.5">of gross volume</p>
              </div>

              {/* Payout ratio */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900">
                <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide mb-1">Payout ratio</p>
                <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">{payoutRate}%</p>
                <p className="text-[10px] text-blue-500 mt-0.5">doctor share of gross</p>
              </div>

              {/* Consultations */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Consultations</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-0.5">{revenue.consultations}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                  <Icon icon="mdi:stethoscope" className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* ---------------- EXPORT ROW ---------------- */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
              <Icon icon="mdi:file-chart-outline" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Revenue report</p>
              <p className="text-[11px] text-gray-400">Download a full breakdown for this period</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
              >
                <Icon icon="mdi:download-outline" className="w-3.5 h-3.5" />
                Download
              </a>
            )}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Icon icon={exporting ? "mdi:loading" : "mdi:file-export-outline"} className={`w-3.5 h-3.5 ${exporting ? "animate-spin" : ""}`} />
              {exporting ? "Exporting..." : "Export report"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RevenuePage;