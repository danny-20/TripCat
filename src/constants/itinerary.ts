export interface Itinerary {
    id?: number;             // serial PRIMARY KEY
    title: string;
    subtitle?: string | null;
    overview?: string | null;
    days: number;
    created_by: string;      // uuid
    created_at?: string;
}

export interface ItineraryDay {
    id?: number;                  // serial PRIMARY KEY
    itinerary_id: number;         // foreign key
    day_number: number;           // 1, 2, 3...
    from_location: string;        // location NAME
    to_location: string;          // location NAME
    travel_time_hours: number;    // number
    highlights?: string | null;   // multiline text
    overnight_stay: string;       // location NAME
    description: string[];        // ["Arrival", "City Tour"]
    created_by: string;           // uuid
    created_at?: string;
}


export type LocationOption = {
    id: string;
    name: string;
};

export type DayForm = {
    id: number;
    from: string;
    to: string;
    travel_time: string;
    highlights: string;
    overnight_stay: string;
    description: string[];

};