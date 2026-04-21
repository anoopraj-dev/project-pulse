import React, { useState } from "react";
import { Icon } from "@iconify/react";

const mockDoctorTickets = [
  {
    id: 1,
    title: "Payout not received",
    message: "Last week's earnings not credited",
    status: "open",
  },
  {
    id: 2,
    title: "Profile verification delay",
    message: "Submitted docs but still pending",
    status: "in-progress",
  },
];

const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
    {children}
  </div>
);

const DoctorSupportPage = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "payout",
  });

  const handleSubmit = () => {
    console.log("Doctor ticket:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Doctor Support
          </h1>
          <p className="text-xs text-gray-400">
            Resolve operational issues, payouts, and account concerns
          </p>
        </div>

        {/* CREATE */}
        <Card>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Icon icon="mdi:stethoscope" /> Raise an Issue
            </div>

            <input
              placeholder="Issue title"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent"
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              placeholder="Explain the issue..."
              className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent"
              rows={3}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <select
              className="px-3 py-2 border rounded-lg text-sm bg-transparent"
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="payout">Payout</option>
              <option value="appointments">Appointments</option>
              <option value="verification">Verification</option>
              <option value="technical">Technical Issue</option>
            </select>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Submit
            </button>
          </div>
        </Card>

        {/* LIST */}
        <Card>
          <div className="p-4 text-sm font-semibold">
            My Requests
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {mockDoctorTickets.map((t) => (
              <div key={t.id} className="px-4 py-3 flex justify-between">
                <div>
                  <p className="text-xs font-semibold">{t.title}</p>
                  <p className="text-[11px] text-gray-400">
                    {t.message}
                  </p>
                </div>

                <span className="text-[10px] text-blue-500 font-semibold">
                  {t.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default DoctorSupportPage;