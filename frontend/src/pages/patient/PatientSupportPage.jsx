import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  changePassword,
  createSupportTicket,
  fetchSupportTickets,
  getExportStatus,
  requestExportAccountInfo,
} from "@/api/patient/patientApis";

// ---------------- COMPONENT ----------------
const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
    {children}
  </div>
);

const PatientSupportPage = () => {
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
  const [exportStatus, setExportStatus] = useState(null);
  const [exportId, setExportId] = useState(null);
  // ---------------- FETCH TICKETS ----------------
  useEffect(() => {
    const loadSupportTickets = async () => {
      try {
        const res = await fetchSupportTickets();
        console.log("available tickets", res);
        setTickets(res?.data?.data || []);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load tickets");
      }
    };

    loadSupportTickets();
  }, []);

  // ---------------- FAQ ----------------
  const faqs = {
    booking: [
      "Check if payment was successful in your bank/app",
      "Go to 'My Appointments' and refresh the page",
      "Wait 1–2 minutes for confirmation delay",
      "Avoid closing app during payment",
    ],
    payment: [
      "Refunds take 3–5 working days",
      "Check bank/wallet history",
      "Contact bank if debited but not refunded",
      "Try another payment method next time",
    ],
    technical: [
      "Restart the app",
      "Check internet connection",
      "Update to latest version",
      "Clear cache and retry",
    ],
    account: [
      "Verify email and phone number",
      "Reset password if login issue",
      "Logout and login again",
      "Check account restrictions",
    ],
  };

  // ---------------- SUBMIT TICKET ----------------
  const handleTicketSubmit = async () => {
    try {
      const payload = {
        ...formData,
        category,
      };

      if (!payload.title || !payload.message || !payload.category) {
        toast.error("Please fill all fields");
        return;
      }

      const res = await createSupportTicket(payload);

      if (res?.data?.success) {
        toast.success("Ticket submitted successfully");

        const updated = await fetchSupportTickets();
        setTickets(updated?.data?.data || []);

        setFormData({ title: "", message: "" });
        setCategory("");
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit ticket");
    }
  };

  // ---------------- FILTER TICKETS ----------------
  const filteredTickets = tickets.filter((t) => {
    const status = t.status;

    if (ticketTab === "active") {
      return ["open", "in-progress"].includes(status);
    }

    if (ticketTab === "resolved") {
      return status === "resolved";
    }

    if (ticketTab === "closed") {
      return status === "closed";
    }

    return true;
  });

  //-------------- CHANGE PASSWORD ----------------
  const handleChangePassword = async () => {
    try {
      const { currentPassword, newPassword } = passwordData;

      if (!currentPassword || !newPassword) {
        return toast.error("Please fill all fields");
      }

      const res = await changePassword(passwordData);

      if (res?.data?.success) {
        toast.success("Password updated successfully");
        setPasswordData({ currentPassword: "", newPassword: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to change the password");
    }
  };

  //------------- DOWNLOAD ACCOUNT INFO ------------
  const handleDownloadAccountInfo = async () => {
    try {
      const toastId = toast.loading("Preparing your data...");

      const res = await requestExportAccountInfo();

      const exportId = res?.data?.exportId;

      if (!exportId) return toast.error("Failed to start export");

      const interval = setInterval(async () => {
        const statusRes = await getExportStatus(exportId);

        const status = statusRes?.data?.status;

        if (status === "completed") {
          clearInterval(interval);
          toast.dismiss(toastId);
          toast.success("Report ready!");

          setExportStatus("completed");
          setDownloadUrl(`http://localhost:3000${statusRes.data.fileUrl}`);
        }

        if (status === "failed") {
          clearInterval(interval);
          toast.error("Export failed");
        }
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* HEADER */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Help & Support
          </h1>
          <p className="text-xs text-gray-400">
            Get help, track requests, or share feedback
          </p>
        </div>

        {/* MAIN TABS */}
        <div className="flex gap-2">
          {["support", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs rounded-lg border ${
                tab === t
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500"
              }`}
            >
              {t === "support" ? "Support" : "Settings"}
            </button>
          ))}
        </div>

        {/* ---------------- SUPPORT ---------------- */}
        {tab === "support" && (
          <>
            {/* HELP FLOW */}
            <Card>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Icon icon="mdi:help-circle" />
                  Need Help?
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {["booking", "payment", "technical", "account"].map((c) => (
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
                  ))}
                </div>

                {/* FAQ */}
                {category && !showForm && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs font-semibold mb-1">
                      Suggested Solutions
                    </p>

                    <ul className="text-xs text-gray-500 space-y-1">
                      {faqs[category]?.map((item, i) => (
                        <li key={i}>• {item}</li>
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
                      placeholder="Issue title"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />

                    <textarea
                      placeholder="Describe your problem..."
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent"
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />

                    <button
                      onClick={handleTicketSubmit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Submit Request
                    </button>
                  </div>
                )}
              </div>
            </Card>
            {/* MY REQUESTS */}
            <Card>
              <div className="p-4 space-y-3">
                <div className="text-sm font-semibold">My Requests</div>

                {/* ticket tabs */}
                <div className="flex gap-2">
                  {["active", "resolved", "closed"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTicketTab(t)}
                      className={`px-3 py-1 text-xs rounded-lg border ${
                        ticketTab === t
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800 p-4">
                {filteredTickets.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    No tickets found
                  </div>
                ) : (
                  filteredTickets.map((t) => (
                    <div
                      key={t._id}
                      className="px-4 py-3 flex justify-between border border-orange rounded-lg my-1"
                    >
                      <div>
                        <p className="text-xs font-semibold">{t.title}</p>
                        <p className="text-[11px] text-gray-400">{t.message}</p>
                        <p className="text-[11px] text-gray-400">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="text-[10px] text-orange-500 font-semibold">
                        {t.status?.toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}

        {/* ---------------- SETTINGS ---------------- */}
        {tab === "settings" && (
          <div className="space-y-4">
            {/* SECURITY CARD */}
            <Card>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
                  <Icon icon="mdi:lock-outline" />
                  Security
                </div>

                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </Card>

            {/* ACCOUNT ACTIONS */}
            <Card>
              <div className="p-4 space-y-3">
                <div className="text-sm font-semibold text-gray-800 dark:text-white">
                  Account Actions
                </div>

                <button
                  className="w-full text-left text-blue-600 text-xs font-semibold hover:underline"
                  onClick={handleDownloadAccountInfo}
                >
                  Download Account Info
                </button>

                {downloadUrl && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                      Your report is ready:
                    </p>

                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Download Patient Report
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSupportPage;
