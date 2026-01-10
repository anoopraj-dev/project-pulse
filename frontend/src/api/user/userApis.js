import { api } from "../axiosInstance";


// -------------- Generic Search Api ---------------------
export const searchApi = ({ role,query, type, page = 1, limit = 10 ,filters ={}}) => {
  return api.get(`/api/${role}/search`, {
    params: {
      query,
      type,
      page,
      limit,
      ...filters
    },
  });
};


// -------------- Search Suggestions Api ---------------------
export const fetchSearchSuggestions = ({ role, query, type, limit = 6 }) => {
  return api.get(`/api/${role}/search/suggestions`, {
    params: {
      query,
      type,
      limit,
    },
  });
};
