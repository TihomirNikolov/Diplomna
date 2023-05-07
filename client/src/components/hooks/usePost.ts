import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../utilities";

export default function usePost<T>(url: string, body?: any) {
    return useMutation({
        mutationKey: [],
        mutationFn: async () => {
            const response = await axiosClient.post(url, body != null ? body : "");
            return response.data as T;
        }
    })
}