import Doctor from "../../models/doctor.model.js";
import Appointment from "../../models/appointments.model.js";
import Payment from "../../models/payments.model.js";
import Transaction from "../../models/transaction.model.js";
import Patient from "../../models/patient.model.js";

//------------- SEARCH CONTROLLER ----------------

export const searchController = async (req, res) => {
  try {
    console.log(req.query);
    const { query, type, filters } = req.query;
    const { role, id: userId } = req.user;

    if (!query || !type) {
      return res.status(400).json({
        success: false,
        message: "Bad request: query & type are required",
      });
    }

    const parsedFilters = filters ? JSON.parse(filters) : {};
    const regex = new RegExp(query, "i");

    let results = [];

    switch (type) {
      case "doctors":
        results = await searchDoctors(regex, parsedFilters);
        break;

      case "appointments":
        results = await searchAppointments(regex, parsedFilters, role, userId);
        break;

      case "payments":
        results = await searchPayments(regex, parsedFilters, role, userId);
        break;

      case "transactions":
        results = await searchTransactions(regex, parsedFilters, role, userId);
        break;

      case "patients":
        results = await searchPatients(regex, parsedFilters, role, userId);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid search type",
        });
    }

    return res.status(200).json({
      success: true,
      message: results.length ? "Results found" : "No matching results",
      data: results,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, failed to complete the request",
    });
  }
};

//---------------- Search doctors -------------------
const searchDoctors = async (regex, filters) => {
  const limit = Number(filters.limit) || 20;
  const page = Number(filters.page) || 1;

  let query = {
    $or: [
      { name: regex },
      { "professionalInfo.specializations": regex },
      { location: regex },
    ],
  };

  if (filters.specialization) {
    query["professionalInfo.specializations"] = {
      $regex: new RegExp(`^${filters.specialization}$`, "i"),
    };
  }

  if (filters.location) {
    query.location = {
      $regex: filters.location,
      $options: "i",
    };
  }

  return Doctor.find(query)
    .select("-password")
    .limit(limit)
    .skip((page - 1) * limit);
};

//-------------- Search appointments -----------------
const searchAppointments = async (regex, filters, role, userId) => {
  let query = {};
  if (role === "patient") {
    query.patient = userId;
  } else if (role === "doctor") {
    query.doctor = userId;
  }

  const appointments = await Appointment.find(query)
    .populate({
      path: "doctor",
      select: "name professionalInfo.specializations location profilePicture",
    })
    .populate({
      path: "patient",
      select: "name gender profilePicture work",
    })
    .lean();

  return appointments
    .filter((appt) => {
      const doctorName = appt.doctor?.name || "";
      const patientName = appt.patient?.name || "";

      if (role === "doctor") {
        return regex.test(patientName);
      }

      if (role === "patient") {
        return regex.test(doctorName);
      }

      // admin: search using both
      return regex.test(patientName) || regex.test(doctorName);
    })
    .map((appt) => ({
      ...appt,
      doctor: {
        ...appt.doctor,
        specialization:
          appt.doctor?.professionalInfo?.specializations?.[0] || null,
      },
    }));
};

//---------------- Search payments -------------
const searchPayments = async (regex, filters, role, userId) => {
  let query = {};

  if (role === "patient") {
    query.patient = userId;
  } else if (role === "doctor") {
    query.doctor = userId;
  }

  const payments = await Payment.find(query)
    .populate("doctor", "name profilePicture professionalInfo.specializations")
    .lean();

  return payments
    .filter((p) => {
      const doctorName = p.doctor?.name || "";

      const formattedDate = p.createdAt
        ? new Date(p.createdAt).toLocaleDateString("en-GB")
        : "";

      const specializations = p.doctor?.professionalInfo?.specializations || [];

      const matchSpecialization = specializations.some((spec) =>
        regex.test(spec),
      );

      return (
        regex.test(doctorName) ||
        regex.test(formattedDate) ||
        matchSpecialization
      );
    })
    .slice(0, 10);
};

//--------------- Search Transactions ------------------
const searchTransactions = async (regex, filters, role, userId) => {
  let query = {
    $or: [{ type: regex }, { status: regex }],
  };

  if (role === "patient") {
    query.user = userId;
  } else if (role === "doctor") {
    query.user = userId;
  }

  return Transaction.find(query).limit(10);
};

//-------------- Search patients -----------------
const searchPatients = async (regex, filters, role, userId) => {
  console.log("role inside searchPatient", role);
  const limit = Number(filters.limit) || 10;

  let query = {
    $or: [{ name: regex }, { email: regex }],
  };

  if (role === "doctor") {
    const appointments = await Appointment.find({ doctor: userId }).select(
      "patient",
    );

    const patientIds = appointments.map((a) => a.patient);

    query._id = { $in: patientIds };
  }

  if (role === "patient") {
    return [];
  }

  return Patient.find(query)
    .select("name email profilePicture status createdAt gender work")
    .limit(limit);
};

//----------------- Search Suggestions --------------------
export const searchSuggestionsController = async (req, res) => {
  try {
    const { query = "", type, limit = 6 } = req.query;

    if (!query || !type) {
      return res.status(400).json({
        success: false,
        message: "Query and type are required",
      });
    }

    const regex = new RegExp(`^${query.trim()}`, "i");
    let data = [];

    //-------------- Search suggestion for doctors -----------
    if (type === "doctors") {
      //--------- doctor name matches -------------
      const doctorMatches = await Doctor.find({ name: regex })
        .select("name")
        .limit(Number(limit));

      const doctorSuggestions = doctorMatches.map((doc) => ({
        name: doc.name,
      }));

      //--------- specialization matches -------------
      const specializations = await Doctor.distinct(
        "professionalInfo.specializations",
      );

      const specializationSuggestions = specializations
        .filter((spec) => regex.test(spec))
        .map((spec) => ({ name: spec }));

      //--------- merge + remove duplicates -------------
      const unique = [
        ...new Map(
          [...doctorSuggestions, ...specializationSuggestions].map((item) => [
            item.name,
            item,
          ]),
        ).values(),
      ];

      data = unique.slice(0, Number(limit));
    }
    //------------------ appointment suggestions -------------

    else if (type === "appointments") {
      let queryFilter = {};

      if (req.user.role === "patient") {
        queryFilter.patient = req.user.id;
      } else if (req.user.role === "doctor") {
        queryFilter.doctor = req.user.id;
      }

      const appointments = await Appointment.find(queryFilter)
        .populate("doctor", "name")
        .populate("patient", "name")
        .limit(50)
        .lean();

      //--------- doctor name suggestions -------------
      const doctorSuggestions = appointments
        .map((a) => a.doctor?.name)
        .filter((name) => name && regex.test(name))
        .map((name) => ({ name }));

      //--------- patient name suggestions -------------
      const patientSuggestions = appointments
        .map((a) => a.patient?.name)
        .filter((name) => name && regex.test(name))
        .map((name) => ({ name }));

      //--------- merge + remove duplicates -------------
      const unique = [
        ...new Map(
          [...doctorSuggestions, ...patientSuggestions].map((item) => [
            item.name,
            item,
          ]),
        ).values(),
      ];

      data = unique.slice(0, Number(limit));
    }

    //--------- payments search suggestions -------------
    else if (type === "payments") {
      let queryFilter = {};

      if (req.user.role === "patient") {
        queryFilter.patient = req.user.id;
      } else if (req.user.role === "doctor") {
        queryFilter.doctor = req.user.id;
      }

      const payments = await Payment.find(queryFilter)
        .populate("doctor", "name professionalInfo.specializations")
        .populate("appointment", "date")
        .limit(50)
        .lean();

      const doctorSuggestions = payments
        .map((p) => p.doctor?.name)
        .filter((name) => name && regex.test(name))
        .map((name) => ({ name }));

      const dateSuggestions = payments
        .map((p) =>
          p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("en-GB")
            : null,
        )
        .filter((date) => date && regex.test(date))
        .map((date) => ({ name: date }));

      const specializationSuggestions = payments
        .flatMap((p) => p.doctor?.professionalInfo?.specializations || [])
        .filter((spec) => regex.test(spec))
        .map((spec) => ({ name: spec }));

      const unique = [
        ...new Map(
          [
            ...doctorSuggestions,
            ...dateSuggestions,
            ...specializationSuggestions,
          ].map((item) => [item.name, item]),
        ).values(),
      ];

      data = unique.slice(0, Number(limit));
    } else if (type === "specialization") {
      const specs = await Doctor.distinct("professionalInfo.specializations", {
        "professionalInfo.specializations": regex,
      });

      data = specs.map((s) => ({ name: s }));
    } else if (type === "location") {
      const loc = await Doctor.distinct("location", {
        location: regex,
      });

      data = loc.map((l) => ({ name: l }));
    }
    //-------------- Patients search suggestions ---------
    else if (type === "patients") {
      data = await Patient.find({ name: regex })
        .select("name profilePicture")
        .limit(Number(limit));
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid search type",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Suggestion error:", error);
    return res.status(500).json({
      success: false,
      message: "Suggestion fetch failed",
    });
  }
};
