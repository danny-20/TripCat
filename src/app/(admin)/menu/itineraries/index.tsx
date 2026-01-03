import { deleteItinerary, getAllItinerariesForIndex } from "@/api/itineraries";
import Colors from "@/constants/Colors";
import { Itinerary } from "@/constants/itinerary";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Card,
    FAB,
    IconButton,
    Text,
} from "react-native-paper";

type ItineraryListItem = Pick<
    Itinerary,
    "id" | "title" | "subtitle" | "days"
>;


export default function ItinerariesIndex() {

    const router = useRouter();

    const [itineraries, setItineraries] = useState<ItineraryListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadItineraries = async () => {
            const { data, error } = await getAllItinerariesForIndex();

            if (error) {
                console.error("Error loading itineraries:", error);
            } else if (data) {
                setItineraries(data);
            }

            setLoading(false);
        };

        loadItineraries();
    }, []);

    const handleDelete = (id: number) => {
        Alert.alert(
            "Delete Itinerary",
            "Are you sure you want to delete this itinerary?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } = await deleteItinerary(id);

                            if (error) {
                                Alert.alert("Error", "Failed to delete itinerary");
                                return;
                            }

                            // Refresh list after delete
                            setItineraries((prev) => prev.filter((item) => item.id !== id));

                            Alert.alert("Deleted", "Itinerary deleted successfully");
                        } catch (e) {

                            Alert.alert("Error", "Something went wrong");
                        }
                    },
                },
            ]
        );
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Manage Itineraries</Text>

                {/* Loading */}
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color={Colors.trip.primary}
                    />
                )}

                {/* Empty State */}
                {!loading && itineraries.length === 0 && (
                    <Text style={styles.emptyText}>
                        No itineraries found.
                    </Text>
                )}

                {/* Itinerary Cards */}
                {itineraries.map((item) => (
                    <Card
                        key={item.id}
                        style={styles.card}
                        onPress={() =>
                            router.push(
                                `/(admin)/menu/itineraries/${item.id}` as any
                            )
                        }
                    >
                        <Card.Content>
                            <Text style={styles.itemTitle}>
                                {item.title}
                            </Text>

                            <Text style={styles.itemSubtitle}>
                                {item.subtitle}
                            </Text>

                            <Text style={styles.itemDays}>
                                {Math.max(item.days - 1, 0)} N / {item.days} D
                            </Text>


                            <View style={styles.actionRow}>
                                <IconButton
                                    icon="pencil"
                                    size={22}
                                    iconColor={Colors.trip.primary}
                                    onPress={() =>
                                        router.push(
                                            `/(admin)/menu/itineraries/edit/${item.id}` as any
                                        )
                                    }
                                />

                                <IconButton
                                    icon="delete"
                                    size={22}
                                    iconColor="#D9534F"
                                    onPress={() => handleDelete(item.id as any)}
                                />
                            </View>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            {/* Floating Create Button */}
            <FAB
                icon="plus"
                color={Colors.trip.surface}
                style={styles.fab}
                onPress={() =>
                    router.push("/(admin)/menu/itineraries/create" as any)
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.trip.background,
    },
    content: {
        padding: 16,
        rowGap: 16,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.primary,
        marginBottom: 10,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontFamily: "Montserrat-Medium",
        color: "#777",
    },
    card: {
        backgroundColor: Colors.trip.surface,
        borderRadius: 14,
        elevation: 2,
        paddingVertical: 6,
    },
    itemTitle: {
        fontSize: 18,
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.primary,
    },
    itemSubtitle: {
        fontSize: 14,
        fontFamily: "Montserrat-Medium",
        color: "#777",
        marginTop: 4,
    },
    itemDays: {
        fontSize: 14,
        fontFamily: "Montserrat-Medium",
        color: Colors.trip.primary,
        marginTop: 6,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: Colors.trip.primary,
    },
});
