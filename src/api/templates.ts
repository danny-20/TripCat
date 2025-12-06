import { TemplatePayload } from "@/constants/Types";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


/* ---------------------- Create Template ---------------------- */
export function useCreateTemplate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async (payload: TemplatePayload) => {
            const { data, error } = await supabase
                .from("template_master")
                .insert(payload)
                .select()
                .single();

            if (error) throw new Error(error.message);

            return data;
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["templates"] });
        }
    });
}

/* ---------------------- Fetch Templates for a User ---------------------- */
// GET USER TEMPLATES
export async function getUserTemplates(userId: string) {
    const { data, error } = await supabase
        .from("template_master")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching templates:", error);
        throw error;
    }

    return data;
}

// -----------------------------------------------------------
// HOOK (React Query wrapper)
// -----------------------------------------------------------
export function useGetUserTemplates(userId?: string) {
    return useQuery({
        queryKey: ["user-templates", userId],
        queryFn: () => getUserTemplates(userId!),
        enabled: !!userId, // Prevents running until userId exists
    });
}