import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { PdfItinerary } from "../constants/itinerary";
import { buildItineraryPdfHtml } from "./buildItineraryPdfHtml";

interface PdfMetaData {
    customerName: string;
    agencyPhone: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
}

export async function generateItineraryPdf(
    itinerary: PdfItinerary,
    meta: PdfMetaData
) {
    // 1️⃣ Build HTML
    const html = buildItineraryPdfHtml(itinerary, meta);

    // 2️⃣ Generate PDF file
    const { uri } = await Print.printToFileAsync({
        html,
    });

    // 3️⃣ Open system share / save dialog
    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
    }

    return uri;
}
