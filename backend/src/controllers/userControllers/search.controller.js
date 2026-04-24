
import {
  searchDoctors,
  searchAppointments,
  searchPayments,
  searchTransactions,
  searchPatients,
  getSearchSuggestions
} from "../../services/user/search.service.js";

//------------- SEARCH CONTROLLER ----------------
export const searchController = async (req, res) => {
  try {
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

    //---------------- SEARCH SWITCH ----------------
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

    //---------------- RETURN RESULTS ----------------
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



//---------------- Search Suggestions Controller ----------------
export const searchSuggestionsController = async (req, res) => {
  try {
    const { query = "", type } = req.query;

    if (!query || !type) {
      return res.status(400).json({
        success: false,
        message: "Query and type are required",
      });
    }

    const data = await getSearchSuggestions(query, type, req.user);

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