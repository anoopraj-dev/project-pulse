// import React, { useEffect, useState } from "react";
// import { Icon } from "@iconify/react";
// import toast from "react-hot-toast";
// import {
//   changePassword,
//   createSupportTicket,
//   fetchSupportTickets,
//   getExportStatus,
//   requestExportAccountInfo,
// } from "@/api/patient/patientApis";
// import PageBanner from "@/components/shared/components/PageBanner";
// import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";

// // ---------------- COMPONENT ----------------
// const Card = ({ children }) => (
//   <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
//     {children}
//   </div>
// );

// const PatientSupportPage = () => {
//   const [tab, setTab] = useState("support");
//   const [tickets, setTickets] = useState([]);
//   const [ticketTab, setTicketTab] = useState("active");
//   const [formData, setFormData] = useState({
//     title: "",
//     message: "",
//   });
//   const [category, setCategory] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//   });
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [exportStatus, setExportStatus] = useState(null);
//   const [exportId, setExportId] = useState(null);
//   // ---------------- FETCH TICKETS ----------------
//   useEffect(() => {
//     const loadSupportTickets = async () => {
//       try {
//         const res = await fetchSupportTickets();
//         console.log("available tickets", res);
//         setTickets(res?.data?.data || []);
//       } catch (error) {
//         console.log(error);
//         toast.error("Failed to load tickets");
//       }
//     };

//     loadSupportTickets();
//   }, []);

//   // ---------------- FAQ ----------------
//   const faqs = {
//     booking: [
//       "Check if payment was successful in your bank/app",
//       "Go to 'My Appointments' and refresh the page",
//       "Wait 1–2 minutes for confirmation delay",
//       "Avoid closing app during payment",
//     ],
//     payment: [
//       "Refunds take 3–5 working days",
//       "Check bank/wallet history",
//       "Contact bank if debited but not refunded",
//       "Try another payment method next time",
//     ],
//     technical: [
//       "Restart the app",
//       "Check internet connection",
//       "Update to latest version",
//       "Clear cache and retry",
//     ],
//     account: [
//       "Verify email and phone number",
//       "Reset password if login issue",
//       "Logout and login again",
//       "Check account restrictions",
//     ],
//   };

//   // ---------------- SUBMIT TICKET ----------------
//   const handleTicketSubmit = async () => {
//     try {
//       const payload = {
//         ...formData,
//         category,
//       };

//       if (!payload.title || !payload.message || !payload.category) {
//         toast.error("Please fill all fields");
//         return;
//       }

//       const res = await createSupportTicket(payload);

//       if (res?.data?.success) {
//         toast.success("Ticket submitted successfully");

//         const updated = await fetchSupportTickets();
//         setTickets(updated?.data?.data || []);

//         setFormData({ title: "", message: "" });
//         setCategory("");
//         setShowForm(false);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to submit ticket");
//     }
//   };

//   // ---------------- FILTER TICKETS ----------------
//   const filteredTickets = tickets.filter((t) => {
//     const status = t.status;

//     if (ticketTab === "active") {
//       return ["open", "in-progress"].includes(status);
//     }

//     if (ticketTab === "resolved") {
//       return status === "resolved";
//     }

//     if (ticketTab === "closed") {
//       return status === "closed";
//     }

//     return true;
//   });

//   //-------------- CHANGE PASSWORD ----------------
//   const handleChangePassword = async () => {
//     try {
//       const { currentPassword, newPassword } = passwordData;

//       if (!currentPassword || !newPassword) {
//         return toast.error("Please fill all fields");
//       }

//       const role = 'patient'
//       const data = {
//         ...passwordData,
//         role
//       }

//       const res = await changePassword(data);

//       if (res?.data?.success) {
//         toast.success("Password updated successfully");
//         setPasswordData({ currentPassword: "", newPassword: "" });
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to change the password");
//     }
//   };

//   //------------- DOWNLOAD ACCOUNT INFO ------------
//   const handleDownloadAccountInfo = async () => {
//     try {
//       const toastId = toast.loading("Preparing your data...");

//       const res = await requestExportAccountInfo();

//       const exportId = res?.data?.exportId;

//       if (!exportId) return toast.error("Failed to start export");

//       const interval = setInterval(async () => {
//         const statusRes = await getExportStatus(exportId);

//         const status = statusRes?.data?.status;

//         if (status === "completed") {
//           clearInterval(interval);
//           toast.dismiss(toastId);
//           toast.success("Report ready!");

//           setExportStatus("completed");
//           setDownloadUrl(`http://localhost:3000${statusRes.data.fileUrl}`);
//         }

//         if (status === "failed") {
//           clearInterval(interval);
//           toast.error("Export failed");
//         }
//       }, 3000);
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   };

//   // ---------------- UI ----------------
//   return (
//     <div className="min-h-screen  dark:bg-gray-950">
//       <div className=" mx-auto px-4 py-6 space-y-4">
//         {/* HEADER */}
//         <PageBanner config={pageBannerConfig.patientSupportCenter}/>

//         {/* MAIN TABS */}
//         <div className="flex gap-2">
//           {["support", "settings"].map((t) => (
//             <button
//               key={t}
//               onClick={() => setTab(t)}
//               className={`px-3 py-1.5 text-xs rounded-lg border ${
//                 tab === t
//                   ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950"
//                   : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500"
//               }`}
//             >
//               {t === "support" ? "Support" : "Settings"}
//             </button>
//           ))}
//         </div>

//         {/* ---------------- SUPPORT ---------------- */}
//         {tab === "support" && (
//           <>
//             {/* HELP FLOW */}
//             <Card>
//               <div className="p-4 space-y-4">
//                 <div className="flex items-center gap-2 text-sm font-semibold">
//                   <Icon icon="mdi:help-circle" />
//                   Need Help?
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                   {["booking", "payment", "technical", "account"].map((c) => (
//                     <button
//                       key={c}
//                       onClick={() => {
//                         setCategory(c);
//                         setShowForm(false);
//                       }}
//                       className={`text-xs px-3 py-2 rounded-lg border ${
//                         category === c
//                           ? "bg-blue-50 text-blue-600 border-blue-200"
//                           : "border-gray-200 text-gray-500"
//                       }`}
//                     >
//                       {c.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>

//                 {/* FAQ */}
//                 {category && !showForm && (
//                   <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
//                     <p className="text-xs font-semibold mb-1">
//                       Suggested Solutions
//                     </p>

//                     <ul className="text-xs text-gray-500 space-y-1">
//                       {faqs[category]?.map((item, i) => (
//                         <li key={i}>• {item}</li>
//                       ))}
//                     </ul>

//                     <button
//                       onClick={() => setShowForm(true)}
//                       className="mt-3 text-blue-600 text-xs font-semibold"
//                     >
//                       Still need help? Contact support
//                     </button>
//                   </div>
//                 )}

//                 {/* FORM */}
//                 {showForm && (
//                   <div className="space-y-3">
//                     <input
//                       placeholder="Issue title"
//                       className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent"
//                       value={formData.title}
//                       onChange={(e) =>
//                         setFormData({ ...formData, title: e.target.value })
//                       }
//                     />

//                     <textarea
//                       placeholder="Describe your problem..."
//                       className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent"
//                       rows={3}
//                       value={formData.message}
//                       onChange={(e) =>
//                         setFormData({ ...formData, message: e.target.value })
//                       }
//                     />

//                     <button
//                       onClick={handleTicketSubmit}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
//                     >
//                       Submit Request
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </Card>
//             {/* MY REQUESTS */}
//             <Card>
//               <div className="p-4 space-y-3">
//                 <div className="text-sm font-semibold">My Requests</div>

//                 {/* ticket tabs */}
//                 <div className="flex gap-2">
//                   {["active", "resolved", "closed"].map((t) => (
//                     <button
//                       key={t}
//                       onClick={() => setTicketTab(t)}
//                       className={`px-3 py-1 text-xs rounded-lg border ${
//                         ticketTab === t
//                           ? "bg-blue-50 text-blue-600 border-blue-200"
//                           : "border-gray-200 text-gray-500"
//                       }`}
//                     >
//                       {t.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="divide-y divide-gray-100 dark:divide-gray-800 p-4">
//                 {filteredTickets.length === 0 ? (
//                   <div className="px-4 py-6 text-center text-xs text-gray-400">
//                     No tickets found
//                   </div>
//                 ) : (
//                   filteredTickets.map((t) => (
//                     <div
//                       key={t._id}
//                       className="px-4 py-3 flex justify-between border border-orange rounded-lg my-1"
//                     >
//                       <div>
//                         <p className="text-xs font-semibold">{t.title}</p>
//                         <p className="text-[11px] text-gray-400">{t.message}</p>
//                         <p className="text-[11px] text-gray-400">
//                           {new Date(t.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>

//                       <span className="text-[10px] text-orange-500 font-semibold">
//                         {t.status?.toUpperCase()}
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </Card>
//           </>
//         )}

//         {/* ---------------- SETTINGS ---------------- */}
//         {tab === "settings" && (
//           <div className="space-y-4">
//             {/* SECURITY CARD */}
//             <Card>
//               <div className="p-4 space-y-4">
//                 <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
//                   <Icon icon="mdi:lock-outline" />
//                   Security
//                 </div>

//                 <div className="space-y-3">
//                   <input
//                     type="password"
//                     placeholder="Current Password"
//                     value={passwordData.currentPassword}
//                     onChange={(e) =>
//                       setPasswordData({
//                         ...passwordData,
//                         currentPassword: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />

//                   <input
//                     type="password"
//                     placeholder="New Password"
//                     value={passwordData.newPassword}
//                     onChange={(e) =>
//                       setPasswordData({
//                         ...passwordData,
//                         newPassword: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />

//                   <button
//                     onClick={handleChangePassword}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//                   >
//                     Change Password
//                   </button>
//                 </div>
//               </div>
//             </Card>

//             {/* ACCOUNT ACTIONS */}
//             <Card>
//               <div className="p-4 space-y-3">
//                 <div className="text-sm font-semibold text-gray-800 dark:text-white">
//                   Account Actions
//                 </div>

//                 <button
//                   className="w-full text-left text-blue-600 text-xs font-semibold hover:underline"
//                   onClick={handleDownloadAccountInfo}
//                 >
//                   Download Account Info
//                 </button>

//                 {downloadUrl && (
//                   <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
//                     <p className="text-xs text-green-700 dark:text-green-300 mb-2">
//                       Your report is ready:
//                     </p>

//                     <a
//                       href={downloadUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-blue-600 underline"
//                     >
//                       Download Patient Report
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientSupportPage;



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
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";

// ---------------- Shared Card Components ----------------
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ icon, title, subtitle }) => (
  <div className="px-5 py-4 border-b border-slate-100 dark:border-gray-800 flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-gray-800">
      <Icon icon={icon} className="text-slate-500 dark:text-slate-400 text-lg" />
    </div>
    <div>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-white">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const categoryMeta = {
  booking:   { icon: "mdi:calendar-clock-outline", label: "Booking"   },
  payment:   { icon: "mdi:credit-card-outline",    label: "Payment"   },
  technical: { icon: "mdi:wrench-outline",         label: "Technical" },
  account:   { icon: "mdi:account-circle-outline", label: "Account"   },
};

const statusStyles = {
  "open":        "bg-blue-50 text-blue-600 border-blue-100",
  "in-progress": "bg-amber-50 text-amber-600 border-amber-100",
  "resolved":    "bg-emerald-50 text-emerald-600 border-emerald-100",
  "closed":      "bg-slate-100 text-slate-500 border-slate-200",
};

const PatientSupportPage = () => {
  const [tab, setTab] = useState("support");
  const [tickets, setTickets] = useState([]);
  const [ticketTab, setTicketTab] = useState("active");
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
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
    booking:   ["Check if payment was successful in your bank/app", "Go to 'My Appointments' and refresh the page", "Wait 1–2 minutes for confirmation delay", "Avoid closing app during payment"],
    payment:   ["Refunds take 3–5 working days", "Check bank/wallet history", "Contact bank if debited but not refunded", "Try another payment method next time"],
    technical: ["Restart the app", "Check internet connection", "Update to latest version", "Clear cache and retry"],
    account:   ["Verify email and phone number", "Reset password if login issue", "Logout and login again", "Check account restrictions"],
  };

  // ---------------- SUBMIT TICKET ----------------
  const handleTicketSubmit = async () => {
    try {
      const payload = { ...formData, category };
      if (!payload.title || !payload.message || !payload.category) { toast.error("Please fill all fields"); return; }
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
    if (ticketTab === "active")   return ["open", "in-progress"].includes(status);
    if (ticketTab === "resolved") return status === "resolved";
    if (ticketTab === "closed")   return status === "closed";
    return true;
  });

  // -------------- CHANGE PASSWORD ----------------
  const handleChangePassword = async () => {
    try {
      const { currentPassword, newPassword } = passwordData;
      if (!currentPassword || !newPassword) return toast.error("Please fill all fields");
      const role = "patient";
      const data = { ...passwordData, role };
      const res = await changePassword(data);
      if (res?.data?.success) {
        toast.success("Password updated successfully");
        setPasswordData({ currentPassword: "", newPassword: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to change the password");
    }
  };

  // ------------- DOWNLOAD ACCOUNT INFO ------------
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
        if (status === "failed") { clearInterval(interval); toast.error("Export failed"); }
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen dark:bg-gray-950">
      <PageBanner config={pageBannerConfig.patientSupportCenter} />

      <div className="w-full px-4 py-6 pb-16">

        {/* MAIN TABS */}
        <div className="flex gap-1 p-1 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 shadow-sm rounded-xl w-fit mb-5">
          {["support", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                tab === t
                  ? "bg-[#0096C7] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Icon icon={t === "support" ? "mdi:headset" : "mdi:cog-outline"} className="text-base" />
              {t === "support" ? "Support" : "Settings"}
            </button>
          ))}
        </div>

        {/* ------------SUPPORT TAB -------------*/}
        {tab === "support" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* LEFT — Help Flow */}
            <div className="lg:col-span-1 space-y-5">
              <Card>
                <CardHeader icon="mdi:help-circle-outline" title="Need Help?" subtitle="Select a category to get started" />
                <div className="p-5 space-y-4">

                  {/* Category Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(categoryMeta).map(([key, { icon, label }]) => (
                      <button
                        key={key}
                        onClick={() => { setCategory(key); setShowForm(false); }}
                        className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border text-xs font-medium transition-all duration-150 ${
                          category === key
                            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                            : "bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700 text-slate-500 hover:border-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon icon={icon} className="text-xl" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* FAQ */}
                  {category && !showForm && (
                    <div className="rounded-xl border border-slate-100 dark:border-gray-800 overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 dark:bg-gray-800 border-b border-slate-100 dark:border-gray-700">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Suggestions for <span className="text-blue-600 capitalize">{category}</span>
                        </p>
                      </div>
                      <ul className="divide-y divide-slate-50 dark:divide-gray-800">
                        {faqs[category]?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                            <Icon icon="mdi:check-circle-outline" className="mt-0.5 flex-shrink-0 text-emerald-500 text-sm" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="px-4 py-3 bg-slate-50 dark:bg-gray-800 border-t border-slate-100 dark:border-gray-700">
                        <button
                          onClick={() => setShowForm(true)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          <Icon icon="mdi:message-text-outline" className="text-sm" />
                          Still need help? Contact support →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FORM */}
                  {showForm && (
                    <div className="space-y-3 rounded-xl border border-slate-100 dark:border-gray-800 p-4">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Describe your issue</p>
                      <input
                        placeholder="Issue title"
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-slate-300"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                      <textarea
                        placeholder="Describe your problem in detail…"
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-slate-300 resize-none"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleTicketSubmit}
                          className="flex-1 bg-[#0096C7] hover:bg-blue-700 active:scale-[0.99] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
                        >
                          Submit Request
                        </button>
                        <button
                          onClick={() => setShowForm(false)}
                          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-gray-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-gray-800 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT — My Requests */}
            <div className="lg:col-span-2">
              <Card>
                <div className="px-5 py-4 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-gray-800">
                      <Icon icon="mdi:ticket-outline" className="text-slate-500 text-lg" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800 dark:text-white">My Requests</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  {/* Ticket Sub-Tabs */}
                  <div className="flex gap-1">
                    {["active", "resolved", "closed"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTicketTab(t)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 ${
                          ticketTab === t
                            ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                            : "border-slate-200 dark:border-gray-700 text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {filteredTickets.length === 0 ? (
                    <div className="py-16 flex flex-col items-center text-center gap-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 mb-1">
                        <Icon icon="mdi:inbox-outline" className="text-2xl text-slate-400" />
                      </div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">No tickets found</h2>
                      <p className="text-sm text-slate-500 max-w-xs">
                        {ticketTab === "active" ? "You have no open or in-progress tickets." : `No ${ticketTab} tickets yet.`}
                      </p>
                    </div>
                  ) : (
                    filteredTickets.map((t) => (
                      <div
                        key={t._id}
                        className="flex items-start justify-between gap-3 p-4 rounded-xl border border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{t.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{t.message}</p>
                          <p className="text-xs text-slate-300 mt-1">
                            {new Date(t.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-md border uppercase tracking-wide ${statusStyles[t.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {t.status?.replace("-", " ")}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ------------- SETTINGS TAB ------------- */}
        {tab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* LEFT — Security */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader icon="mdi:lock-outline" title="Security" subtitle="Update your account password" />
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-slate-300"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-[#0096C7] hover:bg-blue-700 active:scale-[0.99] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition mt-1"
                  >
                    Update Password
                  </button>
                </div>
              </Card>
            </div>

            {/* RIGHT — Account Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader icon="mdi:account-cog-outline" title="Account Actions" subtitle="Manage your account data" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Export Account Info</p>
                      <p className="text-xs text-slate-400 mt-0.5">Download a copy of your patient data</p>
                    </div>
                    <button
                      onClick={handleDownloadAccountInfo}
                      className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] px-4 py-2.5 rounded-xl transition flex-shrink-0"
                    >
                      <Icon icon="mdi:download-outline" className="text-sm" />
                      Export
                    </button>
                  </div>

                  {downloadUrl && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 rounded-xl">
                      <Icon icon="mdi:check-circle" className="text-emerald-500 text-xl flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Your report is ready</p>
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline hover:text-blue-700 break-all">
                          Download Patient Report
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSupportPage;