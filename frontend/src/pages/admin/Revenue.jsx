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

// ---------------- UI ----------------
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
        className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center`}
      >
        <Icon icon={icon} className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {right}
  </div>
);

// ---------------- PAGE ----------------
const RevenuePage = () => {
  const [range, setRange] = useState("month");
  const [data, setData] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchRevenueSummary(range);
      if (res.data?.success) setData(res.data.data);
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

  const handleExport = async () => {
    try {
      const toastId = toast.loading("Preparing revenue report...");

      const res = await requestRevenueExport();
      const exportId = res?.data?.exportId;

      if (!exportId) {
        toast.error("Export failed to start");
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
          }

          if (status === "failed") {
            clearInterval(interval);
            toast.dismiss(toastId);
            toast.error("Export failed");
          }

          if (attempts >= maxAttempts) {
            clearInterval(interval);
            toast.dismiss(toastId);
            toast.error("Export timed out");
          }
        } catch (err) {
          clearInterval(interval);
          toast.dismiss(toastId);
          toast.error("Error checking export status");
        }
      }, 3000);
    } catch (err) {
      toast.error("Error generating report");
    }
  };

  // ---------------- CONVERSION ----------------
  const gross = revenue.grossVolume / 100;
  const platform = revenue.platformProfit / 100;
  const penalty = revenue.penalty / 100;
  const refunds = revenue.refunds / 100;
  const payouts = revenue.doctorPayouts / 100;

  const totalProfit = platform + penalty;

  const refundRate = gross ? ((refunds / gross) * 100).toFixed(1) : 0;
  const payoutRate = gross ? ((payouts / gross) * 100).toFixed(1) : 0;
  const profitMargin = gross ? ((totalProfit / gross) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen  dark:bg-gray-950">
      <div className=" mx-auto px-4 py-6">
        {/* HEADER */}
        <PageBanner config={pageBannerConfig.adminRevenue}/>

        {/* ----------- GROUPED KPI CARDS ------------*/}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          {/* REVENUE CORE */}
          <Card>
            <CardHeader
              icon="mdi:cash"
              iconBg="bg-amber-50 dark:bg-amber-950"
              iconColor="text-amber-600"
              title="Revenue"
              subtitle="Total inflow & earnings"
              right={<span className="text-xs">₹{gross.toFixed(0)}</span>}
            />
            <div className="p-4 text-xs space-y-1 text-gray-600 dark:text-gray-300">
              <div>Platform Profit: ₹{platform.toFixed(0)}</div>
              <div>Penalty Income: ₹{penalty.toFixed(0)}</div>
              <div className="font-semibold text-gray-900 dark:text-white pt-1">
                Total Profit: ₹{totalProfit.toFixed(0)}
              </div>
            </div>
          </Card>

          {/* COSTS */}
          <Card>
            <CardHeader
              icon="mdi:cash-minus"
              iconBg="bg-red-50 dark:bg-red-950"
              iconColor="text-red-600"
              title="Outflows"
              subtitle="Refunds & payouts"
              right={
                <span className="text-xs">
                  ₹{(refunds + payouts).toFixed(0)}
                </span>
              }
            />
            <div className="p-4 text-xs space-y-1 text-gray-600 dark:text-gray-300">
              <div>
                Refunds: ₹{refunds.toFixed(0)} ({refundRate}%)
              </div>
              <div>
                Doctor Payouts: ₹{payouts.toFixed(0)} ({payoutRate}%)
              </div>
            </div>
          </Card>

          {/* -------- ACTIVITY -----*/}
          <Card>
            <CardHeader
              icon="mdi:swap-horizontal"
              iconBg="bg-blue-50 dark:bg-blue-950"
              iconColor="text-blue-600"
              title="Activity"
              subtitle="System usage metrics"
              right={
                <span className="text-xs">{revenue.totalTransactions}</span>
              }
            />
            <div className="p-4 text-xs space-y-1 text-gray-600 dark:text-gray-300">
              <div>Transactions: {revenue.totalTransactions}</div>
              <div>Consultations: {revenue.consultations}</div>
              <div className="font-semibold text-gray-900 dark:text-white pt-1">
                Profit Margin: {profitMargin}%
              </div>
            </div>
          </Card>
        </div>

        {/* -------INSIGHTS --------- */}
        <Card>
          <CardHeader
            icon="mdi:lightbulb"
            iconBg="bg-yellow-50 dark:bg-yellow-950"
            iconColor="text-yellow-600"
            title="Insights"
            subtitle="Auto-generated analytics"
          />

          <div className="p-4 text-xs grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
            <div>Gross Revenue: ₹{gross.toFixed(0)}</div>
            <div>Total Profit: ₹{totalProfit.toFixed(0)}</div>
            <div>Refund Rate: {refundRate}%</div>
            <div>Payout Ratio: {payoutRate}%</div>
          </div>
        </Card>

        {/* EXPORT */}
        <div className="flex justify-end mt-5 gap-3">
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              className="px-4 py-2 text-xs bg-emerald-600 text-white rounded-lg"
            >
              Download Report
            </a>
          )}

          <button
            onClick={handleExport}
            className="px-4 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;
