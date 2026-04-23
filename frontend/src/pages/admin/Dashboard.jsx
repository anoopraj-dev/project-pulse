import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from "recharts";

import {
  fetchDashboardAlerts,
  fetchDashboardCounts,
  fetchDashboardStats,
  fetchDoctorById,
  fetchRevenueOverview,
  fetchUserGrowth,
} from "../../api/admin/adminApis";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";

// ---------------- Reusable Components ------------------

const mockTraffic = {
  todayVisits: 128,
  weeklyVisits: 842,
  uniqueUsers: 37,
};

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

const StatCard = ({
  label,
  value,
  change,
  changeType,
  icon,
  iconBg,
  iconColor,
}) => (
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
        {changeType === "up" && (
          <Icon icon="mdi:trending-up" className="w-3 h-3" />
        )}
        {changeType === "down" && (
          <Icon icon="mdi:trending-down" className="w-3 h-3" />
        )}
        {changeType === "neutral" && (
          <Icon icon="mdi:clock-outline" className="w-3 h-3" />
        )}
        {change}
      </p>
    )}
  </div>
);

// ---------------- Main Component ------------------

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [counts, setCounts] = useState(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [alerts,setAlerts] = useState([])
  const [range, setRange] = useState("week");

  const navigate = useNavigate();

  //------------ REVIEW PENDING APPROVAL ---------------
  const handleReview = async (id) => {
    try {
      const doctor = await fetchDoctorById(id);
      if (!doctor) {
        toast.error("Doctor not found");
        return;
      }
      navigate(`/admin/doctor/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch doctor");
    }
  };

  //------------ FETCH DATA -----------------
  const fetchStats = async () => {
    try {
      const stats = await fetchDashboardStats(range);
      setData(stats);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    const loadCounts = async () => {
      try {
        setLoadingCounts(true);

        const res = await fetchDashboardCounts();
        if (!res?.success) {
          toast.error("Failed to load stats");
          return;
        }
        console.log("stats", res);
        setCounts(res.data);
      } catch (error) {
        console.log("Counts error:", error);
        toast.error("Failed to load stats");
      } finally {
        setLoadingCounts(false);
      }
    };

    loadCounts();
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  //---------- FETCH REVENUE CHART DATA ---------------
  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const res = await fetchRevenueOverview(range);
        console.log(res)
        if (res.success) {
          setRevenueData(res.data);
        }
      } catch (error) {
        toast.error("Failed to load revenue chart");
      }
    };
    loadRevenue();
  }, [range]);

  //------------- FETCH USER GROWTH -------------
  useEffect(() => {
    const loadGrowth = async () => {
      try {
        const res = await fetchUserGrowth();
        if (res.success) {
          setUserGrowthData(res.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load user growth");
      }
    };
    loadGrowth();
  }, []);

  //--------------- FETCH ALERTS -------------
useEffect(() => {
  const loadAlerts = async () => {
    try {
      const res = await fetchDashboardAlerts();

      console.log("alerts", res);

      if (res.data.success) {
        setAlerts([
          ...(res.data.data.alerts || []),
          ...(res.data.data.tickets || []),
        ]);
      }

    } catch (error) {
      console.log(error);
    }
  };

  loadAlerts();
}, []);

  return (
    <div className="min-h-screen  dark:bg-gray-950 font-sans">
      <div className="w-full mx-auto px-4 py-6 pb-16">
        {/* Header */}
      <PageBanner config={pageBannerConfig.adminDashboard}/>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard
            label="Doctors"
            value={loadingCounts ? "..." : (counts?.doctorCount ?? 0)}
            change="Registered doctors"
            changeType="neutral"
            icon="mdi:doctor"
            iconBg="bg-blue-50 dark:bg-blue-950"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            label="Patients"
            value={loadingCounts ? "..." : (counts?.patientCount ?? 0)}
            change="Registered patients"
            changeType="neutral"
            icon="mdi:account-group"
            iconBg="bg-purple-50 dark:bg-purple-950"
            iconColor="text-purple-600 dark:text-purple-400"
          />

          <StatCard
            label="Appointments"
            value={loadingCounts ? "..." : (counts?.appointmentCount ?? 0)}
            change="Total appointments"
            changeType="neutral"
            icon="mdi:calendar-check"
            iconBg="bg-emerald-50 dark:bg-emerald-950"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />

          <StatCard
            label="Revenue"
            value={
              loadingCounts
                ? "..."
                : `₹${(counts?.revenue ?? 0).toLocaleString()}`
            }
            change="Total revenue"
            changeType="neutral"
            icon="mdi:cash-multiple"
            iconBg="bg-amber-50 dark:bg-amber-950"
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Row 2 — Charts + Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          {/* Revenue Chart */}

<Card className="lg:col-span-3">
  <CardHeader
    icon="mdi:finance"
    iconBg="bg-amber-50 dark:bg-amber-950"
    iconColor="text-amber-600 dark:text-amber-400"
    title="Revenue Overview"
    subtitle="Cashflow (Last 7 days)"
    right={
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 uppercase tracking-wide">
        Multi-metric
      </span>
    }
  />


<div className=" p-2 flex gap-2 mb-3">
  {["day", "week", "month", "year"].map((item) => (
    <button
      key={item}
      onClick={() => setRange(item)}
      className={`text-[11px] px-3 py-1 rounded-full border ${
        range === item
          ? "bg-amber-500 text-white"
          : "bg-white dark:bg-gray-900 text-gray-500"
      }`}
    >
      {item}
    </button>
  ))}
</div>

  <div className="px-5 pt-4 pb-3">

    {/* ---------------- TOTAL PROFIT SUMMARY ---------------- */}
    <div className="flex items-baseline gap-2 mb-4">
      <span className="text-2xl font-semibold text-gray-900 dark:text-white">
        ₹
        {revenueData.reduce(
          (sum, item) => sum + (item.profit || 0),
          0
        ).toLocaleString()}
      </span>

      <span className="text-xs text-gray-500">
        total profit (7 days)
      </span>
    </div>

    {/* ---------------- CHART ---------------- */}
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={revenueData}>

        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

        <XAxis
          dataKey="label"
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${v}`}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            fontSize: "12px",
          }}
          formatter={(value, name) => [
            `₹${value.toLocaleString()}`,
            name,
          ]}
        />

        {/* ---------------- LEGEND ---------------- */}
        <Legend wrapperStyle={{ fontSize: "11px" }} />

        {/* ---------------- INFLOW ---------------- */}
        <Line
          type="monotone"
          dataKey="gross"
          stroke="#3b82f6" // blue
          strokeWidth={2}
          dot={{ r: 2 }}
          name="Cash Inflow"
        />

        {/* ---------------- PROFIT ---------------- */}
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#10b981" // green
          strokeWidth={2}
          dot={{ r: 2 }}
          name="Total Profit"
        />

        {/* ---------------- PLATFORM FEE ---------------- */}
        <Line
          type="monotone"
          dataKey="platformFee"
          stroke="#22c55e"
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={false}
          name="Platform Fee"
        />

        {/* ---------------- OUTFLOW ---------------- */}
        <Line
          type="monotone"
          dataKey="payouts"
          stroke="#ef4444" // red
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 2 }}
          name="Doctor Payouts"
        />

        <Line
          type="monotone"
          dataKey="refunds"
          stroke="#f59e0b" // amber
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 2 }}
          name="Refunds"
        />

      </LineChart>
    </ResponsiveContainer>
  </div>
</Card>

          {/* Pending Approvals */}
          <Card className="lg:col-span-2">
            <CardHeader
              icon="mdi:account-alert"
              iconBg="bg-red-50 dark:bg-red-950"
              iconColor="text-red-600 dark:text-red-400"
              title="Pending Approvals"
              subtitle="Doctors awaiting review"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 uppercase tracking-wide">
                  {data?.pendingDoctorsApproval?.length ?? 0} pending
                </span>
              }
            />
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {!data?.pendingDoctorsApproval ||
              data.pendingDoctorsApproval.length === 0 ? (
                <div className="px-4 py-3 text-[11px] text-gray-400">
                  No pending approvals
                </div>
              ) : (
                data.pendingDoctorsApproval.map((doctor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-400" />
                    <img
                      src={doctor?.profilePicture || "/profile.png"}
                      alt=""
                      className="w-8 h-8 rounded-xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {doctor?.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                        {doctor?.professionalInfo?.specializations}
                      </p>
                    </div>
                    <button
                      className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition flex-shrink-0"
                      onClick={() => handleReview(doctor?._id)}
                    >
                      Review
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Row 3 — User Growth + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* User Growth Chart */}
          <Card>
            <CardHeader
              icon="mdi:chart-bar"
              iconBg="bg-blue-50 dark:bg-blue-950"
              iconColor="text-blue-600 dark:text-blue-400"
              title="User Growth"
              subtitle="Doctors vs Patients"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 uppercase tracking-wide">
                  6 months
                </span>
              }
            />
            <div className="px-5 pt-4 pb-3">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={userGrowthData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />

                  {/* Doctors - Blue */}
                  <Bar
                    dataKey="doctors"
                    stackId="users"
                    fill="#2563eb"
                    name="Doctors"
                    radius={[4, 4, 0, 0]}
                  />

                  {/* Patients - Amber (high contrast with blue) */}
                  <Bar
                    dataKey="patients"
                    stackId="users"
                    fill="#f59e0b"
                    name="Patients"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Activity */}
       <Card>
  <CardHeader
    icon="mdi:lifebuoy"
    iconBg="bg-red-50 dark:bg-red-950"
    iconColor="text-red-600 dark:text-red-400"
    title="Support Center"
    subtitle="Alerts & user queries"
    right={
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 uppercase tracking-wide">
        {alerts?.length || 0} new
      </span>
    }
  />

  <div className="divide-y divide-gray-50 dark:divide-gray-800">

    {!alerts || alerts.length === 0 ? (
      <div className="px-4 py-6 text-xs text-gray-400">
        No alerts available
      </div>
    ) : (
      alerts.map((item, index) => (
        <div key={item._id || index} className="px-4 py-3 space-y-2">

          {/* ---------------- TYPE ---------------- */}
          <p className={`text-[10px] font-semibold uppercase tracking-wide
            ${
              item.type === "system"
                ? "text-red-500"
                : item.type === "payment"
                ? "text-orange-500"
                : item.type === "refund"
                ? "text-purple-500"
                : "text-blue-500"
            }
          `}>
            {item.type}
          </p>

          <div className="flex items-center gap-3">

            {/* ---------------- PRIORITY DOT ---------------- */}
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                ${
                  item.priority === "urgent" || item.priority === "high"
                    ? "bg-red-400"
                    : item.priority === "medium"
                    ? "bg-orange-400"
                    : "bg-blue-400"
                }
              `}
            />

            {/* ---------------- CONTENT ---------------- */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                {item.title}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {item.message}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* ---------------- PRIORITY LABEL ---------------- */}
            {item.priority && (
              <span
                className={`text-[10px] font-semibold ${
                  item.priority === "urgent" || item.priority === "high"
                    ? "text-red-500"
                    : item.priority === "medium"
                    ? "text-orange-500"
                    : "text-gray-500"
                }`}
              >
                {item.priority}
              </span>
            )}

          </div>
        </div>
      ))
    )}

  </div>
</Card>
        </div>
        <StatCard
  label="Dashboard Traffic"
  value={mockTraffic.todayVisits}
  change="Today visits"
  changeType="neutral"
  icon="mdi:chart-line"
  iconBg="bg-indigo-50 dark:bg-indigo-950"
  iconColor="text-indigo-600 dark:text-indigo-400"
/>
      </div>
    </div>
  );
};



export default Dashboard;
