import DoctorAvailability from '../../models/availability.model.js'


//----------------- Get doctor availability ----------------
export const getAvailability = async (req, res) => {
    try {
        const { id } = req.user;
        const availability = await DoctorAvailability
            .find({ doctorId: id })
            .sort({ date: 1 });

        const formattedAvailability = availability.map((day) => ({
            date: day.date.toISOString().split('T')[0],
            slots: day.slots.map((slot) =>
                `${slot.startTime.trim()}-${slot.endTime.trim()}`
            )
        }));

        res.status(200).json({
            success: true,
            data: formattedAvailability
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



//----------------- Save doctor availability ----------------
export const saveAvailability = async (req, res) => {
    try {
        const { id } = req.user;
        const payload = req.body;

        if (!payload || payload.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No availability provided'
            });
        }

        //----------------- filter empty slot dates -----------------
        const filtered = payload.filter(day => day.slots && day.slots.length > 0);

        //----------------- remove all existing availability (weekly snapshot logic) -----------------
        await DoctorAvailability.deleteMany({ doctorId: id });

        //----------------- prepare new documents -----------------
        const documents = filtered.map((day) => {

            const dateObj = new Date(day.date);

            // Calculate Monday of that week
            const dayOfWeek = dateObj.getDay(); // 0 = Sunday
            const diffToMonday = (dayOfWeek + 6) % 7;

            const weekStart = new Date(dateObj);
            weekStart.setDate(dateObj.getDate() - diffToMonday);
            weekStart.setHours(0, 0, 0, 0);

            // Saturday of that week
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 5);
            weekEnd.setHours(23, 59, 59, 999);

            const slots = day.slots.map((slot) => {
                const [startTime, endTime] = slot
                    .split('-')
                    .map((s) => s.trim());

                return {
                    startTime,
                    endTime,
                    isBooked: false,
                };
            });

            return {
                doctorId: id,
                date: dateObj,
                weekStart,
                weekEnd,
                slots
            };
        });

        //----------------- insert fresh availability -----------------
        if (documents.length > 0) {
            await DoctorAvailability.insertMany(documents);
        }

        res.status(201).json({
            success: true,
            message: 'Scheduled availability'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
