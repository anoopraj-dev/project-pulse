import { useEffect, useState } from "react";
import { useAsyncAction } from "./useAsyncAction";
import { searchApi } from "../api/user/userApis";

export const useSearch = ({ role,type, minLength = 2, debounce = 400,filters={} }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const searchAction = useAsyncAction();

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < minLength) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchAction.executeAsyncFn(async () => {
        try {
          const res = await searchApi({
            role,
            query: trimmed,
            filters,
            type,
          });

          setResults(res?.data?.users || []);
        } catch (error) {
          console.error("Search failed", error);
        }
      });
    }, debounce);

    return () => clearTimeout(timer);
  }, [query, type, minLength, debounce,JSON.stringify(filters)]);

  return {
    query,
    setQuery,
    results,
    loading: searchAction.loading,
  };
};
