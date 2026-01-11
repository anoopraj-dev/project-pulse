import { useState } from "react"
import { useAsyncAction } from "./useAsyncAction";
import { useEffect } from "react";

export const useTypeahead = ({query, apiCall, delay=250}) =>{
    const [suggestions,setSuggestions] = useState([]);
    const typeAheadAction = useAsyncAction();

    useEffect(()=>{
        if(!query){
            setSuggestions([]);
            return ;
        }

        const timer = setTimeout(()=>{
            typeAheadAction.executeAsyncFn( async () =>{
                try {
                    const res = await apiCall(query);;
                    setSuggestions(res?.data?.data || [])
                } catch (error) {
                    setSuggestions([]);
                }
            })
        },delay)

        return () => clearTimeout(timer)
    },[query])

    return { suggestions, loading: typeAheadAction.loading}
}