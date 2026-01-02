import Colors from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    Card,
    Text,
    TextInput,
} from "react-native-paper";

import { getItineraryForEdit, updateItinerary } from "@/api/itineraries";
import { getLocations } from "@/api/locations";
import { useAuth } from "@/app/providers/AuthProvider";
import AdminDropdown from "@/components/AdminDropdown";
import DropdownChecklist from "@/components/DropdownChecklist";
import { DayForm } from "@/constants/itinerary";
import { LocationOption } from "@/constants/locations";

export default function EditItinerary() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { session } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Header
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [overview, setOverview] = useState("");
    const [days, setDays] = useState(1);

    // Data
    const [dayData, setDayData] = useState<DayForm[]>([]);
    const [locations, setLocations] = useState<LocationOption[]>([]);

    const descriptionOptions = [
        "Arrival",
        "City Tour",
        "Rest Day",
        "Sight Seeing",
        "Day Trip",
        "Departure",
        "Others",
    ];

    /* ---------------- LOAD DATA ---------------- */

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);

            try {
                // Locations
                const locs = await getLocations();
                setLocations(
                    (locs || []).map((l) => ({
                        id: l.value,
                        label: l.label,
                        value: l.label,
                    }))
                );

                // Itinerary
                const { data, error } = await getItineraryForEdit(Number(id));
                if (error || !data) {
                    Alert.alert("Error", "Failed to load itinerary");
                    return;
                }

                setTitle(data.itinerary.title);
                setSubtitle(data.itinerary.subtitle || "");
                setOverview(data.itinerary.overview || "");
                setDays(data.itinerary.days);

                setDayData(
                    data.days.map((d) => {
                        let parsedDescription: string[] = [];

                        if (Array.isArray(d.description)) {
                            parsedDescription = d.description;
                        } else if (typeof d.description === "string") {
                            try {
                                parsedDescription = JSON.parse(d.description);
                            } catch {
                                parsedDescription = d.description
                                    .replace(/[{}]/g, "")
                                    .split(",")
                                    .map((v: string) => v.trim())
                                    .filter(Boolean);
                            }
                        }

                        return {
                            id: d.id!,
                            from: d.from_location,
                            to: d.to_location,
                            travel_time: String(d.travel_time_hours),
                            highlights: d.highlights || "",
                            overnight_stay: d.overnight_stay,
                            description: parsedDescription,
                        };
                    })
                );

            } catch (e) {
                console.log(e);
                Alert.alert("Error", "Unexpected error");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    /* ---------------- UPDATE FIELD ---------------- */

    const updateDayField = (
        index: number,
        field: keyof DayForm,
        value: any
    ) => {
        setDayData((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    /* ---------------- SAVE ---------------- */

    const handleUpdate = async () => {
        if (!session?.user?.id) {
            Alert.alert("Error", "User not authenticated");
            return;
        }

        setSaving(true);

        const itineraryPayload = {
            title,
            subtitle,
            overview,
            days,
        };

        const dayPayload = dayData.map((d) => ({
            id: d.id,
            from_location: d.from,
            to_location: d.to,
            travel_time_hours: Number(d.travel_time),
            highlights: d.highlights,
            overnight_stay: d.overnight_stay,
            description: d.description, // SAVE EXACTLY WHAT USER SEES
        }));

        const { error } = await updateItinerary(
            Number(id),
            itineraryPayload,
            dayPayload
        );

        setSaving(false);

        if (error) {
            Alert.alert("Error", "Failed to update itinerary");
            return;
        }

        Alert.alert("Success", "Itinerary updated successfully", [
            { text: "OK", onPress: () => router.back() },
        ]);
    };

    /* ---------------- UI ---------------- */

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator
                    size="large"
                    color={Colors.trip.primary}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.heading}>Edit Itinerary</Text>

                    <TextInput
                        label="Title"
                        value={title}
                        onChangeText={setTitle}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Subtitle"
                        value={subtitle}
                        onChangeText={setSubtitle}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Overview"
                        value={overview}
                        onChangeText={setOverview}
                        multiline
                        numberOfLines={3}
                        mode="outlined"
                        style={styles.input}
                    />

                    {dayData.map((item, index) => (
                        <View key={item.id} style={styles.dayBlock}>
                            <Text style={styles.dayTitle}>
                                Day {index + 1}
                            </Text>

                            <AdminDropdown
                                label="From"
                                items={locations}
                                value={item.from}
                                onSelect={(_, label) =>
                                    updateDayField(index, "from", label)
                                }
                            />

                            <View style={{ marginTop: 12 }}>
                                <AdminDropdown
                                    label="To"
                                    items={locations}
                                    value={item.to}
                                    onSelect={(_, label) =>
                                        updateDayField(index, "to", label)
                                    }
                                />
                            </View>

                            <TextInput
                                label="Travel Time (hrs)"
                                value={item.travel_time}
                                keyboardType="numeric"
                                onChangeText={(t) =>
                                    updateDayField(
                                        index,
                                        "travel_time",
                                        t.replace(/[^0-9]/g, "")
                                    )
                                }
                                mode="outlined"
                                style={styles.input}
                            />

                            <TextInput
                                label="Highlights"
                                multiline
                                numberOfLines={4}
                                value={item.highlights}
                                onChangeText={(t) =>
                                    updateDayField(index, "highlights", t)
                                }
                                mode="outlined"
                                style={[styles.input, { minHeight: 100 }]}
                            />

                            <View style={{ marginTop: 12 }}>
                                <AdminDropdown
                                    label="Overnight Stay"
                                    items={locations}
                                    value={item.overnight_stay}
                                    onSelect={(_, label) =>
                                        updateDayField(
                                            index,
                                            "overnight_stay",
                                            label
                                        )
                                    }
                                />
                            </View>

                            <View style={{ marginTop: 12 }}>
                                <DropdownChecklist
                                    label="Description"
                                    options={descriptionOptions}
                                    selected={item.description}
                                    onChange={(vals: string[]) =>
                                        updateDayField(
                                            index,
                                            "description",
                                            vals
                                        )
                                    }
                                />
                            </View>
                        </View>
                    ))}

                    {saving ? (
                        <ActivityIndicator
                            size="large"
                            color={Colors.trip.primary}
                            style={{ marginTop: 20 }}
                        />
                    ) : (
                        <Button
                            mode="contained"
                            style={styles.saveBtn}
                            onPress={handleUpdate}
                        >
                            Update Itinerary
                        </Button>
                    )}
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.trip.background,
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        borderRadius: 16,
    },
    heading: {
        fontSize: 22,
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.primary,
        marginBottom: 16,
    },
    input: {
        marginTop: 12,
        backgroundColor: Colors.trip.surface,
    },
    dayBlock: {
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingTop: 16,
    },
    dayTitle: {
        fontSize: 18,
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.primary,
        marginBottom: 10,
    },
    saveBtn: {
        marginTop: 24,
        backgroundColor: Colors.trip.primary,
    },
});
