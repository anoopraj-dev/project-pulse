import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardInfoCards from "../../components/user/admin/DashboardInfoCards";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

import {
  fetchDashboardStats,
  fetchDoctorById
} from "../../api/admin/adminApis";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  //------------ REVIEW PENDING APPROVAL---------------
  const handleReview = async (id) => {
    try {
      const doctor = await fetchDoctorById(id);

      if (!doctor) {
        toast.error("Doctor not found");
        return;
      }

      navigate(`/admin/doctor/${id}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch doctor"
      );
    }
  };

  //------------ FETCH DATA-----------------
  const fetchStats = async () => {
    try {
      const stats = await fetchDashboardStats();
      setData(stats);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="w-full flex justify-center mt-18">
      <div className="w-full max-w-6xl px-6 py-6 space-y-8">
        {/* ---------- Header ---------- */}
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-gray-600">
            Here’s your system overview and today’s key insights.
          </p>
        </div>

        {/* ---------- Stats Grid ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <DashboardInfoCards
            title="Doctors"
            val={data?.doctorCount}
            icon="mdi:doctor"
            color="bg-blue-100"
          />

          <DashboardInfoCards
            title="Patients"
            val={data?.patientCount}
            icon="mdi:account-group"
            color="bg-purple-100"
          />

          <DashboardInfoCards
            title="Appointments"
            val={58}
            icon="mdi:calendar-check"
            color="bg-green-100"
          />

          <DashboardInfoCards
            title="Revenue"
            val="₹1,25,000"
            icon="mdi:cash-multiple"
            color="bg-yellow-100"
          />
        </div>

        {/* ---------- Main Grid Sections ---------- */}
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ---------- Pending Approvals ---------- */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow p-5 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Icon icon="mdi:account-alert" className="text-xl text-red-500" />
              Pending Doctor Approvals
            </h2>

            <div className="space-y-3">
              {data?.pendingDoctorsApproval?.map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doctor?.profilePicture || '/profile.png'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{doctor?.name}</p>
                      <span className="text-sm text-gray-500 bg-gray-200 px-1 rounded-xl">
                        {doctor?.professionalInfo?.specializations}
                      </span>
                    </div>
                  </div>

                  <button
                    className="px-3 py-1 rounded-xl bg-blue-600 text-white text-sm cursor-pointer"
                    onClick={() => handleReview(doctor?._id)}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Charts Section ---------- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-5 h-64">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Icon icon="mdi:finance" className="text-xl text-orange-500" />
                Revenue Overview
              </h2>
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {/* Chart Placeholder */}
                Chart here
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-5 h-64">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Icon icon="mdi:chart-bar" className="text-xl text-blue-500" />
                User Growth
              </h2>
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Chart here
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Recent Activities ---------- */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Icon icon="mdi:history" className="text-xl text-indigo-600" />
            Recent Activity
          </h2>

          <div className="space-y-4">
            <ActivityItem
              icon="mdi:account-plus"
              color="text-green-600"
              title="New user registered"
              desc="A new patient created an account"
            />

            <ActivityItem
              icon="mdi:calendar-check"
              color="text-blue-600"
              title="Appointment Completed"
              desc="Appointment with Dr. Smith completed"
            />

            <ActivityItem
              icon="mdi:calendar"
              color="text-purple-600"
              title="New Appointment Booked"
              desc="Patient booked an appointment"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon, color, title, desc }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition">
      <Icon icon={icon} className={`text-2xl ${color}`} />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
};

export default Dashboard;
