import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { startOfDay, isBefore, startOfWeek, addDays, format } from "date-fns";
import { saveAvailability, getAvailability } from "../../api/doctor/doctorApis";
import toast from "react-hot-toast";

/* ------------------ SLOT GENERATOR ------------------ */
const generateTimeSlots = () => {
  const slots = [];
  const startMinutes = 9 * 60;
  const endMinutes = 17 * 60;

  let current = startMinutes;

  while (current + 30 <= endMinutes) {
    const startH = String(Math.floor(current / 60)).padStart(2, "0");
    const startM = String(current % 60).padStart(2, "0");

    const endSlot = current + 30;
    const endH = String(Math.floor(endSlot / 60)).padStart(2, "0");
    const endM = String(endSlot % 60).padStart(2, "0");

    slots.push(`${startH}:${startM} - ${endH}:${endM}`);

    current += 45;
  }

  return slots;
};

const TIME_SLOTS = generateTimeSlots();

/* ------------------ COMPONENT ------------------ */
const DoctorAvailbility = () => {
  const today = startOfDay(new Date());

  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 5);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(true);

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const selectedSlots = availabilityMap[dateKey] || [];

  /* ------------------ FETCH ON LOAD ------------------ */
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await getAvailability();

        if (!response.data.success) {
          toast.error("Failed to load availability");
          return;
        }

        const map = {};

        response.data.data.forEach((day) => {
          map[day.date] = day.slots.map((slot) => {
            const [start, end] = slot.split("-");
            return `${start.trim()} - ${end.trim()}`;
          });
        });

        setAvailabilityMap(map);
      } catch (error) {
        console.log(error);
        toast.error("Error loading availability");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  /* ------------------ HIGHLIGHT DATES ------------------ */
  const highlightedDates = useMemo(
    () => Object.keys(availabilityMap).map((d) => new Date(d + "T00:00:00")),
    [availabilityMap],
  );

  /* ------------------ TOGGLE SLOT ------------------ */
  const toggleSlot = (slot) => {
    if (!dateKey) return;

    setAvailabilityMap((prev) => {
      const currentSlots = prev[dateKey] || [];

      return {
        ...prev,
        [dateKey]: currentSlots.includes(slot)
          ? currentSlots.filter((s) => s !== slot)
          : [...currentSlots, slot],
      };
    });
  };

  /* ------------------ SAVE ------------------ */
  const handleSave = async () => {
    const payload = Object.entries(availabilityMap).map(([date, slots]) => ({
      date,
      slots,
    }));

    try {
      const response = await saveAvailability(payload);

      if (!response.data?.success) {
        toast.error("Operation failed! Try again");
        return;
      }

      toast.success("Availability saved successfully");
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  /* ------------------ UI ------------------ */
  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* ------------------ HEADER ------------------ */}
      <div className="my-2 bg-gradient-to-br from-sky-50 via-white to-cyan-100 rounded-xl">
        <div className="mx-auto max-w-4xl px-4 pb-6 pt-20">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Doctor · Availability
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Manage Weekly Availability
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Select dates till Saturday and assign time slots. Save once.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ------------------ CALENDAR ------------------ */}
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <p className="text-slate-700 mb-3 font-medium">
              Select Date (Till Saturday)
            </p>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => isBefore(date, today) || date > weekEnd}
              modifiers={{
                hasAvailability: highlightedDates,
              }}
              modifiersClassNames={{
                hasAvailability:
                  "bg-yellow-200 text-yellow-900 font-semibold rounded-md",
              }}
              className="rounded-xl"
            />
          </CardContent>
        </Card>

        {/* ------------------ TIME SLOTS ------------------ */}
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <p className="text-slate-700 mb-3 font-medium">Select Time Slots</p>

            {!selectedDate ? (
              <p className="text-slate-400">Select a date to manage slots</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <Button
                    key={slot}
                    variant="outline"
                    onClick={() => toggleSlot(slot)}
                    className={`rounded-xl transition-all ${
                      selectedSlots.includes(slot)
                        ? "bg-yellow-200 text-yellow-900 border-yellow-200 hover:bg-yellow-200 hover:text-yellow-900 pointer-events-auto"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ------------------ SAVE BUTTON ------------------ */}
      <div className="mt-6">
        <Button
          disabled={Object.keys(availabilityMap).length === 0}
          onClick={handleSave}
          className="rounded-xl px-6 bg-[#0096C7] text-white hover:bg-[#0077A3] disabled:opacity-50"
        >
          Save Weekly Availability
        </Button>
      </div>
    </div>
  );
};

export default DoctorAvailbility;
