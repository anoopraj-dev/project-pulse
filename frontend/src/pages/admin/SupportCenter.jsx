import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import {
  changePassword,
  fetchSupportTickets,
  fetchSystemAlerts,
  updateAlertStatus,
  updateTicketStatus,
} from "@/api/admin/adminApis";
import Pagination from "@/components/shared/components/Pagination";

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
const SupportCenter = () => {
  const [tab, setTab] = useState("operations");

  const [tickets, setTickets] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [ticketTab, setTicketTab] = useState("active");
  const [alertTab, setAlertTab] = useState("active");

  const [loadingId, setLoadingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------- PASSWORD STATE ----------------
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const getData = async () => {
      const [tRes, aRes] = await Promise.allSettled([
        fetchSupportTickets(page, 5),
        fetchSystemAlerts(page, 5),
      ]);

      setTickets(
        tRes.status === "fulfilled" ? tRes.value.data?.data || [] : [],
      );

      setAlerts(aRes.value?.data?.data?.data || []);

      setTotalPages(
         aRes.value?.data?.data?.pagination?.totalPages || 1
      );
    };

    getData();
  }, [page]);

  // ---------------- STATUS HANDLERS ----------------
  const handleUpdateTicketStatus = async (id, status) => {
    try {
      setLoadingId(id);

      const res = await updateTicketStatus(id, status);

      if (res.data?.success) {
        toast.success("Ticket status updated");

        setTickets((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status } : t)),
        );
      } else {
        toast.error("Failed to update ticket");
      }
    } catch (err) {
      toast.error("Failed to update ticket");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdateAlertStatus = async (id, status) => {
    try {
      setLoadingId(id);

      const res = await updateAlertStatus(id, status);

      if (res.data?.success) {
        toast.success("Alert status updated");

        setAlerts((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a)),
        );
      } else {
        toast.error("Failed to update alert");
      }
    } catch (err) {
      toast.error("Failed to update alert");
    } finally {
      setLoadingId(null);
    }
  };

  // ---------------- PASSWORD HANDLER ----------------
  const handleChangePassword = async () => {
    const { currentPassword, newPassword } = passwords;

    if (!currentPassword || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different");
      return;
    }

    const payload = {
      currentPassword,
      newPassword,
      role: "admin",
    };

    try {
      const res = await changePassword(payload);

      if (res.data?.success) {
        toast.success("Password updated successfully");

        setPasswords({
          currentPassword: "",
          newPassword: "",
        });
      } else {
        toast.error("Failed to update password");
      }
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  // ---------------- FILTERS ----------------
  const filteredTickets = tickets.filter((t) => {
    if (ticketTab === "active")
      return t.status !== "closed" && t.status !== "resolved";
    if (ticketTab === "resolved") return t.status === "resolved";
    return t.status === "closed";
  });

  const filteredAlerts = alerts.filter((a) => {
    if (alertTab === "active") return a.status !== "resolved";
    return a.status === "resolved";
  });

  // ---------------- STATS ----------------
  const openTickets = tickets.filter((t) => t.status !== "closed").length;
  const activeAlerts = alerts.filter((a) => a.status !== "resolved").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* HEADER */}
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Support Center
        </h1>

        {/* MAIN TABS */}
        <div className="flex gap-2 mb-4">
          {["operations", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs rounded-lg border ${
                tab === t
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-gray-200 text-gray-500"
              }`}
            >
              {t === "operations" ? "Operations" : "Settings"}
            </button>
          ))}
        </div>

        {/* ---------------- OPERATIONS ---------------- */}
        {tab === "operations" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader
                  icon="mdi:email-outline"
                  title="User Queries"
                  subtitle="Open tickets"
                  right={<span>{openTickets}</span>}
                />
              </Card>

              <Card>
                <CardHeader
                  icon="mdi:alert"
                  title="System Alerts"
                  subtitle="Active issues"
                  right={<span>{activeAlerts}</span>}
                />
              </Card>
            </div>

            {/* MAIN GRID */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* ---------------- TICKETS ---------------- */}
              <Card>
                <CardHeader
                  icon="mdi:inbox"
                  title="Support Inbox"
                  subtitle="Manage tickets"
                />

                {/* Ticket Tabs */}
                <div className="flex gap-2 p-3">
                  {["active", "resolved", "closed"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTicketTab(t)}
                      className={`px-2 py-1 text-xs rounded ${
                        ticketTab === t
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="divide-y">
                  {filteredTickets.map((t) => (
                    <div key={t._id} className="p-4">
                      <p className="text-xs font-semibold">{t.title}</p>
                      <p className="text-[11px] text-gray-400">{t.message}</p>

                      <div className="flex gap-2 mt-2">
                        {t.status !== "resolved" && (
                          <button
                            disabled={loadingId === t._id}
                            onClick={() =>
                              handleUpdateTicketStatus(t._id, "resolved")
                            }
                            className="text-[10px] px-2 py-1 bg-green-100 text-green-600 rounded"
                          >
                            Resolve
                          </button>
                        )}

                        {t.status !== "closed" && (
                          <button
                            disabled={loadingId === t._id}
                            onClick={() =>
                              handleUpdateTicketStatus(t._id, "closed")
                            }
                            className="text-[10px] px-2 py-1 bg-gray-200 rounded"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* ---------------- ALERTS ---------------- */}
              <Card>
                <CardHeader
                  icon="mdi:alert"
                  title="System Alerts"
                  subtitle="Manage alerts"
                />

                {/* Alert Tabs */}
                <div className="flex gap-2 p-3">
                  {["active", "resolved"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAlertTab(t)}
                      className={`px-2 py-1 text-xs rounded ${
                        alertTab === t
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="divide-y">
                  {filteredAlerts.map((a) => (
                    <div key={a._id} className="p-4">
                      <p className="text-xs font-semibold">{a.title}</p>
                      <p className="text-[11px] text-gray-400">{a.desc}</p>
                      <p className="text-[11px] text-gray-400">{new Date(a.createdAt).toDateString()}</p>

                      {a.status !== "resolved" && (
                        <button
                          disabled={loadingId === a._id}
                          onClick={() =>
                            handleUpdateAlertStatus(a._id, "resolved")
                          }
                          className="mt-2 text-[10px] px-2 py-1 bg-green-100 text-green-600 rounded"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ---------------- SETTINGS ---------------- */}
        {tab === "settings" && (
          <Card>
            <CardHeader
              icon="mdi:cog"
              title="Settings"
              subtitle="Change password"
            />

            <div className="p-4 space-y-3 max-w-sm">
              <input
                type="password"
                placeholder="Current password"
                className="w-full border px-2 py-1 text-xs rounded"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="New password"
                className="w-full border px-2 py-1 text-xs rounded"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value,
                  })
                }
              />

              <button
                onClick={handleChangePassword}
                className="w-full bg-blue-600 text-white py-1 text-xs rounded"
              >
                Update Password
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupportCenter;
