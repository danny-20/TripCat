import { useDeleteStakeholder, useStakeholder } from "@/api/stakeholders";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";

export default function DeleteStakeholderScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const stakeholderId = Number(id);

    const { data, isLoading } = useStakeholder(stakeholderId);
    const deleteStakeholder = useDeleteStakeholder();

    if (isLoading || !data) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const handleDelete = () => {
        deleteStakeholder.mutate(stakeholderId, {
            onSuccess: () => {
                alert("Stakeholder deleted successfully.");
                router.replace("/(user)/menu/stakeholders");
            },
            onError: (err) => alert(err.message),
        });
    };

    return (
        <View style={styles.container}>
            <Surface style={styles.card} elevation={3}>
                <Text style={styles.title}>Delete Stakeholder</Text>

                <Text style={styles.warningText}>
                    Are you sure you want to permanently delete:
                </Text>

                <Text style={styles.name}>{data.businessName}</Text>

                <Text style={styles.subText}>
                    This action cannot be undone.
                </Text>

                <View style={styles.buttonRow}>
                    <Button
                        mode="contained"
                        buttonColor={Colors.trip.error}
                        textColor="#fff"
                        style={styles.deleteButton}
                        labelStyle={{ fontFamily: "Montserrat-SemiBold" }}
                        onPress={handleDelete}
                    >
                        Delete Permanently
                    </Button>

                    <Button
                        mode="outlined"
                        style={styles.cancelButton}
                        textColor={Colors.trip.text}
                        labelStyle={{ fontFamily: "Montserrat-SemiBold" }}
                        onPress={() => router.back()}
                    >
                        Cancel
                    </Button>
                </View>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.trip.background,
        justifyContent: "center",
    },
    card: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        backgroundColor: Colors.trip.surface,
    },
    title: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 22,
        color: Colors.trip.error,
        marginBottom: 12,
    },
    warningText: {
        color: Colors.trip.text,
        fontSize: 16,
        marginBottom: 8,
        fontFamily: "Montserrat-Regular",
    },
    name: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        color: Colors.trip.primary,
        marginBottom: 12,
    },
    subText: {
        color: Colors.trip.muted,
        marginBottom: 24,
        fontFamily: "Montserrat-Regular",
    },
    buttonRow: {
        marginTop: 10,
    },
    deleteButton: {
        marginBottom: 12,
        borderRadius: 12,
    },
    cancelButton: {
        borderRadius: 12,
        borderColor: Colors.trip.border,
    },
});
