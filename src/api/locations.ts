import { supabase } from "@/lib/supabase";

export async function getLocations() {
    const { data, error } = await supabase
        .from("locations")
        .select("id, name")
        .order("name", { ascending: true });

    if (error) {
        console.log("Error fetching locations:", error);
        throw error;
    }

    // Convert to dropdown-friendly format
    return data.map((loc) => ({
        label: loc.name,
        value: loc.id,
    }));
}
