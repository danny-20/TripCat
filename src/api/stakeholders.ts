import {
    CreateStakeholderPayload,
    Stakeholder,
    UpdateStakeholderPayload,
} from "@/constants/Types";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ===============================
   GET ALL STAKEHOLDERS
================================ */
export const useStakeholders = (userId?: string | null) => {
    return useQuery({
        queryKey: ["stakeholders", userId],
        enabled: Boolean(userId),
        queryFn: async (): Promise<Stakeholder[]> => {
            const { data, error } = await supabase
                .from("stakeholders")
                .select("*")
                .eq("uid", userId)
                .order("id", { ascending: false });

            if (error) throw error;
            return data ?? [];
        },
    });
};

/* ===============================
   GET SINGLE STAKEHOLDER
================================ */
export const useStakeholder = (id?: number) => {
    return useQuery({
        queryKey: ["stakeholder", id],
        enabled: Boolean(id),
        queryFn: async (): Promise<Stakeholder> => {
            const { data, error } = await supabase
                .from("stakeholders")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            return data;
        },
    });
};

/* ===============================
   CREATE STAKEHOLDER
================================ */
export const useCreateStakeholder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateStakeholderPayload) => {
            const { data, error } = await supabase
                .from("stakeholders")
                .insert(payload)
                .select()
                .single();

            if (error) throw error;
            return data as Stakeholder;
        },

        onSuccess: (created) => {
            queryClient.invalidateQueries({ queryKey: ["stakeholders", created.uid] });
        },
    });
};

/* ===============================
   UPDATE STAKEHOLDER
================================ */
export const useUpdateStakeholder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...changes }: UpdateStakeholderPayload) => {
            const { data, error } = await supabase
                .from("stakeholders")
                .update(changes)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data as Stakeholder;
        },

        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["stakeholders", updated.uid] });
            queryClient.invalidateQueries({ queryKey: ["stakeholder", updated.id] });
        },
    });
};

/* ===============================
   DELETE STAKEHOLDER
================================ */
export const useDeleteStakeholder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from("stakeholders")
                .delete()
                .eq("id", id);

            if (error) throw error;
            return id;
        },

        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: ["stakeholders"] });
            queryClient.invalidateQueries({ queryKey: ["stakeholder", id] });
        },
    });
};
