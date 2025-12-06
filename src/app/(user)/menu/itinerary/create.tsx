import { useAuth } from "@/app/providers/AuthProvider";
import Colors from "@/constants/Colors";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    IconButton,
    Surface,
    Text,
    TextInput,
} from "react-native-paper";


import {
    CreateItineraryPayload,
    ItineraryActivity,
    ItineraryDay
} from "@/constants/Types";

// 🔥 import your API hooks
import {
    useCreateItinerary,
    useGetItineraryTemplate,
} from "@/api/itinerary";

export default function CreateItineraryScreen() {
    const { session } = useAuth();
    const uid = session?.user?.id ?? "";

    // Fetch default template
    const { data: template, isLoading: loadingTemplate } =
        useGetItineraryTemplate();

    // Create itinerary mutation
    const createMutation = useCreateItinerary();

    // ------------------------------
    // FORM STATE
    // ------------------------------
    const [title, setTitle] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");

    const [tripStartDate, setTripStartDate] = useState<string>("");
    const [tripEndDate, setTripEndDate] = useState<string>("");

    const [numAdults, setNumAdults] = useState<string>("1");
    const [numChildren, setNumChildren] = useState<string>("0");

    const [notes, setNotes] = useState<string>("");
    const [inclusions, setInclusions] = useState<string>("");
    const [exclusions, setExclusions] = useState<string>("");
    const [terms, setTerms] = useState<string>("");

    const [days, setDays] = useState<ItineraryDay[]>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    // ------------------------------
    // LOAD TEMPLATE INTO FORM
    // ------------------------------
    useEffect(() => {
        if (!template) return;

        setTitle(template.title ?? "");

        const templateDays: ItineraryDay[] =
            template.default_days?.map((d) => ({
                id: Crypto.randomUUID(),
                dayNumber: Number(d.dayNumber),
                title: d.title ?? "",
                activities: d.activities.map((a) => ({
                    id: Crypto.randomUUID(),
                    time: a.time ?? "",
                    description: a.description ?? "",
                    location: a.location ?? "",
                })),
            })) ?? [];

        setDays(templateDays);
    }, [template]);

    // ------------------------------
    // DAY MANAGEMENT
    // ------------------------------
    const addDay = () => {
        const next = days.length + 1;
        setDays([
            ...days,
            {
                id: Crypto.randomUUID(),
                dayNumber: next,
                title: `Day ${next}`,
                activities: [
                    {
                        id: Crypto.randomUUID(),
                        time: "",
                        description: "",
                        location: "",
                    },
                ],
            },
        ]);
    };

    const removeDay = (index: number) => {
        let newDays = [...days];
        newDays.splice(index, 1);

        // reassign day numbers
        newDays = newDays.map((d, i) => ({
            ...d,
            dayNumber: i + 1,
        }));

        setDays(newDays);
    };

    const updateDay = (index: number, updated: ItineraryDay) => {
        const newDays = [...days];
        newDays[index] = updated;
        setDays(newDays);
    };

    // ------------------------------
    // ACTIVITY MANAGEMENT
    // ------------------------------
    const addActivity = (dayIndex: number) => {
        const newDays = [...days];
        newDays[dayIndex].activities.push({
            id: Crypto.randomUUID(),
            time: "",
            description: "",
            location: "",
        });
        setDays(newDays);
    };

    const removeActivity = (dayIndex: number, actIndex: number) => {
        const newDays = [...days];
        newDays[dayIndex].activities.splice(actIndex, 1);
        setDays(newDays);
    };

    const updateActivity = (
        dayIndex: number,
        actIndex: number,
        updated: Partial<ItineraryActivity>
    ) => {
        const newDays = [...days];
        newDays[dayIndex].activities[actIndex] = {
            ...newDays[dayIndex].activities[actIndex],
            ...updated,
        };
        setDays(newDays);
    };

    // ------------------------------
    // VALIDATION
    // ------------------------------
    const validate = () => {
        const e: Record<string, string> = {};

        if (!title.trim()) e.title = "Itinerary title required";
        if (!customerName.trim()) e.customerName = "Customer name required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ------------------------------
    // SUBMIT
    // ------------------------------
    const handleSave = () => {
        if (!validate()) return;

        const payload: CreateItineraryPayload = {
            created_by: uid,
            updated_by: uid,

            title,
            customer_name: customerName || null,
            trip_start_date: tripStartDate || null,
            trip_end_date: tripEndDate || null,

            num_adults: Number(numAdults) || 0,
            num_children: Number(numChildren) || 0,

            notes: notes || null,
            inclusions: inclusions || null,
            exclusions: exclusions || null,
            terms: terms || null,

            days: days.map((d) => ({
                dayNumber: d.dayNumber,
                title: d.title,
                activities: d.activities.map((a) => ({
                    time: a.time || null,
                    description: a.description,
                    location: a.location || null,
                })),
            })),
        };

        createMutation.mutate(payload, {
            onSuccess: () => {
                Alert.alert("Success", "Itinerary created successfully!");
                router.replace("/(user)/menu/itinerary");
            },
            onError: (err: any) => {
                Alert.alert("Error", err.message || "Error creating itinerary");
            },
        });
    };

    // ------------------------------
    // RENDER
    // ------------------------------

    if (loadingTemplate) {
        return <Text style={{ padding: 20 }}>Loading template…</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.card} elevation={1}>
                <Text style={styles.title}>Create Itinerary</Text>

                {/* ------------------- BASIC INFO ------------------- */}
                <TextInput
                    mode="outlined"
                    label="Itinerary Title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    error={!!errors.title}
                />
                {errors.title && <Text style={styles.error}>{errors.title}</Text>}

                <TextInput
                    mode="outlined"
                    label="Customer Name"
                    value={customerName}
                    onChangeText={setCustomerName}
                    style={styles.input}
                    error={!!errors.customerName}
                />
                {errors.customerName && (
                    <Text style={styles.error}>{errors.customerName}</Text>
                )}

                <View style={styles.row}>
                    <TextInput
                        mode="outlined"
                        label="Start Date (YYYY-MM-DD)"
                        value={tripStartDate}
                        onChangeText={setTripStartDate}
                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                    />
                    <TextInput
                        mode="outlined"
                        label="End Date (YYYY-MM-DD)"
                        value={tripEndDate}
                        onChangeText={setTripEndDate}
                        style={[styles.input, { flex: 1 }]}
                    />
                </View>

                <View style={styles.row}>
                    <TextInput
                        mode="outlined"
                        label="Adults"
                        keyboardType="numeric"
                        value={numAdults}
                        onChangeText={setNumAdults}
                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                    />
                    <TextInput
                        mode="outlined"
                        label="Children"
                        keyboardType="numeric"
                        value={numChildren}
                        onChangeText={setNumChildren}
                        style={[styles.input, { flex: 1 }]}
                    />
                </View>

                {/* ------------------- DAYS ------------------- */}
                <Text style={styles.sectionTitle}>Itinerary Days</Text>

                <Button
                    mode="outlined"
                    onPress={addDay}
                    style={styles.outlineButton}
                    textColor={Colors.trip.primary}
                >
                    + Add Day
                </Button>

                {days.map((day, di) => (
                    <Surface key={day.id} style={styles.dayCard} elevation={0}>
                        <View style={styles.dayHeader}>
                            <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>

                            <View style={{ flexDirection: "row" }}>
                                <IconButton
                                    icon="plus"
                                    onPress={() => addActivity(di)}
                                    size={20}
                                    iconColor={Colors.trip.primary}
                                />
                                <IconButton
                                    icon="delete"
                                    onPress={() => removeDay(di)}
                                    size={20}
                                    iconColor={Colors.trip.primary}
                                />
                            </View>
                        </View>

                        <TextInput
                            mode="outlined"
                            label="Day Title"
                            value={day.title || ""}
                            onChangeText={(v) => updateDay(di, { ...day, title: v })}
                            style={styles.input}
                        />

                        <Text style={styles.subText}>Activities</Text>

                        {day.activities.map((a, ai) => (
                            <Surface key={a.id} style={styles.activityCard} elevation={0}>
                                <TextInput
                                    mode="outlined"
                                    label="Time (optional)"
                                    value={a.time || ""}
                                    onChangeText={(v) => updateActivity(di, ai, { time: v })}
                                    style={styles.smallInput}
                                />

                                <TextInput
                                    mode="outlined"
                                    label="Description"
                                    value={a.description}
                                    onChangeText={(v) =>
                                        updateActivity(di, ai, { description: v })
                                    }
                                    style={styles.input}
                                />

                                <TextInput
                                    mode="outlined"
                                    label="Location (optional)"
                                    value={a.location || ""}
                                    onChangeText={(v) => updateActivity(di, ai, { location: v })}
                                    style={styles.input}
                                />

                                <View style={{ alignItems: "flex-end" }}>
                                    <IconButton
                                        icon="delete"
                                        onPress={() => removeActivity(di, ai)}
                                        size={20}
                                        iconColor={Colors.trip.primary}
                                    />
                                </View>
                            </Surface>
                        ))}
                    </Surface>
                ))}

                {/* ------------------- FOOTER FIELDS ------------------- */}

                <TextInput
                    mode="outlined"
                    label="Inclusions"
                    value={inclusions}
                    onChangeText={setInclusions}
                    style={styles.input}
                    multiline
                />

                <TextInput
                    mode="outlined"
                    label="Exclusions"
                    value={exclusions}
                    onChangeText={setExclusions}
                    style={styles.input}
                    multiline
                />

                <TextInput
                    mode="outlined"
                    label="Terms & Conditions"
                    value={terms}
                    onChangeText={setTerms}
                    style={styles.input}
                    multiline
                />

                <Button
                    mode="contained"
                    onPress={handleSave}
                    disabled={createMutation.isPending}
                    buttonColor={Colors.trip.primary}
                    style={styles.saveButton}
                >
                    {createMutation.isPending ? "Saving..." : "Save Itinerary"}
                </Button>
            </Surface>
        </ScrollView>
    );
}

// ------------------------------
// STYLES
// ------------------------------
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.trip.background,
    },
    card: {
        backgroundColor: Colors.trip.surface,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        marginBottom: 40,
    },
    title: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 22,
        color: Colors.trip.primary,
        marginBottom: 20,
        textAlign: "center",
    },
    sectionTitle: {
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.text,
        marginTop: 20,
    },
    subText: {
        fontSize: 13,
        color: Colors.trip.muted,
        marginTop: 8,
    },
    input: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 12,
    },
    smallInput: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 8,
        width: 140,
    },
    row: {
        flexDirection: "row",
        marginBottom: 10,
    },
    outlineButton: {
        borderRadius: 8,
        marginVertical: 8,
        borderColor: Colors.trip.primary,
    },
    dayCard: {
        marginTop: 14,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        backgroundColor: Colors.trip.surface,
    },
    dayHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dayTitle: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 16,
        color: Colors.trip.primary,
    },
    activityCard: {
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.trip.border,
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 12,
    },
    error: {
        color: Colors.trip.error,
        marginTop: -6,
        marginBottom: 10,
    },
});
