
import {
  searchDoctors,
  searchAppointments,
  searchPayments,
  searchTransactions,
  searchPatients,
  getSearchSuggestions,
} from "../../services/user/search.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

//------------- SEARCH CONTROLLER ----------------
export const searchController = asyncHandler(async (req, res) => {
  const { query, type, filters } = req.query;
  const { role, id: userId } = req.user;

  if (!query || !type) throw new AppError("Bad request: query & type are required", 400);

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
      throw new AppError("Invalid search type", 400);
  }

  return res.status(200).json({
    success: true,
    message: results.length ? "Results found" : "No matching results",
    data: results,
  });
});

//---------------- Search Suggestions Controller ----------------
export const searchSuggestionsController = asyncHandler(async (req, res) => {
  const { query = "", type } = req.query;

  if (!query || !type) throw new AppError("Query and type are required", 400);

  const data = await getSearchSuggestions(query, type, req.user);

  return res.status(200).json({ success: true, data });
});