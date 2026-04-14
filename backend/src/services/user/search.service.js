import Doctor from "../../models/doctor.model.js";
import Appointment from "../../models/appointments.model.js";
import Payment from "../../models/payments.model.js";
import Transaction from "../../models/transaction.model.js";
import Patient from "../../models/patient.model.js";
import Wallet from "../../models/wallet.model.js";

//---------------- Search doctors ----------------
export const searchDoctors = async (regex, filters) => {
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

//---------------- Search appointments ----------------
export const searchAppointments = async (regex, filters, role, userId) => {
  let query = {};
  if (role === "patient") query.patient = userId;
  else if (role === "doctor") query.doctor = userId;

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

      if (role === "doctor") return regex.test(patientName);
      if (role === "patient") return regex.test(doctorName);

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

//---------------- Search payments ----------------
export const searchPayments = async (regex, filters, role, userId) => {
  let query = {};
  if (role === "patient") query.patient = userId;
  else if (role === "doctor") query.doctor = userId;

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
      const matchSpecialization = specializations.some((spec) => regex.test(spec));

      return regex.test(doctorName) || regex.test(formattedDate) || matchSpecialization;
    })
    .slice(0, 10);
};

//---------------- Search transactions ----------------
export const searchTransactions = async (regex, filters, role, userId) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) return [];

  const transactions = await Transaction.find({ wallet: wallet._id })
    .select("type referenceType amount notes createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return transactions
    .filter((t) => {
      const matchType = regex.test(t.type);
      const matchReferenceType = regex.test(t.referenceType);
      const formattedDate = t.createdAt
        ? new Date(t.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "numeric",
          })
        : "";
      const matchDate = regex.test(formattedDate);

      return matchType || matchReferenceType || matchDate;
    })
    .slice(0, 10);
};

//---------------- Search patients ----------------
export const searchPatients = async (regex, filters, role, userId) => {
  const limit = Number(filters.limit) || 10;

  let query = {
    $or: [{ name: regex }, { email: regex }],
  };

  if (role === "doctor") {
    const appointments = await Appointment.find({ doctor: userId }).select("patient");
    const patientIds = appointments.map((a) => a.patient);
    query._id = { $in: patientIds };
  }

  if (role === "patient") return [];

  return Patient.find(query)
    .select("name email profilePicture status createdAt gender work")
    .limit(limit);
};


//---------------- Search suggestions ----------------
export const getSearchSuggestions = async (query, type, user) => {
  const regex = new RegExp(`^${query.trim()}`, "i");
  const limit = 6;
  let data = [];

  //------------ Doctors ----------------
  if (type === "doctors") {
    // doctor name matches
    const doctorMatches = await Doctor.find({ name: regex })
      .select("_id name")
      .limit(limit);

    const doctorSuggestions = doctorMatches.map((doc) => ({
      _id: doc._id,
      name: doc.name,
    }));

    // specialization matches
    const specializations = await Doctor.distinct(
      "professionalInfo.specializations"
    );

    const specializationSuggestions = specializations
      .filter((spec) => regex.test(spec))
      .map((spec) => ({ name: spec }));

    // merge + remove duplicates
    data = [
      ...new Map(
        [...doctorSuggestions, ...specializationSuggestions].map((item) => [
          item.name,
          item,
        ])
      ).values(),
    ].slice(0, limit);
  }

  //------------ Appointments ----------------
  else if (type === "appointments") {
    let queryFilter = {};
    if (user.role === "patient") queryFilter.patient = user.id;
    else if (user.role === "doctor") queryFilter.doctor = user.id;

    const appointments = await Appointment.find(queryFilter)
      .populate("doctor", "name")
      .populate("patient", "name")
      .limit(50)
      .lean();

    const doctorSuggestions = appointments
      .map((a) => a.doctor?.name)
      .filter((name) => name && regex.test(name))
      .map((name) => ({ name }));

    const patientSuggestions = appointments
      .map((a) => a.patient?.name)
      .filter((name) => name && regex.test(name))
      .map((name) => ({ name }));

    data = [
      ...new Map(
        [...doctorSuggestions, ...patientSuggestions].map((item) => [
          item.name,
          item,
        ])
      ).values(),
    ].slice(0, limit);
  }

  //------------ Payments ----------------
  else if (type === "payments") {
    let queryFilter = {};
    if (user.role === "patient") queryFilter.patient = user.id;
    else if (user.role === "doctor") queryFilter.doctor = user.id;

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
        p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB") : null
      )
      .filter((date) => date && regex.test(date))
      .map((date) => ({ name: date }));

    const specializationSuggestions = payments
      .flatMap((p) => p.doctor?.professionalInfo?.specializations || [])
      .filter((spec) => regex.test(spec))
      .map((spec) => ({ name: spec }));

    data = [
      ...new Map(
        [...doctorSuggestions, ...dateSuggestions, ...specializationSuggestions].map(
          (item) => [item.name, item]
        )
      ).values(),
    ].slice(0, limit);
  }

  //------------ Specialization ----------------
  else if (type === "specialization") {
    const specs = await Doctor.distinct("professionalInfo.specializations", {
      "professionalInfo.specializations": regex,
    });

    data = specs.map((s) => ({ name: s }));
  }

  //------------ Location ----------------
  else if (type === "location") {
    const loc = await Doctor.distinct("location", { location: regex });
    data = loc.map((l) => ({ name: l }));
  }

  //------------ Patients ----------------
  else if (type === "patients") {
    data = await Patient.find({ name: regex })
      .select("name profilePicture")
      .limit(limit);
  }

  //------------ Transactions ----------------
  else if (type === "transactions") {
    const wallet = await Wallet.findOne({ user: user.id });
    if (!wallet) return [];

    const transactions = await Transaction.find({ wallet: wallet._id })
      .select("type referenceType amount notes createdAt")
      .limit(50)
      .lean();

    data = transactions
      .filter((t) => {
        const formattedDate = t.createdAt
          ? `${t.createdAt.getDate()}/${t.createdAt.getMonth() + 1}`
          : "";
        return (
          regex.test(t.type || "") ||
          regex.test(t.referenceType || "") ||
          regex.test(formattedDate)
        );
      })
      .map((t) => ({
        name: `${t.type || ""} - ${t.referenceType || ""} - ₹${(
          t.amount / 100
        ).toFixed(2)} - ${t.createdAt ? t.createdAt.toLocaleDateString("en-GB") : ""}`,
        _id: t._id,
      }));
  }

  return data;
};