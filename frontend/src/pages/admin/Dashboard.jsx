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
} from "recharts";

import {
  fetchDashboardCounts,
  fetchDashboardStats,
  fetchDoctorById,
  fetchRevenueOverview,
  fetchUserGrowth,
} from "../../api/admin/adminApis";

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
      const stats = await fetchDashboardStats();
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
        const res = await fetchRevenueOverview();
        if (res.success) {
          setRevenueData(res.data);
        }
      } catch (error) {
        toast.error("Failed to load revenue chart");
      }
    };
    loadRevenue();
  }, []);

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

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  const formattedDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-gray-500 dark:text-white">
            {greeting}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 border border-gray-400 rounded-lg p-2">
            {formattedDate}
          </p>
        </div>

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
              subtitle="Last 7 days"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 uppercase tracking-wide">
                  This week
                </span>
              }
            />
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ₹
                  {revenueData.reduce(
                    (sum, item) => sum + (item.revenue || 0),
                    0,
                  )}
                </span>
                <span className="text-xs text-emerald-500 flex items-center gap-0.5">
                  <Icon icon="mdi:trending-up" className="w-3.5 h-3.5" /> +12.4%
                  vs last week
                </span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart
                  data={revenueData}
                  margin={{ top: 0, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#f59e0b" }}
                    activeDot={{ r: 5 }}
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
        5 new
      </span>
    }
  />

  <div className="divide-y divide-gray-50 dark:divide-gray-800">

    {/* ---------------- SYSTEM ALERT ---------------- */}
    <div className="px-4 py-3 space-y-2">
      <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">
        System Alerts
      </p>

      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            Payment failure spike detected
          </p>
          <p className="text-[10px] text-gray-400">
            12 failed transactions in last 1 hour
          </p>
        </div>
        <span className="text-[10px] text-red-500 font-semibold">
          High
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            Doctor verification backlog
          </p>
          <p className="text-[10px] text-gray-400">
            8 doctors pending for more than 7 days
          </p>
        </div>
        <span className="text-[10px] text-orange-500 font-semibold">
          Medium
        </span>
      </div>
    </div>

    {/* ---------------- USER QUERIES ---------------- */}
    <div className="px-4 py-3 space-y-2">
      <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">
        User Queries
      </p>

      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            Cannot book appointment
          </p>
          <p className="text-[10px] text-gray-400">
            “I’m unable to confirm my booking”
          </p>
        </div>
        <button className="text-[10px] text-blue-600 font-semibold">
          View
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            Refund request
          </p>
          <p className="text-[10px] text-gray-400">
            “Payment deducted but appointment failed”
          </p>
        </div>
        <button className="text-[10px] text-blue-600 font-semibold">
          View
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            App performance issue
          </p>
          <p className="text-[10px] text-gray-400">
            “App is slow during doctor search”
          </p>
        </div>
        <button className="text-[10px] text-blue-600 font-semibold">
          View
        </button>
      </div>
    </div>

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
