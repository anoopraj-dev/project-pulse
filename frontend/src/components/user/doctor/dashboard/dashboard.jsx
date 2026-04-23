import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

import {
  fetchDoctorRevenue,
  fetchUpcomingAppointments,
  fetchDoctorStats,
  fetchRecentPatients,
  fetchPatientReviews,
} from "@/api/doctor/doctorApis";
import toast from "react-hot-toast";

// ---------------- Sub-components ------------------

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

//-------------Stat card --------------
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
      {value}
    </p>
    {change && (
      <p
        className={`text-[11px] mt-2 flex items-center gap-1 ${changeType === "up" ? "text-emerald-600 dark:text-emerald-400" : changeType === "down" ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}
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

const StarRating = ({ rating, size = "sm" }) => {
  const sz = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          icon="mingcute:star-fill"
          className={`${sz} ${i < rating ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}`}
        />
      ))}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 shadow-sm">
        {/* X-axis label */}
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">
          {label}
        </p>

        {/* Daily */}
        {payload.find((p) => p.dataKey === "daily") && (
          <p className="text-xs text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-[#0096C7]">Daily:</span> ₹
            {payload.find((p) => p.dataKey === "daily").value.toLocaleString()}
          </p>
        )}

        {/* Cumulative */}
        {payload.find((p) => p.dataKey === "cumulative") && (
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
            <span className="font-semibold text-green-500">Cumulative:</span> ₹
            {(
              payload.find((p) => p.dataKey === "cumulative").value / 100
            ).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  return null;
};

//-------------Main Dashboad ------------------

const Dashboard = () => {
  const [rangeLabel, setRangeLabel] = useState("7 days");
  //------------- revenue ------------------
  const [revenueData, setRevenueData] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewSummary, setReviewSummary] = useState(null);

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

  //--------- api calls--------
  //------- revenue -------------
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);

        const res = await fetchDoctorRevenue(rangeLabel);

        console.log(res);

        if (!res.data.success) toast.error("revenue fetch failed");

        setRevenueData(res?.data?.data?.chart);
        setRevenueSummary(res?.data?.data?.totalRevenue);
      } catch (error) {
        console.log("Revenue fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [rangeLabel]);

  //------------- appointments -------------
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);

        const res = await fetchUpcomingAppointments();

        console.log("appointments", res);

        if (!res.data.success) {
          toast.error("Failed to load appointments");
          return;
        }

        setAppointments(res?.data?.data || []);
      } catch (error) {
        console.log("Appointments fetch error:", error);
        toast.error("Could not load appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, []);

  //------------- dashboard stats --------------
  useEffect(() => {
    const getStats = async () => {
      try {
        setLoadingStats(true);

        const res = await fetchDoctorStats();

        if (!res.data.success) {
          toast.error("Failed to load stats");
          return;
        }

        setStats(res.data.data);
      } catch (err) {
        console.log("Stats fetch error:", err);
        toast.error("Could not load stats");
      } finally {
        setLoadingStats(false);
      }
    };

    getStats();
  }, []);

  //------------- patients -------------
  useEffect(() => {
    const loadRecentPatients = async () => {
      try {
        setLoadingPatients(true);

        const res = await fetchRecentPatients();

        if (!res.data.success) {
          toast.error("Failed to load recent patients");
          return;
        }

        setRecentPatients(res.data.data);
      } catch (err) {
        console.log("Recent patients error:", err);
        toast.error("Could not load recent patients");
      } finally {
        setLoadingPatients(false);
      }
    };

    loadRecentPatients();
  }, []);

  //------------- Reviews ---------------
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoadingReviews(true);

        const res = await fetchPatientReviews();

        if (!res.data.success) {
          toast.error("Failed to load reviews");
          return;
        }

        console.log("reviews", res);

        setReviews(res.data.data.data || res.data.data || []);
        setReviewSummary(res?.data?.data?.summary);
      } catch (err) {
        console.log("Reviews fetch error:", err);
        toast.error("Could not load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    loadReviews();
  }, []);
  //------------ helpers -------------
  const getConsultationChange = () => {
    if (!stats) return "";

    const diff = stats.todayConsultations - stats.yesterdayConsultations;

    if (diff > 0) return `${diff} more than yesterday`;
    if (diff < 0) return `${Math.abs(diff)} less than yesterday`;
    return "Same as yesterday";
  };

  const getEarningsChange = () => {
    if (!stats) return "";

    const diff = stats.weeklyEarnings - stats.lastWeekEarnings;

    if (diff > 0) return `₹${diff.toLocaleString()} vs last week`;
    if (diff < 0) return `₹${Math.abs(diff).toLocaleString()} drop`;
    return "No change";
  };

  const total = reviewSummary?.totalReviews || 1;
  const breakdown = reviewSummary?.breakdown || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  const getWidth = (count) => `${(count / total) * 100}%`;

  return (
    <div className="min-h-screen dark:bg-gray-950 font-sans">
      <div className="w-full mx-auto px-4 py-6 pb-16">

        {/* -------- Stat Cards ------ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard
            label="Today's consultations"
            value={loadingStats ? "..." : (stats?.todayConsultations ?? 0)}
            change={stats ? getConsultationChange() : ""}
            changeType={
              !stats
                ? "neutral"
                : stats.todayConsultations > stats.yesterdayConsultations
                  ? "up"
                  : stats.todayConsultations < stats.yesterdayConsultations
                    ? "down"
                    : "neutral"
            }
            icon="mdi:stethoscope"
            iconBg="bg-blue-50 dark:bg-blue-950"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            label="Upcoming appointments"
            value={loadingStats ? "..." : (stats?.upcomingAppointments ?? 0)}
            change={
              stats?.nextAppointmentInMinutes != null
                ? `Next in ${stats.nextAppointmentInMinutes} min`
                : "No upcoming"
            }
            changeType="neutral"
            icon="mdi:calendar-clock"
            iconBg="bg-purple-50 dark:bg-purple-950"
            iconColor="text-purple-600 dark:text-purple-400"
          />

          <StatCard
            label="Total completed"
            value={loadingStats ? "..." : (stats?.totalCompleted ?? 0)}
            change={
              stats ? `${stats.completedThisWeek ?? 0} added this week` : ""
            }
            changeType="up"
            icon="mdi:check-circle-outline"
            iconBg="bg-emerald-50 dark:bg-emerald-950"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />

          <StatCard
            label="This week's earnings"
            value={
              loadingStats
                ? "..."
                : `₹${(stats?.weeklyEarnings ?? 0).toLocaleString()}`
            }
            change={stats ? getEarningsChange() : ""}
            changeType={
              !stats
                ? "neutral"
                : stats.weeklyEarnings > stats.lastWeekEarnings
                  ? "up"
                  : stats.weeklyEarnings < stats.lastWeekEarnings
                    ? "down"
                    : "neutral"
            }
            icon="mdi:currency-inr"
            iconBg="bg-amber-50 dark:bg-amber-950"
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* ------ Row 2: Revenue + Upcoming ------ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          {/* Revenue Chart */}
          <Card className="lg:col-span-3">
            <CardHeader
              icon="mdi:chart-line"
              iconBg="bg-blue-50 dark:bg-blue-950"
              iconColor="text-blue-600 dark:text-blue-400"
              title="Revenue"
              subtitle={`Last ${rangeLabel}`}
              right={
                <div className="flex items-center gap-1">
                  {["7 days", "30 days"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRangeLabel(r)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition ${
                        rangeLabel === r
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ₹{revenueSummary?.toLocaleString() || 0}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <Icon icon="mdi:trending-up" className="w-3.5 h-3.5" /> +18%
                  vs previous
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
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: "#0096C7",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />

                  {/* Legend */}
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "10px",
                      color: "#6b7280",
                      paddingBottom: 8,
                    }}
                  />

                  {/* Daily */}
                  <Line
                    type="monotone"
                    dataKey="daily"
                    name="Daily Revenue"
                    stroke="#0096C7"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#0096C7" }}
                    activeDot={{ r: 5 }}
                  />

                  {/* Cumulative */}
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    name="Cumulative Revenue"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#22c55e" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader
              icon="mdi:calendar-check"
              iconBg="bg-emerald-50 dark:bg-emerald-950"
              iconColor="text-emerald-600 dark:text-emerald-400"
              title="Upcoming"
              subtitle="Next appointments"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 uppercase tracking-wide">
                  Today
                </span>
              }
            />

            {/* Ongoing Banner */}
            {/* <div className="mx-4 mt-3 mb-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 px-3.5 py-2.5 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 truncate">
                  Riya Nair — In progress
                </p>
                <p className="text-[10px] text-blue-500 dark:text-blue-400">
                  Video · Started 10 min ago
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition flex-shrink-0">
                Join
              </button>
            </div> */}

            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {loadingAppointments ? (
                <p className="px-4 py-3 text-xs text-gray-400">Loading...</p>
              ) : appointments.length === 0 ? (
                <p className="px-4 py-3 text-xs text-gray-400">
                  No upcoming appointments
                </p>
              ) : (
                appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    {/* Dot */}
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-400" />

                    {/* Profile */}
                    <img
                      src={
                        appt.profilePicture ||
                        `https://ui-avatars.com/api/?name=${appt.name}`
                      }
                      alt={appt.name}
                      className="w-8 h-8 rounded-xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {appt.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {appt.serviceType}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                        {appt.time}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {appt.duration} min
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* ------Row 3: Patients + Feedback ------ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Patients */}
          <Card>
            <CardHeader
              icon="mdi:account-group-outline"
              iconBg="bg-purple-50 dark:bg-purple-950"
              iconColor="text-purple-600 dark:text-purple-400"
              title="Recent patients"
              subtitle="Last 6 visits"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900 uppercase tracking-wide">
                  6 patients
                </span>
              }
            />

            {/* -------- Recent patients --------- */}
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-50 dark:divide-gray-800">
              {loadingPatients ? (
                <p className="px-4 py-3 text-xs text-gray-400">Loading...</p>
              ) : recentPatients.length === 0 ? (
                <p className="px-4 py-3 text-xs text-gray-400">
                  No recent patients
                </p>
              ) : (
                recentPatients.map((p, i) => (
                  <div
                    key={p._id || i}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    {/* Avatar */}
                    {p.profilePicture ? (
                      <img
                        src={p.profilePicture}
                        alt={p.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-800"
                      />
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300`}
                      >
                        {p.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {p.detail}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {new Date(p.time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Feedback */}
          <Card>
            <CardHeader
              icon="mdi:star-outline"
              iconBg="bg-amber-50 dark:bg-amber-950"
              iconColor="text-amber-500 dark:text-amber-400"
              title="Patient feedback"
              subtitle="Latest reviews"
            />

            {/* Rating Summary */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 dark:border-gray-800">
              <div>
                <p className="text-4xl font-semibold text-gray-900 dark:text-white leading-none">
                  {reviewSummary?.averageRating?.toFixed(1) || "0.0"}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  {reviewSummary?.totalReviews || reviews?.length || 0} reviews
                </p>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const widths = {
                    5: "75%",
                    4: "15%",
                    3: "6%",
                    2: "3%",
                    1: "1%",
                  };
                  return (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 w-2">
                        {star}
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: getWidth(breakdown[star] || 0) }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review list */}
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {loadingReviews ? (
                <p className="px-5 py-3 text-xs text-gray-400">Loading...</p>
              ) : reviews.length === 0 ? (
                <p className="px-5 py-3 text-xs text-gray-400">
                  No feedback yet
                </p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-semibold flex-shrink-0 bg-gray-100 text-gray-700">
                        {r.profilePicture ? (
                          <img
                            src={r.profilePicture}
                            alt={r.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          r.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        )}
                      </div>

                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {r.name}
                      </p>

                      <div className="ml-auto">
                        <StarRating rating={r.rating} />
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {r.text || "No feedbacks"}
                    </p>

                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(r.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
