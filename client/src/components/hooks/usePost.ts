import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePost<T>(url: string, body?: any) {
    return useMutation({
        mutationKey: [],
        mutationFn: async () => {
            const response = await axios.post(url, body != null ? body : "");
            return response.data as T;
        }
    })
}