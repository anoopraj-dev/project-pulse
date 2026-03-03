import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { startOfDay, isBefore, addDays, format } from "date-fns";
import { saveAvailability, getAvailability } from "../../api/doctor/doctorApis";
import toast from "react-hot-toast";

const DoctorAvailability = () => {
  const today = startOfDay(new Date());
  const lastAllowedDate = addDays(today, 7);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const selectedSlots = availabilityMap[dateKey] || [];

  // ------------------ FETCH ------------------
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
          map[day.date] = day.slots.map((slot) => ({
            time: `${slot.startTime} - ${slot.endTime}`,
            isBooked: slot.isBooked,
          }));
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

  // ------------------ HIGHLIGHT ------------------
  const highlightedDates = useMemo(
    () =>
      Object.keys(availabilityMap)
        .filter((date) => availabilityMap[date]?.length > 0)
        .map((d) => new Date(d + "T00:00:00")),
    [availabilityMap],
  );

  // ------------------ DATE SELECT ------------------
  const handleDateSelect = (date) => {
    if (!date) return;

    const selected = startOfDay(date);

    if (selected.getTime() === today.getTime()) {
      toast.error("Availability must be set 24 hours in advance.");
      return;
    }

    if (isBefore(selected, today)) return;

    if (selected > lastAllowedDate) {
      toast.error("You can only set availability for the next 7 days");
      return;
    }

    setSelectedDate(date);
  };

  // ------------------ HELPERS ------------------
  const convertToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const formatMinutesToTime = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  // ------------------ ADD SLOT ------------------
  const addSlot = () => {
    if (!dateKey || !startTime) {
      toast.error("Select start time");
      return;
    }

    const startMinutes = convertToMinutes(startTime);
    const endMinutes = startMinutes + duration;

    if (endMinutes > 24 * 60) {
      toast.error("Invalid duration");
      return;
    }

    const formattedEndTime = formatMinutesToTime(endMinutes);
    const slotString = `${startTime} - ${formattedEndTime}`;

    //-------------- Check for slot overlap --------------
    const isOverlapping = selectedSlots.some((slot) => {
      if (!slot?.time) return false;

      const parts = slot.time.split(" - ");
      if (parts.length !== 2) return false;

      const [existingStart, existingEnd] = parts;

      const existingStartMin = convertToMinutes(existingStart);
      const existingEndMin = convertToMinutes(existingEnd);

      return startMinutes < existingEndMin && endMinutes > existingStartMin;
    });

    if (isOverlapping) {
      toast.error("Slot overlaps with existing slot");
      return;
    }

    const newSlot = {
      time: slotString,
      isBooked: false,
    };

    const updatedSlots = [...selectedSlots, newSlot].sort((a, b) => {
      const [aStart] = a.time.split(" - ");
      const [bStart] = b.time.split(" - ");
      return convertToMinutes(aStart) - convertToMinutes(bStart);
    });

    setAvailabilityMap((prev) => ({
      ...prev,
      [dateKey]: updatedSlots,
    }));

    setStartTime("");
    setDuration(30);
  };

  // ------------------ REMOVE SLOT ------------------
  const removeSlot = (index) => {
    if (selectedSlots[index].isBooked) return;

    const updated = [...selectedSlots];
    updated.splice(index, 1);

    setAvailabilityMap((prev) => ({
      ...prev,
      [dateKey]: updated,
    }));
  };

  // ------------------ SAVE ------------------
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
      setSelectedDate(null);
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  // ------------------ UI ------------------
  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
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
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={{ hasAvailability: highlightedDates }}
              modifiersClassNames={{
                hasAvailability:
                  "bg-yellow-200 text-yellow-900 font-semibold rounded-md",
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            {!selectedDate ? (
              <p className="text-slate-400">Select a date</p>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    min="09:00"
                    max="17:00"
                    step={300}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Duration: {duration} mins
                  </label>
                  <Slider
                    min={10}
                    max={120}
                    step={5}
                    value={[duration]}
                    onValueChange={(val) => setDuration(val[0])}
                  />
                </div>

                <Button onClick={addSlot} className="w-full">
                  Add Slot
                </Button>

                <div className="space-y-2">
                  {selectedSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-100 rounded px-3 py-2"
                    >
                      <span>{slot.time}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={slot.isBooked}
                        onClick={() => removeSlot(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button
          disabled={Object.keys(availabilityMap).length === 0}
          onClick={handleSave}
        >
          Save Weekly Availability
        </Button>
      </div>
    </div>
  );
};

export default DoctorAvailability;
