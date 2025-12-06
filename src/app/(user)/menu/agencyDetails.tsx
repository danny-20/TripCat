import {
    useGetAgencyDetail,
    useInsertAgencyDetails,
    useUpdateAgencyDetails,
} from "@/api";
import { useAuth } from "@/app/providers/AuthProvider";
import Colors from "@/constants/Colors";
import { AgencyDetailsPayload } from "@/constants/Types";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    Checkbox,
    HelperText,
    Surface,
    Text,
    TextInput,
} from "react-native-paper";

export default function AgencyDetailsScreen() {
    // ---------- AUTH ----------
    const { session } = useAuth();
    const userId = session?.user.id ?? null;

    // ---------- FORM STATES ----------
    const [details, setDetails] = useState<AgencyDetailsPayload>({
        uid: "",
        agencyName: "",
        ownerName: "",
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        website: "",
        registrationNumber: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditable, setIsEditable] = useState(false);
    const [isWhatsappSame, setIsWhatsappSame] = useState(false);

    // ---------- API ----------
    const { data: agency, error, isLoading } = useGetAgencyDetail(userId);
    const insertAgency = useInsertAgencyDetails();
    const updateAgency = useUpdateAgencyDetails();

    // ---------- PREFILL ----------
    useEffect(() => {
        if (!agency) return;

        setDetails({
            uid: agency.uid,
            agencyName: agency.agencyName,
            ownerName: agency.ownerName,
            email: agency.email,
            phone: agency.phone,
            whatsapp: agency.whatsapp,
            address: agency.address,
            city: agency.city,
            state: agency.state,
            country: agency.country,
            postalCode: agency.postalCode,
            website: agency.website || "",
            registrationNumber: agency.registrationNumber || "",
        });

        setIsEditable(false);
    }, [agency]);

    // ---------- LOADING ----------
    if (isLoading) return <ActivityIndicator />;

    if (error) {
        return (
            <View style={{ padding: 20 }}>
                <Text style={{ color: Colors.trip.error }}>
                    Failed to load agency details.
                </Text>
            </View>
        );
    }

    // ---------- HELPERS ----------
    const handleChange = (key: keyof AgencyDetailsPayload, value: string) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const handleWhatsappSync = (checked: boolean) => {
        setIsWhatsappSame(checked);
        setDetails((prev) => ({
            ...prev,
            whatsapp: checked ? prev.phone : "",
        }));
    };

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone: string) =>
        /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));

    // ---------- SUBMIT ----------
    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};

        if (!details.agencyName) newErrors.agencyName = "Agency name is required";
        if (!details.ownerName) newErrors.ownerName = "Owner name is required";
        if (!details.email) newErrors.email = "Email is required";
        else if (!validateEmail(details.email))
            newErrors.email = "Enter a valid email";

        if (!details.phone) newErrors.phone = "Phone number is required";
        else if (!validatePhone(details.phone))
            newErrors.phone = "Enter a valid phone number";

        if (!details.address) newErrors.address = "Address is required";
        if (!details.city) newErrors.city = "City is required";
        if (!details.state) newErrors.state = "State is required";
        if (!details.country) newErrors.country = "Country is required";
        if (!details.postalCode) newErrors.postalCode = "Postal code is required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // INSERT
        if (!agency) {
            insertAgency.mutate(
                { ...details, uid: userId! },
                {
                    onSuccess: () => {
                        alert("Agency details added!");
                        setIsEditable(false);
                    },
                    onError: (err) => alert(err.message),
                }
            );
            return;
        }

        // UPDATE
        updateAgency.mutate(
            {
                id: agency.id,
                payload: {
                    agencyName: details.agencyName,
                    ownerName: details.ownerName,
                    email: details.email,
                    phone: details.phone,
                    whatsapp: details.whatsapp,
                    address: details.address,
                    city: details.city,
                    state: details.state,
                    country: details.country,
                    postalCode: details.postalCode,
                    website: details.website || null,
                    registrationNumber: details.registrationNumber || null,
                },
            },
            {
                onSuccess: () => {
                    alert("Agency details updated!");
                    setIsEditable(false);
                },
                onError: (err) => alert(err.message),
            }
        );
    };

    // ---------- INPUT FIELD ----------
    const renderField = (
        label: string,
        key: keyof AgencyDetailsPayload,
        value: string,
        keyboardType:
            | "default"
            | "email-address"
            | "phone-pad"
            | "numeric" = "default"
    ) => (
        <>
            <TextInput
                mode="outlined"
                label={label}
                value={value}
                onChangeText={(v) => handleChange(key, v)}
                editable={isEditable}
                keyboardType={keyboardType}
                style={styles.input}
                outlineColor={errors[key] ? Colors.trip.error : Colors.trip.border}
                activeOutlineColor={
                    errors[key] ? Colors.trip.error : Colors.trip.primary
                }
                textColor={Colors.trip.text}
                theme={inputTheme}
            />
            {errors[key] && (
                <HelperText type="error">{errors[key]}</HelperText>
            )}
        </>
    );

    // ---------- UI ----------
    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Surface style={styles.card} elevation={0}>
                    <Text style={styles.title}>Agency Details</Text>

                    {renderField("Agency Name", "agencyName", details.agencyName)}
                    {renderField("Owner Name", "ownerName", details.ownerName)}
                    {renderField("Email", "email", details.email, "email-address")}
                    {renderField("Phone", "phone", details.phone, "phone-pad")}

                    <View style={styles.checkboxRow}>
                        <Checkbox
                            status={isWhatsappSame ? "checked" : "unchecked"}
                            onPress={() => handleWhatsappSync(!isWhatsappSame)}
                            color={Colors.trip.primary}
                            disabled={!isEditable}
                        />
                        <Text style={styles.checkboxText}>
                            WhatsApp same as phone
                        </Text>
                    </View>

                    {renderField("WhatsApp", "whatsapp", details.whatsapp, "phone-pad")}
                    {renderField("Address", "address", details.address)}
                    {renderField("City", "city", details.city)}
                    {renderField("State", "state", details.state)}
                    {renderField("Country", "country", details.country)}
                    {renderField(
                        "Postal Code",
                        "postalCode",
                        details.postalCode,
                        "numeric"
                    )}
                    {renderField("Website (optional)", "website", details.website ?? "")}
                    {renderField(
                        "Registration Number (optional)",
                        "registrationNumber",
                        details.registrationNumber ?? ""
                    )}
                </Surface>
            </ScrollView>

            {/* ---------- BOTTOM BUTTON ---------- */}
            <View style={styles.bottomButtonContainer}>
                {!isEditable ? (
                    <Button
                        mode="contained"
                        onPress={() => setIsEditable(true)}
                        buttonColor={Colors.trip.primary}
                        textColor={Colors.trip.surface}
                        style={styles.bottomButton}
                    >
                        Edit Details
                    </Button>
                ) : (
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        buttonColor={Colors.trip.primary}
                        textColor={Colors.trip.surface}
                        style={styles.bottomButton}
                    >
                        Save Details
                    </Button>
                )}
            </View>
        </>
    );
}

//
// ─────────────────────────────────────────────
//   THEME + STYLES
// ─────────────────────────────────────────────
//

const inputTheme = {
    roundness: 12,
    colors: {
        background: Colors.trip.surface,
        placeholder: Colors.trip.muted,
    },
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.trip.background,
        padding: 20,
        paddingBottom: 120, // space for bottom button
    },
    card: {
        backgroundColor: Colors.trip.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.trip.border,
    },
    title: {
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.primary,
        fontSize: 22,
        marginBottom: 10,
    },
    input: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 6,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkboxText: {
        color: Colors.trip.text,
        fontSize: 14,
    },
    bottomButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: Colors.trip.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.trip.border,
    },
    bottomButton: {
        borderRadius: 12,
        paddingVertical: 4,
    },
});
