import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  fetchDashboardChart,
  fetchDashboardStats,
  fetchPatientPrescriptions,
  fetchPatientVitals,
  fetchUpcomingAppointments,
} from "@/api/patient/patientApis";

// ---------------- Reusable Components ------------------

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
      {value}
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
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);
  const [vitals, setVitals] = useState(null);
  const [loadingVitals, setLoadingVitals] = useState(true);
  const navigate = useNavigate();

  //------- api calls -----------
  //------ stats -------------
  useEffect(() => {
    const getStats = async () => {
      try {
        setLoadingStats(true);

        const res = await fetchDashboardStats();

        if (!res.data.success) {
          toast.error("Failed to load stats");
          return;
        }

        setStats(res?.data?.data);
      } catch (err) {
        console.error("Stats fetch error:", err);
        toast.error("Could not load stats");
      } finally {
        setLoadingStats(false);
      }
    };

    getStats();
  }, []);

  //---------------- upcoming appointments ------------

  useEffect(() => {
    const getUpcoming = async () => {
      try {
        setLoadingAppointments(true);

        const res = await fetchUpcomingAppointments();

        if (!res?.data?.success) return;
        setAppointments(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Upcoming error:", err);
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };

    getUpcoming();
  }, []);

  //------------- get chart data ------------
  useEffect(() => {
    const getChart = async () => {
      try {
        const res = await fetchDashboardChart();

        if (!res?.data?.success) return;

        const normalized = (res?.data?.data || []).map((d) => ({
          ...d,
          expenses: Number(d.expenses || 0), // paise => rupees
          consultations: Number(d.consultations || 0),
        }));
        setChartData(normalized);
      } catch (err) {
        console.error("Chart error:", err);
        setChartData([]);
      }
    };

    getChart();
  }, []);

  //------------- get prescriptions --------
  useEffect(() => {
    const getPrescriptions = async () => {
      try {
        setLoadingPrescriptions(true);

        const res = await fetchPatientPrescriptions();

        if (!res?.data?.success) return;

        setPrescriptions(res?.data?.data || []);
      } catch (err) {
        console.error("Prescription error:", err);
        setPrescriptions([]);
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    getPrescriptions();
  }, []);

  //--------------- vitals ---------------
  useEffect(() => {
  const getVitals = async () => {
    try {
      setLoadingVitals(true);

      const res = await fetchPatientVitals();

      if (!res?.data?.success) return;
      const data = res.data.data || {};

      setVitals({
        bp: data?.bloodPressure || "--",
        sugar: data?.sugarLevel || "--",
        weight: data?.weight || "--",
        cholesterol: data?.cholesterol || "--",
      });
    } catch (err) {
      console.error("Vitals error:", err);
      setVitals(null);
    } finally {
      setLoadingVitals(false);
    }
  };

  getVitals();
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
    <div className="min-h-screen font-sans">
      <div className="w-full mx-auto px-4 py-6 pb-16">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard
            label="Appointments"
            value={loadingStats ? "..." : (stats?.totalAppointments ?? 0)}
            change={
              stats
                ? `${stats.totalAppointments - stats.lastMonthAppointments} vs last month`
                : ""
            }
            changeType={
              !stats
                ? "neutral"
                : stats.totalAppointments > stats.lastMonthAppointments
                  ? "up"
                  : stats.totalAppointments < stats.lastMonthAppointments
                    ? "down"
                    : "neutral"
            }
            icon="mdi:calendar"
            iconBg="bg-blue-50 dark:bg-blue-950"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            label="Consultations"
            value={loadingStats ? "..." : (stats?.consultations ?? 0)}
            change="Completed sessions"
            changeType="neutral"
            icon="mdi:stethoscope"
            iconBg="bg-purple-50 dark:bg-purple-950"
            iconColor="text-purple-600 dark:text-purple-400"
          />

          <StatCard
            label="Expenses"
            value={
              loadingStats
                ? "..."
                : `₹${(stats?.expenses ?? 0).toLocaleString()}`
            }
            change={
              stats
                ? `₹${Math.abs(
                    stats.expenses - stats.lastMonthExpenses / 100,
                  ).toLocaleString()} vs last month`
                : ""
            }
            changeType={
              !stats
                ? "neutral"
                : stats.expenses > stats.lastMonthExpenses
                  ? "down" // more expense = bad
                  : "up"
            }
            icon="mdi:currency-inr"
            iconBg="bg-amber-50 dark:bg-amber-950"
            iconColor="text-amber-600 dark:text-amber-400"
          />

          <StatCard
            label="Upcoming"
            value={loadingStats ? "..." : (stats?.upcoming ?? 0)}
            change={
              stats?.upcoming ? `${stats.upcoming} scheduled` : "No upcoming"
            }
            changeType="neutral"
            icon="mdi:calendar-clock"
            iconBg="bg-emerald-50 dark:bg-emerald-950"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          {/* Expense Chart */}
          <Card className="lg:col-span-3">
            <CardHeader
              icon="mdi:chart-line"
              iconBg="bg-amber-50 dark:bg-amber-950"
              iconColor="text-amber-600 dark:text-amber-400"
              title="Expenses"
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
                  {chartData
                    .reduce((sum, d) => sum + (Number(d.expenses) || 0), 0)
                    .toLocaleString()}
                </span>
                <span className="text-xs text-red-500 flex items-center gap-0.5">
                  <Icon icon="mdi:trending-up" className="w-3.5 h-3.5" /> +9.6%
                  vs last week
                </span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart
                  data={chartData}
                  margin={{ top: 0, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.05)"
                    vertical={false}
                  />

                  {/* X Axis */}
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  {/* LEFT Y-AXIS → EXPENSES */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />

                  {/* RIGHT Y-AXIS → CONSULTATIONS */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />

                  {/* EXPENSE LINE */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#f59e0b" }}
                    activeDot={{ r: 5 }}
                  />

                  {/* CONSULTATION LINE */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="consultations"
                    name="Consultations"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#6366f1" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Appointments */}
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
                  Dr. Meera — In progress
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
                <div className="px-4 py-3 text-[11px] text-gray-400">
                  Loading appointments...
                </div>
              ) : !appointments || appointments.length === 0 ? (
                <div className="px-4 py-3 text-[11px] text-gray-400">
                  No upcoming appointments
                </div>
              ) : (
                appointments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    {/* Dot */}
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-400" />

                    {/* Avatar */}
                    <img
                      src={
                        a.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          a.name || "Doctor",
                        )}&background=f0fdf4&color=16a34a`
                      }
                      alt={a.name || "Doctor"}
                      className="w-8 h-8 rounded-xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {a.name || "Doctor"}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {a.type || "Consultation"}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                        {a.time || ""}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {a.date || ""}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Prescriptions */}
          <Card>
            <CardHeader
              icon="mdi:file-document-outline"
              iconBg="bg-blue-50 dark:bg-blue-950"
              iconColor="text-blue-600 dark:text-blue-400"
              title="Prescriptions"
              subtitle="Recent"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 uppercase tracking-wide">
                  {prescriptions.length} records
                </span>
              }
            />

            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {loadingPrescriptions ? (
                <div className="px-4 py-3 text-[11px] text-gray-400">
                  Loading prescriptions...
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="px-4 py-3 text-[11px] text-gray-400">
                  No prescriptions found
                </div>
              ) : (
                prescriptions.map((p) => (
                  <div
                    key={p._id}
                    className="px-4 py-3 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    {/* left indicator */}
                    <span className="w-1.5 h-1.5 mt-2 rounded-full flex-shrink-0 bg-blue-400" />

                    <div className="flex-1 min-w-0">
                      {/* TOP: doctor + date */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {p.doctor?.name || "Doctor"}
                        </p>

                        <p className="text-[10px] text-gray-400 whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>

                      {/* diagnosis (important but subtle) */}
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Diagnosis:{" "}
                        <span className="text-gray-700 dark:text-gray-300">
                          {p.diagnosis}
                        </span>
                      </p>

                      {/* medicines structured */}
                      <div className="mt-2 space-y-1">
                        {p.medicines?.map((m, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[11px] bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1"
                          >
                            {/* medicine name */}
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {m.medicine}
                            </span>

                            {/* tags */}
                            <div className="flex items-center gap-1 text-[10px]">
                              <span className="px-2 py-[2px] rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                {m.dosage}
                              </span>

                              <span
                                className={`px-2 py-[2px] rounded-md ${
                                  m.timing === "before"
                                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                                    : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                                }`}
                              >
                                {m.timing}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* action */}
                    {/* <button
                      onClick={() => setSelectedPrescription(p)}
                      className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 px-2.5 py-1 h-fit rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    >
                      View
                    </button> */}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Vitals */}
          <Card>
            <CardHeader
              icon="mdi:heart-pulse"
              iconBg="bg-red-50 dark:bg-red-950"
              iconColor="text-red-600 dark:text-red-400"
              title="Vitals"
              subtitle="Overview"
              right={
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 uppercase tracking-wide">
                  Latest
                </span>
              }
            />

            <div className="grid grid-cols-2 divide-x divide-y divide-gray-50 dark:divide-gray-800">
              {[
  {
    label: "Blood Pressure",
    value: vitals?.bp ? `${vitals.bp} mmHg` : "--",
    icon: "mdi:blood-bag",
    color: "text-red-500",
  },
  {
    label: "Sugar Level",
    value: vitals?.sugar ? `${vitals.sugar} mg/dL` : "--",
    icon: "mdi:water-percent",
    color: "text-blue-500",
  },
  {
    label: "Weight",
    value: vitals?.weight ? `${vitals.weight} kg` : "--",
    icon: "mdi:scale-bathroom",
    color: "text-emerald-500",
  },
  {
    label: "Cholesterol",
    value: vitals?.cholesterol ? `${vitals.cholesterol} mg/dL` : "--",
    icon: "mdi:heart-pulse",
    color: "text-pink-500",
  },
].map((vital, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {vital.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {vital.value}
                    </p>
                  </div>
                  <Icon
                    icon={vital.icon}
                    className={`w-5 h-5 ${vital.color} flex-shrink-0 opacity-60`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
