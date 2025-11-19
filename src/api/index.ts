import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useGetAgencyDetail = (userId?: string) => {
    return useQuery({
        queryKey: ['agency-details', userId],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("agency_details")
                .select("*")
                .eq("uid", userId)
                .single();
            if (error) {
                throw new Error(error.message)
            }
            return data;
        }

    });
};


export const useUpdateAgencyDetails = async (id: string, payload: any) => {
    const { data, error } = await supabase
        .from("agency_details")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    return true;
};