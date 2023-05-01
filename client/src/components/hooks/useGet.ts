import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGet<T>(url: string) {
    return useQuery({
        retry: false,
        refetchOnWindowFocus: false,
        queryKey: [],
        queryFn: async () => {
            const response = await axios.get(url);
            return response.data as T;
        }
    })
}