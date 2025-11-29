import { useStakeholders } from "@/api/stakeholders";
import { useAuth } from "@/app/providers/AuthProvider";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";

export default function StakeholderListScreen() {
    const { session } = useAuth();
    const userId = session?.user.id ?? null;

    const { data, isLoading, error } = useStakeholders(userId);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ padding: 20 }}>
                <Text>Error loading stakeholders</Text>
            </View>
        );
    }

    /* ====================================
       EMPTY STATE
    ==================================== */
    if (!data || data.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        color: Colors.trip.text,
                        marginBottom: 16,
                        fontFamily: "Montserrat-SemiBold",
                    }}
                >
                    No stakeholders found
                </Text>

                <Link href="/(user)/menu/stakeholders/create" asChild>
                    <Button
                        mode="contained"
                        buttonColor={Colors.trip.primary}
                        textColor="#fff"
                        style={{ borderRadius: 12 }}
                        labelStyle={{
                            fontFamily: "Montserrat-SemiBold",
                            fontSize: 16,
                        }}
                    >
                        Add First Stakeholder
                    </Button>
                </Link>
            </View>
        );
    }

    /* ====================================
       LIST VIEW
    ==================================== */
    return (
        <FlatList
            contentContainerStyle={{ padding: 16 }}
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <Surface
                    style={{
                        padding: 16,
                        marginBottom: 14,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: Colors.trip.border,
                        backgroundColor: Colors.trip.surface,
                    }}
                    elevation={2}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            marginBottom: 4,
                            color: Colors.trip.text,
                            fontFamily: "Montserrat-SemiBold",
                        }}
                    >
                        {item.businessName}
                    </Text>

                    <Text
                        style={{
                            color: Colors.trip.muted,
                            marginBottom: 12,
                            fontFamily: "Montserrat-Regular",
                        }}
                    >
                        {item.contactPersonName} • {item.stakeholderType}
                    </Text>

                    <Link
                        href={{
                            pathname: "/(user)/menu/stakeholders/details",
                            params: { id: item.id },
                        }}
                        asChild
                    >
                        <Button
                            mode="contained"
                            buttonColor={Colors.trip.primary}
                            textColor="#fff"
                            style={{ borderRadius: 12 }}
                            labelStyle={{
                                fontFamily: "Montserrat-SemiBold",
                                fontSize: 15,
                            }}
                        >
                            View Details
                        </Button>
                    </Link>
                </Surface>
            )}
        />
    );
}
