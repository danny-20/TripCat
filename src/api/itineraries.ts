import { Itinerary, ItineraryDay } from "@/constants/itinerary";
import { supabase } from "@/lib/supabase";

export async function createItinerary(
    itinerary: Omit<Itinerary, "id" | "created_at">,
    days: Omit<ItineraryDay, "id" | "created_at" | "itinerary_id" | "day_number">[]
) {
    // -------------------------
    // 1) INSERT INTO itineraries
    // -------------------------
    const { data: itineraryResult, error: itineraryError } = await supabase
        .from("itineraries")
        .insert(itinerary)
        .select("id")
        .single();

    if (itineraryError) {

        return { error: itineraryError, data: null };
    }

    const itineraryId = itineraryResult.id;

    // -------------------------
    // 2) ADD itinerary_id TO ALL DAY ROWS
    // -------------------------
    const dayRows = days.map((d, index) => ({
        ...d,
        itinerary_id: itineraryId,
        day_number: index + 1,
    }));

    // -------------------------
    // 3) INSERT INTO itinerary_days
    // -------------------------
    const { error: daysError } = await supabase
        .from("itinerary_days")
        .insert(dayRows);

    if (daysError) {

        return { error: daysError, data: null };
    }

    return { data: { itineraryId }, error: null };

}




/* -------------------------------------------
   GET ITINERARY WITH DAYS (FOR EDIT)
------------------------------------------- */
export async function getItineraryForEdit(itineraryId: number) {
    const { data: header, error: headerError } = await supabase
        .from("itineraries")
        .select("id, title, subtitle, overview, days")
        .eq("id", itineraryId)
        .single();

    if (headerError) return { data: null, error: headerError };

    const { data: days, error: daysError } = await supabase
        .from("itinerary_days")
        .select("*")
        .eq("itinerary_id", itineraryId)
        .order("day_number", { ascending: true });

    if (daysError) return { data: null, error: daysError };

    return {
        data: {
            itinerary: header,
            days,
        },
        error: null,
    };
}

/* -------------------------------------------
   UPDATE ITINERARY + DAYS
------------------------------------------- */
export async function updateItinerary(
    itineraryId: number,
    itinerary: Pick<Itinerary, "title" | "subtitle" | "overview" | "days">,
    days: Pick<
        ItineraryDay,
        | "id"
        | "from_location"
        | "to_location"
        | "travel_time_hours"
        | "highlights"
        | "overnight_stay"
        | "description"
    >[]
) {
    const { error: headerError } = await supabase
        .from("itineraries")
        .update(itinerary)
        .eq("id", itineraryId);

    if (headerError) return { error: headerError };

    for (let i = 0; i < days.length; i++) {
        const d = days[i];

        const { error } = await supabase
            .from("itinerary_days")
            .update({
                day_number: i + 1,
                from_location: d.from_location,
                to_location: d.to_location,
                travel_time_hours: d.travel_time_hours,
                highlights: d.highlights,
                overnight_stay: d.overnight_stay,
                description: d.description,
            })
            .eq("id", d.id);

        if (error) return { error };
    }

    return { error: null };
}

/* -------------------------------------------
   GET ALL ITINERARIES (ADMIN INDEX)
------------------------------------------- */
export async function getAllItinerariesForIndex() {
    const { data, error } = await supabase
        .from("itineraries")
        .select("id, title, subtitle, days")
        .order("created_at", { ascending: false });

    if (error) {
        return { data: null, error };
    }

    return { data, error: null };
}
