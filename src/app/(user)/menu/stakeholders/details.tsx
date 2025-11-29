import { useStakeholder } from "@/api/stakeholders";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";

export default function StakeholderDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const stakeholderId = Number(id);

    const { data, isLoading, error } = useStakeholder(stakeholderId);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={styles.center}>
                <Text>Error loading stakeholder</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.card} elevation={3}>
                <Text style={styles.title}>{data.businessName}</Text>

                <Detail label="Stakeholder Type" value={data.stakeholderType} />

                {(data.stakeholderType === "TAXI DRIVER" ||
                    data.stakeholderType === "RENTAL TAXI PROVIDER") && (
                        <Detail label="Taxi Type" value={data.taxiType || "N/A"} />
                    )}

                <Detail label="Contact Person" value={data.contactPersonName} />
                <Detail label="Designation" value={data.designation} />
                <Detail label="Phone" value={data.phone} />
                <Detail label="WhatsApp" value={data.whatsapp || "Not provided"} />
                <Detail
                    label="Alternate Phone"
                    value={data.alternatePhone || "Not provided"}
                />
                <Detail label="Address" value={data.address} />

                <View style={styles.buttonRow}>
                    <Button
                        mode="contained"
                        buttonColor={Colors.trip.primary}
                        textColor="#fff"
                        style={styles.button}
                        onPress={() =>
                            router.push({
                                pathname: "/(user)/menu/stakeholders/edit",
                                params: { id },
                            })
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        mode="contained"
                        buttonColor={Colors.trip.error}
                        textColor="#fff"
                        style={styles.button}
                        onPress={() =>
                            router.push({
                                pathname: "/(user)/menu/stakeholders/delete",
                                params: { id },
                            })
                        }
                    >
                        Delete
                    </Button>
                </View>
            </Surface>
        </ScrollView>
    );
}

/* Small reusable detail line component */
const Detail = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: Colors.trip.background,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        backgroundColor: Colors.trip.surface,
    },
    title: {
        fontSize: 22,
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.primary,
        marginBottom: 20,
    },
    detailRow: {
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 14,
        color: Colors.trip.muted,
        marginBottom: 4,
        fontFamily: "Montserrat-Regular",
    },
    detailValue: {
        fontSize: 16,
        color: Colors.trip.text,
        fontFamily: "Montserrat-SemiBold",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 12,
    },
});
