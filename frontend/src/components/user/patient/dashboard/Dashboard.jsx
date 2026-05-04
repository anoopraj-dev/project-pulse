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
    <div className="min-h-screen bg-slate-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 space-y-8 pb-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{greeting}, {name?.split(' ')[0]}</h1>
            <p className="text-sm text-slate-500 font-medium">{formattedDate}</p>
          </div>
          <button 
            onClick={() => navigate('/patient/appointments')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0096C7] text-white text-sm font-bold rounded-xl hover:bg-[#0077a1] transition-all shadow-lg shadow-sky-500/20 active:scale-95"
          >
            <Icon icon="ph:calendar-plus-bold" className="h-4 w-4" />
            Book Appointment
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            icon="ph:calendar-bold"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatCard
            label="Consultations"
            value={loadingStats ? "..." : (stats?.consultations ?? 0)}
            change="Completed sessions"
            changeType="neutral"
            icon="ph:stethoscope-bold"
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
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
                  ? "down" 
                  : "up"
            }
            icon="ph:currency-circle-inr-bold"
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <StatCard
            label="Upcoming"
            value={loadingStats ? "..." : (stats?.upcoming ?? 0)}
            change={
              stats?.upcoming ? `${stats.upcoming} scheduled` : "No upcoming"
            }
            changeType="neutral"
            icon="ph:calendar-clock-bold"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
        </div>

        {/* Row 2: Chart & Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expense Chart */}
          <Card className="lg:col-span-2">
            <CardHeader
              icon="ph:chart-line-up-bold"
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              title="Health & Expenses"
              subtitle="Activity from the last 7 days"
              right={
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest">
                  Weekly
                </span>
              }
            />
            <div className="p-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-slate-900">
                  ₹
                  {chartData
                    .reduce((sum, d) => sum + (Number(d.expenses) || 0), 0)
                    .toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Icon icon="ph:trend-up-bold" className="h-3.5 w-3.5" /> +9.6%
                  <span className="text-slate-400 font-medium">vs last week</span>
                </span>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />

                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v >= 1000 ? v / 1000 + 'k' : v}`}
                    />

                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                    />

                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="expenses"
                      name="Expenses"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />

                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="consultations"
                      name="Consultations"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader
              icon="ph:calendar-check-bold"
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              title="Upcoming"
              subtitle="Next scheduled visits"
              right={
                <button 
                  onClick={() => navigate('/patient/appointments')}
                  className="text-[10px] font-bold text-[#0096C7] hover:underline"
                >
                  View All
                </button>
              }
            />

            <div className="divide-y divide-slate-100">
              {loadingAppointments ? (
                <div className="p-8 text-center">
                  <Icon icon="ph:spinner-gap-bold" className="h-6 w-6 text-slate-300 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">Loading...</p>
                </div>
              ) : !appointments || appointments.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon icon="ph:calendar-blank-bold" className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500 font-bold">No appointments</p>
                  <p className="text-xs text-slate-400 mt-1">Ready for a checkup?</p>
                </div>
              ) : (
                appointments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={a.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name || "Dr")}&background=f1f5f9&color=64748b`}
                        alt={a.name}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-[#0096C7] transition-colors truncate">
                        Dr. {a.name || "Doctor"}
                      </p>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                        <Icon icon="ph:tag-bold" className="h-3 w-3" />
                        {a.type || "Consultation"}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-slate-700">
                        {a.time || "TBD"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {a.date || "Today"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Row 3: Prescriptions & Vitals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prescriptions */}
          <Card>
            <CardHeader
              icon="ph:file-text-bold"
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              title="Prescriptions"
              subtitle="Recently added records"
            />

            <div className="divide-y divide-slate-100">
              {loadingPrescriptions ? (
                <div className="p-12 text-center text-slate-400">Loading...</div>
              ) : prescriptions.length === 0 ? (
                <div className="p-12 text-center text-slate-400">No records found</div>
              ) : (
                prescriptions.map((p) => (
                  <div
                    key={p._id}
                    className="p-5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <Icon icon="ph:pill-bold" className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Dr. {p.doctor?.name}</p>
                          <p className="text-xs text-slate-400 font-medium">
                            {new Date(p.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        {p.diagnosis || 'General'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {p.medicines?.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <span className="text-xs font-bold text-slate-700">{m.medicine}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-500">{m.dosage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Vitals Overview */}
          <Card>
            <CardHeader
              icon="ph:heart-bold"
              iconBg="bg-red-50"
              iconColor="text-red-600"
              title="Vitals Overview"
              subtitle="Latest health indicators"
            />

            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                {
                  label: "Blood Pressure",
                  value: vitals?.bp ? `${vitals.bp}` : "--",
                  unit: "mmHg",
                  icon: "ph:gauge-bold",
                  color: "text-rose-500",
                  bg: "bg-rose-50",
                },
                {
                  label: "Sugar Level",
                  value: vitals?.sugar ? `${vitals.sugar}` : "--",
                  unit: "mg/dL",
                  icon: "ph:drop-bold",
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
                {
                  label: "Body Weight",
                  value: vitals?.weight ? `${vitals.weight}` : "--",
                  unit: "kg",
                  icon: "ph:scales-bold",
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                },
                {
                  label: "Cholesterol",
                  value: vitals?.cholesterol ? `${vitals.cholesterol}` : "--",
                  unit: "mg/dL",
                  icon: "ph:heartbeat-bold",
                  color: "text-indigo-500",
                  bg: "bg-indigo-50",
                },
              ].map((vital, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${vital.bg} ${vital.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon icon={vital.icon} className="h-5 w-5" />
                    </div>
                    <Icon icon="ph:dots-three-bold" className="h-4 w-4 text-slate-300" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{vital.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-900">{vital.value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{vital.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Vitals Summary Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <Icon icon="ph:info-bold" className="h-3.5 w-3.5 text-[#0096C7]" />
                Values are based on your most recent consultation.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

};

export default Dashboard;
