import { useGetUserTemplates } from "@/api/templates";
import { useAuth } from "@/app/providers/AuthProvider";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, FAB, Surface, Text } from "react-native-paper";

export default function TemplateListScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const userId = session?.user?.id;

    // FETCH USER TEMPLATES
    const { data, isLoading, error } = useGetUserTemplates(userId);

    /* LOADING */
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading templates...</Text>
            </View>
        );
    }

    /* ERROR */
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error loading templates</Text>
            </View>
        );
    }

    /* EMPTY STATE */
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No templates found</Text>
                <Text style={styles.emptySubtitle}>
                    Start by creating your first template.
                </Text>

                <Link href="/(user)/menu/templates/create" asChild>
                    <Button
                        mode="contained"
                        buttonColor={Colors.trip.primary}
                        textColor="#fff"
                        style={styles.emptyButton}
                        labelStyle={styles.emptyButtonLabel}
                    >
                        Create Template
                    </Button>
                </Link>
            </View>
        );
    }

    /* LIST VIEW */
    return (
        <View style={styles.listScreen}>
            <FlatList
                contentContainerStyle={styles.listContent}
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Surface style={styles.card} elevation={2}>
                        <Text style={styles.cardTitle}>{item.template_title}</Text>

                        <Text style={styles.cardSub}>
                            {item.district} • {item.travel_time}
                        </Text>

                        {item.overnight_stay && (
                            <Text style={styles.cardSub}>
                                Overnight: {item.overnight_stay}
                            </Text>
                        )}

                        {/* <Link
                            href={{
                                pathname: "/(user)/menu/templates/[id]",
                                params: { id: item.id },
                            }}
                            asChild
                        >
                            <Button
                                mode="contained"
                                buttonColor={Colors.trip.primary}
                                textColor="#fff"
                                style={styles.viewButton}
                                labelStyle={styles.viewButtonLabel}
                            >
                                View Details
                            </Button>
                        </Link> */}
                    </Surface>
                )}
            />

            {/* FAB TO CREATE TEMPLATE */}
            <FAB
                icon="plus"
                style={styles.fab}
                color="#fff"
                onPress={() => router.push("/(user)/menu/templates/create")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        padding: 20,
    },

    /* EMPTY STATE */
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: Colors.trip.background,
    },
    emptyTitle: {
        fontSize: 18,
        color: Colors.trip.text,
        marginBottom: 6,
        fontFamily: "Montserrat-SemiBold",
    },
    emptySubtitle: {
        color: Colors.trip.muted,
        marginBottom: 20,
        fontFamily: "Montserrat-Regular",
    },
    emptyButton: {
        borderRadius: 12,
    },
    emptyButtonLabel: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 16,
    },

    /* LIST VIEW */
    listScreen: {
        flex: 1,
        backgroundColor: Colors.trip.background,
    },
    listContent: {
        padding: 16,
    },

    /* CARD */
    card: {
        padding: 16,
        marginBottom: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        backgroundColor: Colors.trip.surface,
    },
    cardTitle: {
        fontSize: 18,
        marginBottom: 4,
        color: Colors.trip.text,
        fontFamily: "Montserrat-SemiBold",
    },
    cardSub: {
        color: Colors.trip.muted,
        marginBottom: 8,
        fontFamily: "Montserrat-Regular",
    },

    /* VIEW DETAILS BUTTON */
    viewButton: {
        borderRadius: 12,
        marginTop: 12,
    },
    viewButtonLabel: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 15,
    },

    /* FAB BUTTON */
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: Colors.trip.primary,
    },
});
