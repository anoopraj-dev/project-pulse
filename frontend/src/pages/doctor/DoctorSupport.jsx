
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  fetchSupportTickets,
  createSupportTicket,
  changePassword,
  requestExportAccountInfo,
  getExportStatus,
} from "@/api/doctor/doctorApis";

const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
    {children}
  </div>
);

const DoctorSupportPage = () => {
  const [tab, setTab] = useState("support");
  const [tickets, setTickets] = useState([]);
  const [ticketTab, setTicketTab] = useState("active");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [downloadUrl, setDownloadUrl] = useState(null);

  // ---------------- FAQ (same as patient style) ----------------
  const faqs = {
    payout: [
      "Check your registered bank account details",
      "Payouts are processed every 24–48 hours",
      "Ensure KYC is verified",
      "Contact support if delayed beyond 3 days",
    ],
    appointments: [
      "Check upcoming appointments tab",
      "Refresh schedule page",
      "Ensure availability is enabled",
      "Sync calendar again",
    ],
    verification: [
      "Upload clear documents",
      "Ensure details match registration",
      "Wait for admin approval",
      "Re-upload if rejected",
    ],
    technical: [
      "Restart app",
      "Clear cache",
      "Check internet connection",
      "Update to latest version",
    ],
  };

  // ---------------- LOAD TICKETS ----------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSupportTickets();
        setTickets(res?.data?.data || []);
      } catch {
        toast.error("Failed to load tickets");
      }
    };

    load();
  }, []);

  // ---------------- SUBMIT TICKET ----------------
  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.message || !category) {
        return toast.error("Fill all fields");
      }

      const res = await createSupportTicket({
        ...formData,
        category,
      });

      if (res?.data?.success) {
        toast.success("Ticket created");

        const updated = await fetchSupportTickets();
        setTickets(updated?.data?.data || []);

        setFormData({ title: "", message: "" });
        setCategory("");
        setShowForm(false);
      }
    } catch {
      toast.error("Failed to submit");
    }
  };

  // ---------------- FILTER ----------------
  const filteredTickets = tickets.filter((t) => {
    if (ticketTab === "active")
      return ["open", "in-progress"].includes(t.status);

    if (ticketTab === "resolved") return t.status === "resolved";

    if (ticketTab === "closed") return t.status === "closed";

    return true;
  });

  // ---------------- PASSWORD CHANGE (same as patient) ----------------
  const handlePasswordChange = async () => {
    try {
      const { currentPassword, newPassword } = passwordData;

      if (!currentPassword || !newPassword) {
        return toast.error("Fill all fields");
      }

      const role = "doctor";
      const data = {
        ...passwordData,
        role,
      };
      const res = await changePassword(data);

      if (res?.data?.success) {
        toast.success("Password updated");
        setPasswordData({ currentPassword: "", newPassword: "" });
      }
    } catch {
      toast.error("Failed to update password");
    }
  };

  // ---------------- EXPORT ----------------
  const handleExport = async () => {
    try {
      const toastId = toast.loading("Preparing report...");

      const res = await requestExportAccountInfo();
      const exportId = res?.data?.exportId;

      const interval = setInterval(async () => {
        const statusRes = await getExportStatus(exportId);
        const status = statusRes?.data?.status;

        if (status === "completed") {
          clearInterval(interval);
          toast.dismiss(toastId);
          toast.success("Report ready!");

          setDownloadUrl(`http://localhost:3000${statusRes.data.fileUrl}`);
        }

        if (status === "failed") {
          clearInterval(interval);
          toast.error("Export failed");
        }
      }, 3000);
    } catch {
      toast.error("Error generating report");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* HEADER */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Doctor Support
          </h1>
          <p className="text-xs text-gray-400">
            Resolve issues, manage payouts, and account settings
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          {["support", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs rounded-lg border ${
                tab === t
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-white dark:bg-gray-900 border-gray-200 text-gray-500"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ---------------- SUPPORT ---------------- */}
        {tab === "support" && (
          <>
            {/* CATEGORY + FAQ (same as patient UX) */}
            <Card>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {["payout", "appointments", "verification", "technical"].map(
                    (c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          setShowForm(false);
                        }}
                        className={`text-xs px-3 py-2 rounded-lg border ${
                          category === c
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "border-gray-200 text-gray-500"
                        }`}
                      >
                        {c.toUpperCase()}
                      </button>
                    ),
                  )}
                </div>

                {category && !showForm && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs font-semibold mb-2">
                      Suggested Solutions
                    </p>

                    <ul className="text-xs text-gray-500 space-y-1">
                      {faqs[category]?.map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-3 text-blue-600 text-xs font-semibold"
                    >
                      Still need help? Contact support
                    </button>
                  </div>
                )}

                {/* FORM */}
                {showForm && (
                  <div className="space-y-3">
                    <input
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Title"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                    />

                    <textarea
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      rows={3}
                      placeholder="Message"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          message: e.target.value,
                        })
                      }
                    />

                    <button
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Submit Request
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* TICKETS */}
            <Card>
              <div className="p-4 flex gap-2">
                {["active", "resolved", "closed"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTicketTab(t)}
                    className="px-3 py-1 text-xs border rounded-lg"
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="p-4 divide-y">
                {filteredTickets.map((t) => (
                  <div key={t._id} className="py-2 flex justify-between">
                    <div>
                      <p className="text-xs font-semibold">{t.title}</p>
                      <p className="text-[11px] text-gray-400">{t.message}</p>
                    </div>
                    <span className="text-xs text-blue-600">
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* ---------------- SETTINGS ---------------- */}
        {tab === "settings" && (
          <div className="space-y-4">
            {/* PASSWORD (same as patient) */}
            <Card>
              <div className="p-4 space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />

                <button
                  onClick={handlePasswordChange}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Change Password
                </button>
              </div>
            </Card>

            {/* EXPORT */}
            <Card>
              <div className="p-4 space-y-2">
                <button
                  onClick={handleExport}
                  className="text-blue-600 text-xs font-semibold"
                >
                  Export Account Info
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    className="text-sm text-blue-600 underline"
                    target="_blank"
                  >
                    Download Report
                  </a>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSupportPage;
