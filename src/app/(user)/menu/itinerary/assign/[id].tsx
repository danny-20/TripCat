import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import {
    Button,
    Checkbox,
    IconButton,
    Text,
    TextInput,
} from "react-native-paper";

import { createItineraryAssignment, getItineraryById } from "@/api/itineraries";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { generateItineraryPdf } from "@/utils/generateItineraryPdf";
import { normalizeItineraryForPdf } from "@/utils/normalizeItineraryForPdf";


export default function AssignItineraryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    /* ---------------- CUSTOMER ---------------- */
    const [customerName, setCustomerName] = useState("");

    /* ---------------- CONTACT ---------------- */
    const [contactNumber, setContactNumber] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [alternateNumber, setAlternateNumber] = useState("");
    const [sameAsContact, setSameAsContact] = useState(false);

    /* ---------------- DATES ---------------- */
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    /* ---------------- TRAVELLERS ---------------- */
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const totalPersons = adults + children;

    const nights = useMemo(() => {
        if (!startDate || !endDate) return null;
        const diff =
            (endDate.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24);
        return diff > 0 ? diff - 1 : 0;
    }, [startDate, endDate]);

    /* ---------------- VALIDATION ---------------- */
    const isValid =
        customerName.trim().length > 0 &&
        contactNumber.trim().length >= 10 &&
        whatsappNumber.trim().length >= 10 &&
        startDate !== null &&
        endDate !== null &&
        adults > 0;

    /* ---------------- HELPERS ---------------- */
    const formatDate = (date: Date | null) =>
        date ? date.toLocaleDateString("en-IN") : "";

    const toggleSameAsContact = () => {
        const next = !sameAsContact;
        setSameAsContact(next);
        if (next) {
            setWhatsappNumber(contactNumber);
        }
    };

    const onStartDateChange = (
        _: DateTimePickerEvent,
        selected?: Date
    ) => {
        setShowStartPicker(false);
        if (selected) {
            setStartDate(selected);
            if (endDate && selected > endDate) {
                setEndDate(null);
            }
        }
    };

    const onEndDateChange = (
        _: DateTimePickerEvent,
        selected?: Date
    ) => {
        setShowEndPicker(false);
        if (selected) {
            setEndDate(selected);
        }
    };

    /* ---------------- SUBMIT ---------------- */
    const handleAssign = async () => {
        try {
            // 1️⃣ Get logged-in user
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                Alert.alert("Error", "User not authenticated");
                return;
            }

            // 2️⃣ Save assignment to DB
            await createItineraryAssignment({
                itineraryId: Number(id),
                createdBy: user.id,

                customerName,
                contactNumber,
                whatsappNumber,
                alternateNumber,

                startDate: startDate!,
                endDate: endDate!,
                nights: nights!,

                adults,
                children,
                totalPersons,
            });

            // 3️⃣ Fetch full itinerary
            const itinerary = await getItineraryById(id as string);

            // 4️⃣ Normalize itinerary for PDF
            const pdfItinerary =
                normalizeItineraryForPdf(itinerary);

            // 5️⃣ Generate & preview PDF
            await generateItineraryPdf(pdfItinerary, {
                customerName,
                agencyPhone: contactNumber, // or agency number
                startDate: startDate!.toLocaleDateString("en-IN"),
                endDate: endDate!.toLocaleDateString("en-IN"),
                adults,
                children,
            });

            Alert.alert(
                "Success",
                "Itinerary assigned and PDF generated"
            );
        } catch (err: any) {
            Alert.alert(
                "Error",
                err.message || "Something went wrong"
            );
        }
    };


    /* ---------------- UI ---------------- */
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* CUSTOMER */}
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <TextInput
                label="Customer Name *"
                value={customerName}
                onChangeText={setCustomerName}
                mode="outlined"
                style={styles.input}
            />

            {/* CONTACT */}
            <Text style={styles.sectionTitle}>Contact Details</Text>

            <TextInput
                label="Contact Number *"
                value={contactNumber}
                keyboardType="phone-pad"
                onChangeText={(v) => {
                    setContactNumber(v);
                    if (sameAsContact) {
                        setWhatsappNumber(v);
                    }
                }}
                mode="outlined"
                style={styles.input}
            />

            <View style={styles.checkboxRow}>
                <Checkbox
                    status={sameAsContact ? "checked" : "unchecked"}
                    onPress={toggleSameAsContact}
                />
                <Text onPress={toggleSameAsContact}>
                    WhatsApp number same as contact
                </Text>
            </View>

            <TextInput
                label="WhatsApp Number *"
                value={whatsappNumber}
                keyboardType="phone-pad"
                editable={!sameAsContact}
                onChangeText={setWhatsappNumber}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Alternate Contact Number"
                value={alternateNumber}
                keyboardType="phone-pad"
                onChangeText={setAlternateNumber}
                mode="outlined"
                style={styles.input}
            />

            {/* DATES */}
            <Text style={styles.sectionTitle}>Travel Dates</Text>

            <TextInput
                label="Start Date *"
                value={formatDate(startDate)}
                editable={false}
                mode="outlined"
                right={
                    <TextInput.Icon
                        icon="calendar"
                        onPress={() => setShowStartPicker(true)}
                    />
                }
                onPressIn={() => setShowStartPicker(true)}
                style={styles.input}
            />

            <TextInput
                label="End Date *"
                value={formatDate(endDate)}
                editable={false}
                mode="outlined"
                right={
                    <TextInput.Icon
                        icon="calendar"
                        onPress={() => setShowEndPicker(true)}
                    />
                }
                onPressIn={() => setShowEndPicker(true)}
                style={styles.input}
            />

            {showStartPicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    minimumDate={new Date()}
                    onChange={onStartDateChange}
                />
            )}

            {showEndPicker && (
                <DateTimePicker
                    value={endDate || startDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    minimumDate={startDate || new Date()}
                    onChange={onEndDateChange}
                />
            )}

            {nights !== null && (
                <Text style={styles.nights}>
                    Nights: {nights}
                </Text>
            )}

            {/* TRAVELLERS */}
            <Text style={styles.sectionTitle}>Travellers</Text>

            <View style={styles.counterRow}>
                <Text>Adults *</Text>
                <View style={styles.counter}>
                    <IconButton
                        icon="minus"
                        onPress={() =>
                            setAdults(Math.max(1, adults - 1))
                        }
                    />
                    <Text>{adults}</Text>
                    <IconButton
                        icon="plus"
                        onPress={() => setAdults(adults + 1)}
                    />
                </View>
            </View>

            <View style={styles.counterRow}>
                <Text>Children</Text>
                <View style={styles.counter}>
                    <IconButton
                        icon="minus"
                        onPress={() =>
                            setChildren(Math.max(0, children - 1))
                        }
                    />
                    <Text>{children}</Text>
                    <IconButton
                        icon="plus"
                        onPress={() => setChildren(children + 1)}
                    />
                </View>
            </View>

            <Text style={styles.total}>
                Total Persons: {totalPersons}
            </Text>

            <Button
                mode="contained"
                //disabled={!isValid}
                style={styles.button}
                textColor={Colors.trip.surface}
                onPress={handleAssign}
            >
                Assign Itinerary
            </Button>
        </ScrollView>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 14,
        marginBottom: 8,
    },
    input: {
        marginBottom: 12,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    nights: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: "500",
    },
    counterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    counter: {
        flexDirection: "row",
        alignItems: "center",
    },
    total: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: "500",
    },
    button: {
        marginTop: 20,
        backgroundColor: Colors.trip.primary
    },
});
