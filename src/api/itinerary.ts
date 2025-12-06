import {
    CreateItineraryPayload,
    ItineraryDetails,
    ItineraryListItem,
    ItineraryTemplate,
} from "@/constants/Types";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

// ======================================================
// GET DEFAULT TEMPLATE
// ======================================================
export const useGetItineraryTemplate = () => {
    return useQuery({
        queryKey: ["itinerary-template"],
        queryFn: async (): Promise<ItineraryTemplate | null> => {
            const { data, error } = await supabase
                .from("itinerary_templates")
                .select("*")
                .order("created_at", { ascending: true })
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            return data as ItineraryTemplate | null;
        },
    });
};

// ======================================================
// CREATE ITINERARY
// ======================================================
export const useCreateItinerary = () => {
    return useMutation({
        mutationFn: async (payload: CreateItineraryPayload) => {
            // --------------------------
            // 1) INSERT MAIN ITINERARY
            // --------------------------
            const { data: created, error } = await supabase
                .from("itineraries")
                .insert({
                    created_by: payload.created_by,
                    updated_by: payload.updated_by,
                    title: payload.title,
                    customer_name: payload.customer_name,
                    trip_start_date: payload.trip_start_date,
                    trip_end_date: payload.trip_end_date,
                    num_adults: payload.num_adults,
                    num_children: payload.num_children,
                    notes: payload.notes,
                    inclusions: payload.inclusions,
                    exclusions: payload.exclusions,
                    terms: payload.terms,
                })
                .select("*")
                .single();

            if (error) throw error;

            // --------------------------
            // 2) INSERT DAYS
            // --------------------------
            const daysPayload = payload.days.map((d) => ({
                itinerary_id: created.id,
                created_by: payload.created_by,
                updated_by: payload.updated_by,
                day_number: d.dayNumber,
                title: d.title,
                activities: d.activities, // JSONB
            }));

            const { error: dayErr } = await supabase
                .from("itinerary_days")
                .insert(daysPayload);

            if (dayErr) throw dayErr;

            return created;
        },
    });
};

// ======================================================
// FETCH ITINERARY LIST
// ======================================================
export const useGetItineraryList = (uid: string) => {
    return useQuery({
        queryKey: ["itinerary-list", uid],
        enabled: !!uid,
        queryFn: async (): Promise<ItineraryListItem[]> => {
            const { data, error } = await supabase
                .from("itineraries")
                .select("*")
                .eq("created_by", uid)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as ItineraryListItem[];
        },
    });
};

// ======================================================
// FETCH ITINERARY DETAILS
// ======================================================
export const useGetItineraryDetails = (id?: string) => {
    return useQuery({
        queryKey: ["itinerary-details", id],
        enabled: !!id,
        queryFn: async (): Promise<ItineraryDetails | null> => {
            if (!id) return null;

            const { data: itinerary, error } = await supabase
                .from("itineraries")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            if (!itinerary) return null;

            const { data: days, error: dayErr } = await supabase
                .from("itinerary_days")
                .select("*")
                .eq("itinerary_id", id)
                .order("day_number", { ascending: true });

            if (dayErr) throw dayErr;

            return {
                ...(itinerary as any),
                days: days ?? [],
            } as ItineraryDetails;
        },
    });
};

// ======================================================
// UPDATE ITINERARY (optional, for Edit)
// ======================================================
export const useUpdateItinerary = () => {
    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string;
            payload: CreateItineraryPayload;
        }) => {
            // 1) UPDATE MAIN
            const { error } = await supabase
                .from("itineraries")
                .update({
                    updated_by: payload.updated_by,
                    updated_at: new Date().toISOString(),
                    title: payload.title,
                    customer_name: payload.customer_name,
                    trip_start_date: payload.trip_start_date,
                    trip_end_date: payload.trip_end_date,
                    num_adults: payload.num_adults,
                    num_children: payload.num_children,
                    notes: payload.notes,
                    inclusions: payload.inclusions,
                    exclusions: payload.exclusions,
                    terms: payload.terms,
                })
                .eq("id", id);

            if (error) throw error;

            // 2) DELETE OLD DAYS
            await supabase.from("itinerary_days").delete().eq("itinerary_id", id);

            // 3) INSERT NEW DAYS
            const newDays = payload.days.map((d) => ({
                itinerary_id: id,
                created_by: payload.created_by,
                updated_by: payload.updated_by,
                day_number: d.dayNumber,
                title: d.title,
                activities: d.activities,
            }));

            const { error: insertErr } = await supabase
                .from("itinerary_days")
                .insert(newDays);

            if (insertErr) throw insertErr;

            return true;
        },
    });
};
