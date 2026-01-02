import { getItineraryForEdit } from "@/api/itineraries";
import Colors from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    Surface,
    Text,
} from "react-native-paper";

export default function UserItineraryPreview() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [itinerary, setItinerary] = useState<any>(null);
    const [days, setDays] = useState<any[]>([]);

    /* -------------------------------------------
       NORMALIZE DESCRIPTION
       Handles:
       - string
       - string[]
       - '["a","b"]'
    ------------------------------------------- */
    const normalizeDescription = (desc: any): string[] => {
        if (!desc) return [];

        if (Array.isArray(desc)) {
            return desc.flat().map(String);
        }

        if (typeof desc === "string" && desc.trim().startsWith("[")) {
            try {
                const parsed = JSON.parse(desc);
                if (Array.isArray(parsed)) {
                    return parsed.flat().map(String);
                }
            } catch { }
        }

        return [String(desc)];
    };

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            const { data, error } = await getItineraryForEdit(Number(id));

            if (!error && data) {
                setItinerary(data.itinerary);
                setDays(data.days);
            }

            setLoading(false);
        };

        load();
    }, [id]);

    /* -------------------------------------------
       LOADING / ERROR
    ------------------------------------------- */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.trip.primary} />
            </View>
        );
    }

    if (!itinerary) {
        return (
            <View style={styles.center}>
                <Text>Itinerary not found</Text>
            </View>
        );
    }

    /* -------------------------------------------
       UI
    ------------------------------------------- */
    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* HEADER */}
                <Text style={styles.title}>{itinerary.title}</Text>

                {itinerary.subtitle && (
                    <Text style={styles.subtitle}>
                        {itinerary.subtitle}
                    </Text>
                )}

                {itinerary.overview && (
                    <Surface style={styles.overviewCard} elevation={0}>
                        <Text style={styles.overviewText}>
                            {itinerary.overview}
                        </Text>
                    </Surface>
                )}

                {/* DAYS */}
                {days.map((day, index) => {
                    const descriptions = normalizeDescription(day.description);

                    return (
                        <Surface
                            key={day.id}
                            style={styles.dayCard}
                            elevation={0}
                        >
                            <Text style={styles.dayTitle}>
                                Day {index + 1}
                            </Text>

                            <Text style={styles.dayRoute}>
                                {day.from_location} → {day.to_location}
                            </Text>

                            {/* META INFO */}
                            {day.travel_time_hours && (
                                <Text style={styles.meta}>
                                    Travel Time: {day.travel_time_hours} hrs
                                </Text>
                            )}

                            {day.overnight_stay && (
                                <Text style={styles.meta}>
                                    Overnight: {day.overnight_stay}
                                </Text>
                            )}

                            {/* DESCRIPTION (ONLY IF EXISTS, AFTER META) */}
                            {descriptions.filter(d => d.trim().length > 0).length > 0 && (
                                <>
                                    <Text style={styles.sectionLabel}>
                                        Description
                                    </Text>

                                    {descriptions
                                        .filter(d => d.trim().length > 0)
                                        .map((text, i) => (
                                            <Text key={i} style={styles.description}>
                                                • {text}
                                            </Text>
                                        ))}
                                </>
                            )}

                        </Surface>
                    );
                })}
            </ScrollView>

            {/* FIXED ACTION */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    buttonColor={Colors.trip.primary}
                    textColor={Colors.trip.surface}
                    onPress={() =>
                        router.push(
                            `/(user)/menu/itineraries/assign/${id}` as any
                        )
                    }
                >
                    Assign to Customer
                </Button>
            </View>
        </View>
    );
}

/* -------------------------------------------
   STYLES
------------------------------------------- */
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.trip.background,
    },
    container: {
        padding: 20,
        paddingBottom: 120,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.trip.background,
    },

    title: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 22,
        color: Colors.trip.text,
    },
    subtitle: {
        marginTop: 6,
        fontSize: 15,
        color: Colors.trip.text,
    },

    overviewCard: {
        marginTop: 16,
        padding: 14,
        borderRadius: 12,
        backgroundColor: Colors.trip.surface,
        borderWidth: 1,
        borderColor: Colors.trip.border,
    },
    overviewText: {
        fontSize: 14,
        color: Colors.trip.text,
        lineHeight: 20,
    },

    dayCard: {
        marginTop: 16,
        padding: 16,
        borderRadius: 14,
        backgroundColor: Colors.trip.surface,
        borderWidth: 1,
        borderColor: Colors.trip.border,
    },
    dayTitle: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 16,
        color: Colors.trip.primary,
    },
    dayRoute: {
        marginTop: 6,
        fontSize: 14,
        color: Colors.trip.text,
    },
    meta: {
        marginTop: 6,
        fontSize: 13,
        color: Colors.trip.text,
    },

    sectionLabel: {
        marginTop: 10,
        fontSize: 13,
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.text,
    },

    description: {
        marginTop: 4,
        fontSize: 14,
        color: Colors.trip.text,
        lineHeight: 22,
    },

    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        backgroundColor: Colors.trip.surface,
        borderTopWidth: 1,
        borderColor: Colors.trip.border,
    },
});
