import { AgencyDetails, AgencyDetailsPayload } from "@/constants/Types";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//
// ─────────────────────────────────────────────
//   GET AGENCY DETAILS
// ─────────────────────────────────────────────
//

export const useGetAgencyDetail = (userId?: string | null) => {
    return useQuery({
        queryKey: ["agency-details", userId],
        enabled: Boolean(userId),
        queryFn: async (): Promise<AgencyDetails | null> => {
            if (!userId) return null;

            const { data, error } = await supabase
                .from("agency_details")
                .select("*")
                .eq("uid", userId)
                .maybeSingle();

            if (error) throw error;

            return data ?? null;
        },
    });
};

//
// ─────────────────────────────────────────────
//   INSERT AGENCY DETAILS
// ─────────────────────────────────────────────
//

export const useInsertAgencyDetails = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: AgencyDetailsPayload) => {
            const { data, error } = await supabase
                .from("agency_details")
                .insert(payload)
                .select()
                .single();

            if (error) throw error;
            return data as AgencyDetails;
        },

        onSuccess: (created) => {
            queryClient.setQueryData(
                ["agency-details", created.uid],
                created
            );
        },
    });
};

//
// ─────────────────────────────────────────────
//   UPDATE AGENCY DETAILS
// ─────────────────────────────────────────────
//

export type UpdateAgencyPayload = {
    id: number;                  // must be number
    payload: Omit<AgencyDetailsPayload, "uid">;
};

export const useUpdateAgencyDetails = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: UpdateAgencyPayload) => {
            const { data, error } = await supabase
                .from("agency_details")
                .update(payload)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data as AgencyDetails;
        },

        onSuccess: (updated) => {
            queryClient.setQueryData(
                ["agency-details", updated.uid],
                updated
            );
        },
    });
};

//
// ─────────────────────────────────────────────
//   LOGOUT
// ─────────────────────────────────────────────
//

export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);

    return true;
};
