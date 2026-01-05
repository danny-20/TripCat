import { PdfItinerary } from "../constants/itinerary";

export function buildItineraryPdfHtml(
    pdf: PdfItinerary,
    meta: {
        customerName: string;
        agencyPhone: string;
        startDate: string;
        endDate: string;
        adults: number;
        children: number;
    }
) {
    const overviewRows = pdf.overview
        .map(
            (d) => `
            <tr>
                <td><b>DAY-${d.dayNumber}</b></td>
                <td>${d.summary}</td>
            </tr>
        `
        )
        .join("");

    const daySections = pdf.days
        .map((day) => {
            const highlights = day.highlights
                .map(
                    (h) =>
                        `<div class="bullet">• ${h}</div>`
                )
                .join("");

            return `
            <div class="day-title">
                DAY-${day.dayNumber} : ${day.title}
            </div>

            <table class="no-border">
                ${day.fromLocation && day.toLocation
                    ? `
                <tr>
                    <td class="label">Arrival</td>
                    <td>
                        Pickup from ${day.fromLocation}
                        to ${day.toLocation}
                    </td>
                </tr>`
                    : ""
                }

                ${day.travelTime
                    ? `
                <tr>
                    <td class="label">Travel Time</td>
                    <td>${day.travelTime}</td>
                </tr>`
                    : ""
                }

                ${highlights
                    ? `
                <tr>
                    <td class="label">Highlights</td>
                    <td>${highlights}</td>
                </tr>`
                    : ""
                }

                ${day.overnightStay
                    ? `
                <tr>
                    <td class="label">Overnight Stay</td>
                    <td>${day.overnightStay}</td>
                </tr>`
                    : ""
                }
            </table>
            `;
        })
        .join("");

    return `
    <html>
    <head>
        <meta charset="utf-8" />
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                padding: 24px;
                color: #000;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            .no-border td {
                border: none;
                padding: 4px 6px;
                vertical-align: top;
            }
            .label {
                font-weight: bold;
                width: 120px;
            }
            .center {
                text-align: center;
            }
            .section {
                margin-top: 20px;
            }
            .overview-table td {
                border: 1px solid #000;
                padding: 6px;
            }
            .day-title {
                font-weight: bold;
                margin-top: 18px;
                margin-bottom: 6px;
            }
            .bullet {
                margin-left: 14px;
                margin-bottom: 4px;
            }
        </style>
    </head>

    <body>

        <!-- HEADER -->
        <table class="no-border">
            <tr>
                <td><b>Itinerary for</b> ${meta.customerName}</td>
                <td align="right"><b>Contact agency</b> ${meta.agencyPhone}</td>
            </tr>
            <tr>
                <td>
                    <b>Travel dates:</b>
                    ${meta.startDate} to ${meta.endDate}
                </td>
                <td align="right">
                    <b>Total persons:</b>
                    ${meta.adults} + ${meta.children}
                </td>
            </tr>
        </table>

        <br/>

        <!-- TITLE -->
        <div class="center"><b>${pdf.title}</b></div>
        ${pdf.subtitle
            ? `<div class="center">${pdf.subtitle}</div>`
            : ""
        }

        <br/>

        <!-- OVERVIEW -->
        <div class="section"><b>Itinerary Overview</b></div>
        <table class="overview-table">
            ${overviewRows}
        </table>

        <!-- DAY WISE DETAILS -->
        ${daySections}

    </body>
    </html>
    `;
}
