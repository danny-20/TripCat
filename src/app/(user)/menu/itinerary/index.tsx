import { getAllItinerariesForIndex } from "@/api/itineraries";
import Colors from "@/constants/Colors";
import { Itinerary } from "@/constants/itinerary";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";

type ItineraryListItem = Pick<
    Itinerary,
    "id" | "title" | "subtitle" | "days"
>;

export default function ItineraryIndex() {
    const [itineraries, setItineraries] = useState<ItineraryListItem[]>([]);
    const [loading, setLoading] = useState(true);

    const hasData = itineraries.length > 0;

    useEffect(() => {
        const load = async () => {
            const { data, error } = await getAllItinerariesForIndex();

            if (!error && data) {
                setItineraries(data);
            }

            setLoading(false);
        };

        load();
    }, []);

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    !hasData && !loading && styles.centerContent,
                ]}
            >
                {/* ─────────────────────────────────────────────── */}
                {/* LOADING STATE */}
                {/* ─────────────────────────────────────────────── */}
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color={Colors.trip.primary}
                    />
                )}

                {/* ─────────────────────────────────────────────── */}
                {/* LIST OF ITINERARIES */}
                {/* ─────────────────────────────────────────────── */}
                {!loading &&
                    hasData &&
                    itineraries.map((item) => (

                        <Surface
                            key={item.id}
                            style={styles.card}
                            elevation={0}
                        >
                            <Text style={styles.cardTitle}>
                                {item.title}
                            </Text>

                            <Text style={styles.cardSub}>
                                {item.subtitle}
                            </Text>

                            <Text style={styles.cardSub}>
                                {item.days} D / {Math.max(item.days - 1, 0)} N Trip
                            </Text>

                            <Link
                                href={{
                                    pathname:
                                        "/(user)/menu/itinerary/[id]",
                                    params: { id: item.id },
                                }}
                                asChild
                            >
                                <Button
                                    mode="contained-tonal"
                                    style={styles.viewButton}
                                    textColor={Colors.trip.primary}
                                >
                                    View & Assign
                                </Button>
                            </Link>
                        </Surface>
                    ))}

                {/* ─────────────────────────────────────────────── */}
                {/* EMPTY STATE */}
                {/* ─────────────────────────────────────────────── */}
                {!loading && !hasData && (
                    <Surface style={styles.emptyCard} elevation={0}>
                        <Text style={styles.emptyTitle}>
                            No itineraries found
                        </Text>
                        <Text style={styles.emptyMessage}>
                            Predefined itineraries will appear here.
                        </Text>
                    </Surface>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.trip.background,
    },
    container: {
        padding: 20,
    },
    centerContent: {
        flexGrow: 1,
        justifyContent: "center",
    },

    // List card style (unchanged)
    card: {
        backgroundColor: Colors.trip.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        padding: 18,
        marginBottom: 16,
    },
    cardTitle: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        color: Colors.trip.text,
    },
    cardSub: {
        marginTop: 4,
        fontSize: 14,
        color: Colors.trip.muted,
    },
    viewButton: {
        marginTop: 12,
        borderRadius: 10,
    },


    // Empty state (unchanged)
    emptyCard: {
        backgroundColor: Colors.trip.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        padding: 20,
        alignItems: "center",
    },
    emptyTitle: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        color: Colors.trip.text,
    },
    emptyMessage: {
        marginTop: 6,
        fontSize: 14,
        color: Colors.trip.muted,
        textAlign: "center",
    },
});
