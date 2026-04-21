import React, { useState } from "react";
import { Icon } from "@iconify/react";

// ---------------- MOCK DATA ----------------
const mockTickets = [
  {
    id: 1,
    title: "Cannot book appointment",
    message: "I am unable to confirm booking after payment",
    priority: "high",
    status: "open",
  },
  {
    id: 2,
    title: "Refund request",
    message: "Payment deducted but appointment failed",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: 3,
    title: "App slow issue",
    message: "Doctor search takes too long to load",
    priority: "low",
    status: "open",
  },
];

const mockAlerts = [
  {
    id: 1,
    title: "Payment failure spike detected",
    desc: "12 failed transactions in last 1 hour",
    severity: "high",
  },
  {
    id: 2,
    title: "Doctor verification backlog",
    desc: "8 doctors pending > 7 days",
    severity: "medium",
  },
];

// ---------------- UI COMPONENTS ----------------
const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
    {children}
  </div>
);

const CardHeader = ({ icon, title, subtitle, right, iconBg, iconColor }) => (
  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon icon={icon} className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
    {right}
  </div>
);

// ---------------- MAIN PAGE ----------------
const SupportCenter = () => {
  const [tab, setTab] = useState("operations");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 pb-16">

        {/* HEADER */}
        <div className="mb-5">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Support Center
          </h1>
          <p className="text-xs text-gray-400">
            Operations, alerts, and system control
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-4">
          {["operations", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                tab === t
                  ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-900"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500"
              }`}
            >
              {t === "operations" ? "Operations" : "System Config"}
            </button>
          ))}
        </div>

        {/* ---------------- OPERATIONS ---------------- */}
        {tab === "operations" && (
          <>
            {/* TOP STATS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

              <Card>
                <CardHeader
                  icon="mdi:email-outline"
                  iconBg="bg-blue-50 dark:bg-blue-950"
                  iconColor="text-blue-600"
                  title="User Queries"
                  subtitle="Open support tickets"
                  right={<span className="text-xs font-semibold">3 open</span>}
                />
                <div className="p-4 text-sm text-gray-500">
                  Handle user complaints & requests
                </div>
              </Card>

              <Card>
                <CardHeader
                  icon="mdi:alert-circle"
                  iconBg="bg-red-50 dark:bg-red-950"
                  iconColor="text-red-600"
                  title="System Alerts"
                  subtitle="Critical system issues"
                  right={<span className="text-xs font-semibold">2 active</span>}
                />
                <div className="p-4 text-sm text-gray-500">
                  Monitor backend & payment health
                </div>
              </Card>

              <Card>
                <CardHeader
                  icon="mdi:clock-outline"
                  iconBg="bg-purple-50 dark:bg-purple-950"
                  iconColor="text-purple-600"
                  title="Escalations"
                  subtitle="High priority issues"
                  right={<span className="text-xs font-semibold">1 urgent</span>}
                />
                <div className="p-4 text-sm text-gray-500">
                  Requires immediate admin action
                </div>
              </Card>

            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* TICKETS */}
              <Card>
                <CardHeader
                  icon="mdi:inbox"
                  iconBg="bg-blue-50 dark:bg-blue-950"
                  iconColor="text-blue-600"
                  title="Support Inbox"
                  subtitle="User submitted queries"
                />

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {mockTickets.map((t) => (
                    <div key={t.id} className="px-4 py-3 flex justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-white">
                          {t.title}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {t.message}
                        </p>
                      </div>

                      <span className={`text-[10px] font-semibold ${
                        t.priority === "high"
                          ? "text-red-500"
                          : t.priority === "medium"
                          ? "text-orange-500"
                          : "text-green-500"
                      }`}>
                        {t.priority.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* ALERTS */}
              <Card>
                <CardHeader
                  icon="mdi:alert"
                  iconBg="bg-red-50 dark:bg-red-950"
                  iconColor="text-red-600"
                  title="System Alerts"
                  subtitle="Live system issues"
                />

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {mockAlerts.map((a) => (
                    <div key={a.id} className="px-4 py-3 flex justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-white">
                          {a.title}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {a.desc}
                        </p>
                      </div>

                      <span className={`text-[10px] font-semibold ${
                        a.severity === "high"
                          ? "text-red-500"
                          : "text-orange-500"
                      }`}>
                        {a.severity.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </>
        )}

        {/* ---------------- SETTINGS PLACEHOLDER ---------------- */}
        {tab === "settings" && (
          <Card>
            <CardHeader
              icon="mdi:cog"
              iconBg="bg-gray-100 dark:bg-gray-800"
              iconColor="text-gray-600"
              title="System Configuration"
              subtitle="Platform settings & feature toggles"
            />
            <div className="p-6 text-sm text-gray-500">
              This section will include:
              <ul className="mt-2 list-disc ml-5 space-y-1">
                <li>Feature toggles</li>
                <li>Admin settings</li>
                <li>Branding & theme</li>
                <li>Security controls</li>
              </ul>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default SupportCenter;