import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../utilities";

export function useGetType<T>(url: string) {
    return useQuery({
        retry: false,
        refetchOnWindowFocus: false,
        queryKey: [],
        queryFn: async () => {
            const response = await axiosClient.get(url);
            return response.data as T;
        }
    })
}

export function useGet(url: string){
    return useQuery({
        retry: false,
        refetchOnWindowFocus: false,
        queryKey: [],
        queryFn: async () => {
            const response = await axiosClient.get(url);
        }
    })
}