import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";

import { createItinerary } from "@/api/itineraries";
import { getLocations } from "@/api/locations";
import { useAuth } from "@/app/providers/AuthProvider";
import AdminDropdown from "@/components/AdminDropdown";
import DropdownChecklist from "@/components/DropdownChecklist";
import { LocationOption } from "@/constants/locations";


// -------------------------
// TYPES
// -------------------------
type DayForm = {
    from: string;
    to: string;
    travel_time: string;
    highlights: string;
    overnight_stay: string;
    description: string[];
};

export default function CreateItinerary() {
    const router = useRouter();
    const { session } = useAuth();

    // HEADER
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [overview, setOverview] = useState("");
    const [days, setDays] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    // VALIDATION ERRORS
    const [errors, setErrors] = useState<any>({});

    // LOCATIONS (FROM / TO / OVERNIGHT STAY)
    const [locations, setLocations] = useState<LocationOption[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(true);

    // DAY BLOCK DATA
    const [dayData, setDayData] = useState<DayForm[]>([
        {
            from: "",
            to: "",
            travel_time: "",
            highlights: "",
            overnight_stay: "",
            description: [],
        },
    ]);

    // DESCRIPTION OPTIONS
    const descriptionOptions = [
        "Arrival",
        "City Tour",
        "Rest Day",
        "Sight Seeing",
        "Day Trip",
        "Departure",
        "Others",
    ];

    // -------------------------
    // LOAD LOCATIONS
    // -------------------------
    useEffect(() => {
        async function load() {
            try {
                const list = await getLocations();
                const formatted = (list || []).map((loc) => ({
                    id: loc.value,
                    label: loc.label,
                    value: loc.label, // VALUE = LABEL (IMPORTANT)
                }));
                setLocations(formatted);
            } catch (err) {
                console.log("Location load error:", err);
            } finally {
                setLoadingLocations(false);
            }
        }
        load();
    }, []);

    const dropdownItems = locations.map((loc) => ({
        id: loc.id,
        label: loc.label,
        value: loc.label, // use NAME not ID
    }));

    // -------------------------
    // VALIDATION LOGIC
    // -------------------------
    const validateForm = () => {
        let newErrors: any = {};

        // HEADER VALIDATION
        if (!title.trim()) newErrors.title = "Title is required";
        if (days < 1) newErrors.days = "Days must be at least 1";

        // DAY VALIDATION
        dayData.forEach((d, i) => {
            const p = `day_${i}`;

            if (!d.from) newErrors[`${p}_from`] = "Please select a valid From location";
            if (!d.to) newErrors[`${p}_to`] = "Please select a valid To location";

            if (!d.travel_time.trim())
                newErrors[`${p}_travel_time`] = "Travel time is required";
            else if (isNaN(Number(d.travel_time)))
                newErrors[`${p}_travel_time`] = "Travel time must be numeric";

            if (!d.overnight_stay)
                newErrors[`${p}_overnight_stay`] = "Please select Overnight Stay";

            if (!d.description.length)
                newErrors[`${p}_description`] = "Select at least one description";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // -------------------------
    // UPDATE DAY FIELD
    // -------------------------
    const updateDayField = (index: number, field: keyof DayForm, value: any) => {
        setDayData((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    // -------------------------
    // ADD / REMOVE DAYS
    // -------------------------
    const incrementDays = () => {
        setDays((prev) => {
            const next = prev + 1;
            setDayData((old) => [
                ...old,
                {
                    from: "",
                    to: "",
                    travel_time: "",
                    highlights: "",
                    overnight_stay: "",
                    description: [],
                },
            ]);
            return next;
        });
    };

    const decrementDays = () => {
        if (days <= 1) return;
        setDays((prev) => prev - 1);
        setDayData((old) => old.slice(0, -1));
    };

    // -------------------------
    // SAVE ITINERARY + DAYS
    // -------------------------
    const handleSave = async () => {
        if (!validateForm()) return;
        if (!session?.user?.id) {
            Alert.alert("Error", "User not authenticated");
            return;
        }
        setLoading(true);
        // 1) MAIN ITINERARY INSERT
        const itineraryPayload = {
            title,
            subtitle,
            overview,
            days,
            created_by: session!.user!.id,
        };



        // 2) DAY INSERTS
        const dayRows = dayData.map((d, idx) => ({
            itinerary_id: 0, // placeholder, API will replace with real ID
            day_number: idx + 1,
            from_location: d.from,
            to_location: d.to,
            travel_time_hours: Number(d.travel_time),
            highlights: d.highlights,
            overnight_stay: d.overnight_stay,
            description: d.description,
            created_by: session?.user?.id!,
        }));

        const { data, error } = await createItinerary(itineraryPayload, dayRows);
        setLoading(false);

        if (error) {
            Alert.alert("Error", "Something went wrong while saving.");
            return;
        }

        Alert.alert("Success", "Itinerary created successfully!", [
            {
                text: "OK",
                onPress: () => router.push("/(admin)/menu/itineraries"),
            },
        ]);

        router.push("/(admin)/menu/itineraries");
    };

    // -------------------------
    // UI
    // -------------------------
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.heading}>Create Itinerary</Text>

                    {/* TITLE */}
                    <TextInput
                        label="Tour Title"
                        mode="outlined"
                        value={title}
                        onChangeText={setTitle}
                        error={!!errors.title}
                        style={styles.input}
                    />
                    {errors.title && <Text style={styles.error}>{errors.title}</Text>}

                    {/* SUBTITLE */}
                    <TextInput
                        label="Subtitle"
                        mode="outlined"
                        value={subtitle}
                        onChangeText={setSubtitle}
                        style={styles.input}
                    />

                    {/* OVERVIEW */}
                    <TextInput
                        label="Overview Description"
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        value={overview}
                        onChangeText={setOverview}
                        style={styles.input}
                    />

                    {/* DAYS */}
                    <View style={styles.daysRow}>
                        <Text style={styles.label}>Days</Text>

                        <View style={styles.counter}>
                            <IconButton icon="minus" onPress={decrementDays} />
                            <Text style={styles.dayValue}>{days}</Text>
                            <IconButton icon="plus" onPress={incrementDays} />
                        </View>
                    </View>
                    {errors.days && <Text style={styles.error}>{errors.days}</Text>}

                    {/* DAY BLOCKS */}
                    {dayData.map((item, index) => (
                        <View key={index} style={styles.dayBlock}>
                            <Text style={styles.dayTitle}>Day {index + 1}</Text>

                            {/* FROM */}
                            <AdminDropdown
                                label="From"
                                items={dropdownItems}
                                value={item.from}
                                disabled={loadingLocations}
                                onSelect={(val, label) => updateDayField(index, "from", label)}
                            />
                            {errors[`day_${index}_from`] && (
                                <Text style={styles.error}>{errors[`day_${index}_from`]}</Text>
                            )}

                            {/* TO */}
                            <View style={{ marginTop: 12 }}>
                                <AdminDropdown
                                    label="To"
                                    items={dropdownItems}
                                    value={item.to}
                                    disabled={loadingLocations}
                                    onSelect={(val, label) => updateDayField(index, "to", label)}
                                />
                                {errors[`day_${index}_to`] && (
                                    <Text style={styles.error}>{errors[`day_${index}_to`]}</Text>
                                )}
                            </View>

                            {/* TRAVEL TIME */}
                            <TextInput
                                label="Travel Time (hours)"
                                mode="outlined"
                                keyboardType="numeric"
                                value={item.travel_time}
                                onChangeText={(t) =>
                                    updateDayField(index, "travel_time", t.replace(/[^0-9]/g, ""))
                                }
                                error={!!errors[`day_${index}_travel_time`]}
                                style={styles.input}
                            />
                            {errors[`day_${index}_travel_time`] && (
                                <Text style={styles.error}>
                                    {errors[`day_${index}_travel_time`]}
                                </Text>
                            )}

                            {/* HIGHLIGHTS */}
                            <TextInput
                                label="Highlights"
                                mode="outlined"
                                multiline
                                numberOfLines={5}
                                value={item.highlights}
                                onChangeText={(t) => updateDayField(index, "highlights", t)}
                                style={[styles.input, { minHeight: 120, textAlignVertical: "top" }]}
                            />

                            {/* OVERNIGHT STAY */}
                            <View style={{ marginTop: 12 }}>
                                <AdminDropdown
                                    label="Overnight Stay"
                                    items={dropdownItems}
                                    value={item.overnight_stay}
                                    disabled={loadingLocations}
                                    onSelect={(val, label) =>
                                        updateDayField(index, "overnight_stay", label)
                                    }
                                />

                                {errors[`day_${index}_overnight_stay`] && (
                                    <Text style={styles.error}>
                                        {errors[`day_${index}_overnight_stay`]}
                                    </Text>
                                )}
                            </View>

                            {/* DESCRIPTION */}
                            <View style={{ marginTop: 12 }}>
                                <DropdownChecklist
                                    label="Description"
                                    options={descriptionOptions}
                                    selected={item.description}
                                    onChange={(vals: string[]) =>
                                        updateDayField(index, "description", vals)
                                    }
                                />
                                {errors[`day_${index}_description`] && (
                                    <Text style={styles.error}>
                                        {errors[`day_${index}_description`]}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))}

                    {/* SAVE BUTTON */}
                    <Button mode="contained" style={styles.saveBtn} onPress={handleSave}>
                        Save Itinerary
                    </Button>
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
    card: {
        borderRadius: 16,
        paddingVertical: 8,
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
    daysRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    counter: {
        flexDirection: "row",
        alignItems: "center",
    },
    dayValue: {
        fontSize: 18,
        width: 40,
        textAlign: "center",
    },
    dayBlock: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 16,
    },
    dayTitle: {
        fontSize: 18,
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.primary,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontFamily: "Montserrat-Medium",
        color: Colors.trip.primary,
    },
    saveBtn: {
        marginTop: 20,
        backgroundColor: Colors.trip.primary,
    },
    error: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
});
