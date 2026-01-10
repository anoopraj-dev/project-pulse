import Doctor from "../../models/doctor.model.js";

//------------- SEARCH CONTROLLER ----------------

export const searchController = async (req, res) => {
  try {
    const { query, type, filters } = req.query;

    if (!query || !type) {
      return res.status(400).json({
        success: false,
        message: "Bad request: query & type are required",
      });
    }

    const parsedFilters = filters ? JSON.parse(filters) : {};
    const regex = new RegExp(query, "i");

    const doctors = await searchDoctors(regex, parsedFilters);

    if (!doctors.length) {
      return res.status(404).json({
        success: false,
        message: "No matching doctors found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Matching doctors found",
      users: doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, failed to complete the request",
    });
  }
};

//----------------- Search Doctors -------------------

const searchDoctors = async (regex, filters) => {
  const limit = Number(filters.limit) || 20;
  const page = Number(filters.page) || 1;

  let query = {
    $or: [{ name: regex }, { specialization: regex }, { location: regex }],
  };

  if (filters.specialization) {
    query.specialization = {
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
