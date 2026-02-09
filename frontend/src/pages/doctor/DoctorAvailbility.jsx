import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

const DoctorAvailbility = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSave = () => {
    const payload = {
      date: selectedDate,
      slots: selectedSlots,
    };

    console.log("Availability saved:", payload);
    // TODO: API call
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Doctor Availability
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <p className="text-slate-700 mb-3 font-medium">Select Date</p>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-xl"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <p className="text-slate-700 mb-3 font-medium">Select Time Slots</p>

            {!selectedDate ? (
              <p className="text-slate-400">Please select a date first</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <Button
                    key={slot}
                    variant="outline"
                    onClick={() => toggleSlot(slot)}
                    className={`rounded-xl border transition-all \
                      ${
                        selectedSlots.includes(slot)
                          ? "bg-blue-600 text-white border-blue-600"
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

      {/* Save */}
      <div className="mt-6">
        <Button
          disabled={!selectedDate || selectedSlots.length === 0}
          onClick={handleSave}
          className="rounded-xl px-6"
        >
          Save Availability
        </Button>
      </div>
    </div>
  );
};


export default DoctorAvailbility;
