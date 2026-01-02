export type DBItinerary = {
    id: string;
    title: string;
    subtitle: string;
    days: number;
    created_by: string | null;
    created_at: string;
};

export type DBItineraryDay = {
    id: string;
    itinerary_id: string;
    day_number: number;
    from_location_id: string;
    to_location_id: string;
    created_at: string;
};
