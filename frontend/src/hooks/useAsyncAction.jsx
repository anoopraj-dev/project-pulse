import { useState } from "react";

export const useAsyncAction = () => {
    const [loading, setLoading] = useState(false);

    const executeAsyncFn = async (action) => {
        setLoading(true);

        try {
            return await action();
        } finally {
            setLoading(false)
        }
    };

    return {
        loading,
        setLoading,
        executeAsyncFn
    }
};