import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";

// TODO: Replace with real Supabase data
const fakeItineraries: any[] = [];

export default function ItineraryIndex() {
    const hasData = fakeItineraries.length > 0;

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    !hasData && styles.centerContent, // center only when empty
                ]}
            >
                {/* ─────────────────────────────────────────────── */}
                {/* CREATE BUTTON - Centered */}
                {/* ─────────────────────────────────────────────── */}
                <View style={styles.centerWrapper}>
                    <Link href="/(user)/menu/Itinerary/create" asChild>
                        <Button
                            mode="contained"
                            buttonColor={Colors.trip.primary}
                            textColor={Colors.trip.surface}
                            style={styles.createButton}
                        >
                            Create Itinerary
                        </Button>
                    </Link>

                    {/* Space between buttons */}

                </View>

                {/* ─────────────────────────────────────────────── */}
                {/* LIST OF ITINERARIES */}
                {/* ─────────────────────────────────────────────── */}
                {hasData &&
                    fakeItineraries.map((item) => (
                        <Surface key={item.id} style={styles.card} elevation={0}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSub}>{item.days} Days Trip</Text>

                            <Link
                                href={{
                                    pathname: "/(user)/menu/Itinerary/[id]",
                                    params: { id: item.id },
                                }}
                                asChild
                            >
                                <Button
                                    mode="contained-tonal"
                                    style={styles.viewButton}
                                    textColor={Colors.trip.primary}
                                >
                                    View Details
                                </Button>
                            </Link>
                        </Surface>
                    ))}

                {/* ─────────────────────────────────────────────── */}
                {/* EMPTY STATE */}
                {/* ─────────────────────────────────────────────── */}
                {!hasData && (
                    <Surface style={styles.emptyCard} elevation={0}>
                        <Text style={styles.emptyTitle}>No itineraries found</Text>
                        <Text style={styles.emptyMessage}>
                            Create your first itinerary to get started.
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

    centerWrapper: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },

    createButton: {
        width: 220,
        borderRadius: 12,
    },

    // List card style (matches stakeholders)
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

    // Empty state (same as stakeholders)
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
