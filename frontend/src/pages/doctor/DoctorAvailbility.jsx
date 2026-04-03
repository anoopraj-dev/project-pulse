import React, { useEffect, useState } from "react";
import DoctorStatusBanner from "@/components/user/doctor/profile/DoctorStatusBanner";
import PageBanner from "@/components/shared/components/PageBanner";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import { useUser } from "@/contexts/UserContext";
import {
  saveAvailability,
  getAvailability,
  removeAvailabilitySlot,
} from "@/api/doctor/doctorApis";
import toast from "react-hot-toast";

const DoctorAvailability = () => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState(30);
  const [existingSlots, setExistingSlots] = useState([]);
  const [newSlots, setNewSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [removingSlot, setRemovingSlot] = useState(null);

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        day: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        value: date.toISOString().split("T")[0],
      });
    }
    return days;
  };
  const days = getNext7Days();

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const fetchAvailability = async () => {
    if (!selectedDate) return;
    try {
      const res = await getAvailability();
      if (res?.data?.success) {
        const allData = res.data.data;
        const dayData = allData.find((d) => d.date === selectedDate);
        setExistingSlots(dayData ? dayData.slots : []);
        setSelectedSlots([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedDate) fetchAvailability();
  }, [selectedDate]);

  const generateSlots = () => {
    if (!startTime || !endTime || duration <= 0) return;
    const generated = [];
    let cur = new Date(`1970-01-01T${startTime}:00`);
    const endD = new Date(`1970-01-01T${endTime}:00`);
    while (cur < endD) {
      const next = new Date(cur.getTime() + duration * 60000);
      if (next > endD) break;
      const startStr = cur.toTimeString().slice(0, 5);
      const endStr = next.toTimeString().slice(0, 5);
      const overlap = existingSlots.some(
        (s) => s.start < endStr && s.end > startStr,
      );
      if (!overlap) generated.push({ start: startStr, end: endStr });
      cur = next;
    }
    setNewSlots(generated);
    setSelectedSlots([]);
  };

  useEffect(() => {
    if (selectedDate) generateSlots();
  }, [startTime, endTime, duration, existingSlots]);

  const toggleSlot = (slot) => {
    const key = `${slot.start}-${slot.end}`;
    setSelectedSlots((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  };

  const toggleSelectAll = () => {
    const allKeys = newSlots.map((s) => `${s.start}-${s.end}`);
    setSelectedSlots(selectedSlots.length === allKeys.length ? [] : allKeys);
  };

  const handleSaveAvailability = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      toast.error("Select a date and slots to save");
      return;
    }
    try {
      setIsSaving(true);
      let payload = selectedSlots.map((slot) => {
        const [start, end] = slot.split("-");
        return { date: selectedDate, start, end };
      });
      payload = payload.filter(
        (slot) =>
          !existingSlots.some(
            (e) => e.start === slot.start && e.end === slot.end,
          ),
      );
      if (payload.length === 0) {
        toast.error("No new slots to save. Duplicates ignored.");
        return;
      }
      const res = await saveAvailability(payload);
      if (res?.data?.success) {
        toast.success("Slots saved successfully");
        fetchAvailability();
      } else {
        toast.error(res?.data?.error || "Failed to save slots");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving slots");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSlot = async (slot) => {
    if (!selectedDate) return;
    try {
      setRemovingSlot(`${slot.start}-${slot.end}`);
      const res = await removeAvailabilitySlot({
        date: selectedDate,
        start: slot.start,
        end: slot.end,
      });
      if (res?.data?.success) {
        toast.success("Slot removed");
        fetchAvailability();
      } else {
        toast.error(res?.data?.message || "Failed to remove slot");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing slot");
    } finally {
      setRemovingSlot(null);
    }
  };

  const isInvalidTime = startTime >= endTime;
  const bookedCount = existingSlots.filter((s) => s.isBooked).length;
  const savedCount = existingSlots.filter((s) => !s.isBooked).length;
  const allNewSelected =
    selectedSlots.length === newSlots.length && newSlots.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 pb-16">
      {/* Banners */}
      <div className="space-y-3">
        <DoctorStatusBanner
          approvalStatus={user?.status}
          submissionCount={user?.submissionCount}
          variant="doctor"
        />
        {user?.isBlocked ? (
          <BlockedProfile />
        ) : (
          <PageBanner config={pageBannerConfig.doctorAvailability} />
        )}
      </div>

      {!user?.isBlocked && (
        <div className="px-4 sm:px-6 mt-6 space-y-5">
          {/* Date selector */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">
              Select Date
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {days.map((day, index) => {
                const isSelected = selectedDate === day.value;
                const isToday = index === 0;
                return (
                  <button
                    key={day.value}
                    onClick={() => setSelectedDate(day.value)}
                    className={`relative min-w-[62px] flex flex-col items-center pt-4 pb-2.5 px-2 rounded-2xl border transition-all duration-150 select-none focus:outline-none
                      ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200/60 dark:shadow-blue-900/40 scale-105"
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
                      }`}
                  >
                    {isToday && (
                      <span
                        className={`absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-wider
                        ${isSelected ? "text-blue-200" : "text-blue-500 dark:text-blue-400"}`}
                      >
                        Today
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-medium mb-0.5 ${isSelected ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}
                    >
                      {day.label}
                    </span>
                    <span
                      className={`text-lg font-extrabold leading-none ${isSelected ? "text-white" : "text-gray-800 dark:text-gray-100"}`}
                    >
                      {day.day}
                    </span>
                    <span
                      className={`text-[9px] mt-0.5 ${isSelected ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}
                    >
                      {day.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
            {/* Settings card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden h-fit">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                    Schedule Settings
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    Time range & slot duration
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Start time */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                  />
                </div>

                {/* End time */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition
                      ${
                        isInvalidTime
                          ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 focus:ring-red-400/40"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500/40 focus:border-blue-400"
                      }`}
                  />
                  {isInvalidTime && (
                    <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      End time must be after start time
                    </div>
                  )}
                </div>

                {/* Duration pills */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Slot Duration
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[15, 30, 45, 60].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-150 focus:outline-none
                          ${
                            duration === d
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
                              : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
                          }`}
                      >
                        {d}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
                  New slots won't overlap with your already-saved slots.
                </p>
              </div>
            </div>

            {/* Right panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Existing slots card */}
              {existingSlots.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                          Saved Slots
                        </h2>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {selectedDate
                            ? new Date(
                                selectedDate + "T00:00:00",
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {savedCount > 0 && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                          {savedCount} available
                        </span>
                      )}
                      {bookedCount > 0 && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
                          {bookedCount} booked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {existingSlots.map((slot) => {
                        const key = `${slot.start}-${slot.end}`;
                        const isRemoving = removingSlot === key;
                        return (
                          <div key={key} className="relative group">
                            <div
                              className={`w-full py-2.5 px-2 rounded-xl border text-xs font-semibold text-center transition-all
                                ${
                                  slot.isBooked
                                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-500 dark:text-rose-400"
                                    : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                                }`}
                            >
                              <span className="block leading-none">
                                {slot.start}
                              </span>
                              <span
                                className={`block text-[9px] mt-0.5 font-normal
                                ${slot.isBooked ? "text-rose-300 dark:text-rose-600" : "text-emerald-400 dark:text-emerald-600"}`}
                              >
                                {slot.isBooked ? "Booked" : `→ ${slot.end}`}
                              </span>
                            </div>

                            {/* Remove button for non-booked */}
                            {/* Remove button for non-booked */}
                            {!slot.isBooked && (
                              <button
                                onClick={() => handleRemoveSlot(slot)}
                                disabled={isRemoving}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 rounded-full text-[10px] font-bold hover:bg-red-500 hover:border-red-500 hover:text-white transition shadow-sm disabled:opacity-50"
                              >
                                {isRemoving ? (
                                  <svg
                                    className="w-2.5 h-2.5 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                  </svg>
                                ) : (
                                  "×"
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* New slots card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                        Add New Slots
                      </h2>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        Select slots to publish for booking
                      </p>
                    </div>
                  </div>

                  {newSlots.length > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                      {selectedSlots.length}/{newSlots.length}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1">
                  {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Select a date first
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Pick a day above to generate slots
                      </p>
                    </div>
                  ) : isInvalidTime ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950 flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Invalid time range
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Fix start/end times to generate slots
                      </p>
                    </div>
                  ) : newSlots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        No slots available
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        All time is already covered by saved slots
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {newSlots.map((slot) => {
                        const key = `${slot.start}-${slot.end}`;
                        const isSelected = selectedSlots.includes(key);
                        return (
                          <button
                            key={key}
                            onClick={() => toggleSlot(slot)}
                            className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all duration-150 focus:outline-none
                              ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200/60 dark:shadow-blue-900/30"
                                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300"
                              }`}
                          >
                            <span className="block leading-none">
                              {slot.start}
                            </span>
                            <span
                              className={`block text-[9px] mt-0.5 font-normal ${isSelected ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}
                            >
                              → {slot.end}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  {newSlots.length > 0 && !isInvalidTime ? (
                    <button
                      onClick={toggleSelectAll}
                      className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {allNewSelected ? "Deselect all" : "Select all"}
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    disabled={
                      selectedSlots.length === 0 ||
                      isSaving ||
                      !selectedDate ||
                      isInvalidTime
                    }
                    onClick={handleSaveAvailability}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white text-xs font-semibold transition-all
                      disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
                      disabled:cursor-not-allowed disabled:scale-100 shadow-sm shadow-blue-200/60 dark:shadow-none disabled:shadow-none"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Saving…
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        Save Slots
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;
