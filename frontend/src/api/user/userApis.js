import { api } from "../axiosInstance";

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
