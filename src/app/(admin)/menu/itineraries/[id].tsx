import { getItineraryById } from "@/api/itineraries";
import Colors from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, Divider, Text } from "react-native-paper";

/* ===================== HELPERS ===================== */
function normalizeToList(
    value: string | string[] | null | undefined
): string[] {
    if (!value) return [];

    // Already array
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    // Stringified array -> ["aa","bb"]
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed.filter(Boolean);
        }
    } catch {
        // ignore
    }

    // Normal string
    return [value];
}

/* ===================== SCREEN ===================== */
export default function ViewItinerary() {
    const params = useLocalSearchParams();
    const id = params.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await getItineraryById(id);
            setData(res);
        } catch (error) {
            console.log("Error fetching itinerary:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.center}>
                <Text>No itinerary found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen}>
            {/* ================= BASIC DETAILS ================= */}
            <Card style={styles.card}>
                <Card.Content>
                    <Field label="Title" value={data.title} />
                    <Field label="Subtitle" value={data.subtitle || "—"} multiline />
                    <Field label="Overview" value={data.overview || "—"} multiline />
                    <Field
                        label="Duration"
                        value={`${data.days - 1} Night / ${data.days} Day`}
                    />
                </Card.Content>
            </Card>

            {/* ================= DAY WISE DETAILS ================= */}
            {Array.isArray(data.itinerary_days) &&
                data.itinerary_days
                    .sort((a: any, b: any) => a.day_number - b.day_number)
                    .map((day: any) => (
                        <Card key={day.id} style={styles.dayCard}>
                            <Card.Content>
                                <Text style={styles.dayTitle}>
                                    Day {day.day_number}
                                </Text>

                                <Divider />

                                <Field label="From" value={day.from_location} />
                                <Field label="To" value={day.to_location} />

                                <Field
                                    label="Travel Time (Hours)"
                                    value={
                                        day.travel_time_hours != null
                                            ? `${day.travel_time_hours} hrs`
                                            : "—"
                                    }
                                />

                                {/* HIGHLIGHTS AS LIST */}
                                <ListField
                                    label="Highlights"
                                    items={normalizeToList(day.highlights)}
                                />

                                {/* DESCRIPTION AS LIST */}
                                <ListField
                                    label="Description"
                                    items={normalizeToList(day.description)}
                                />

                                <Field
                                    label="Overnight Stay"
                                    value={day.overnight_stay || "—"}
                                />
                            </Card.Content>
                        </Card>
                    ))}
        </ScrollView>
    );
}

/* ===================== REUSABLE FIELDS ===================== */
function Field({
    label,
    value,
    multiline = false,
}: {
    label: string;
    value: string;
    multiline?: boolean;
}) {
    return (
        <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>{label}</Text>
            <Text
                style={[
                    styles.value,
                    multiline && { lineHeight: 22 },
                ]}
            >
                {value}
            </Text>
        </View>
    );
}

function ListField({
    label,
    items,
}: {
    label: string;
    items: string[];
}) {
    return (
        <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>{label}</Text>

            {items.length === 0 ? (
                <Text style={styles.value}>—</Text>
            ) : (
                items.map((item, index) => (
                    <Text key={index} style={styles.listItem}>
                        • {item}
                    </Text>
                ))
            )}
        </View>
    );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 12,
        backgroundColor: Colors.trip.background,
    },
    card: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 16,
    },
    dayCard: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 14,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.trip.primary,
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        color: Colors.trip.muted,
        marginBottom: 2,
    },
    value: {
        fontSize: 15,
        color: Colors.trip.text,
    },
    listItem: {
        fontSize: 15,
        color: Colors.trip.text,
        lineHeight: 22,
        marginTop: 4,
        paddingLeft: 6,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.trip.background,
    },
});
