import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../../utilities";

export default function usePut(url: string, body?: any) {
    return useMutation({
        mutationKey: [],
        mutationFn: async () => {
            const response = await axiosClient.put(url);
        }
    })
}