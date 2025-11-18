import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useGetAgencyDetail = () => {

    // const { session } = useAuth();
    // console.log("this is a session:", session?.user)
    return useQuery({
        queryKey: ['agency-details'],
        queryFn: async () => {
            const { data, error } = await supabase.from("agency_details").select("*");
            if (error) {
                throw new Error(error.message)
            }
            return data;
        }

    });
}