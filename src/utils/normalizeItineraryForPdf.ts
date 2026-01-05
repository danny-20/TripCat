import { PdfDay, PdfItinerary } from "../constants/itinerary";

export function normalizeItineraryForPdf(
    itinerary: any
): PdfItinerary {
    const days: PdfDay[] = itinerary.itinerary_days
        .sort((a: any, b: any) => a.day_number - b.day_number)
        .map((day: any) => ({
            dayNumber: day.day_number,
            title: day.description || "",

            fromLocation: day.from_location || undefined,
            toLocation: day.to_location || undefined,

            travelTime: day.travel_time_hours || undefined,

            highlights: day.highlights || [],

            overnightStay: day.overnight_stay || undefined,

            description: day.description || undefined,
        }));

    return {
        title: itinerary.title,
        subtitle: itinerary.subtitle || undefined,

        overview: days.map((d) => ({
            dayNumber: d.dayNumber,
            summary: d.title,
        })),

        days,
    };
}
