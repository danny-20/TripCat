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
    IconButton,
    Surface,
    Text,
    TextInput,
} from "react-native-paper";

export default function AgencyDetailsScreen() {
    // ---------- LOCAL FORM STATES ----------
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
    const [isEditable, setIsEditable] = useState(true);
    const [isWhatsappSame, setIsWhatsappSame] = useState(false);

    // ---------- AUTH ----------
    const { session } = useAuth();
    const userId = session?.user.id ?? null;

    // ---------- API ----------
    const { data: agency, error, isLoading } = useGetAgencyDetail(userId);
    const insertAgency = useInsertAgencyDetails();
    const updateAgency = useUpdateAgencyDetails();

    // ---------- PREFILL DATA ONCE ----------
    useEffect(() => {
        if (!agency) return; // No saved details → skip (new user)

        // Only fill form once (initial load)
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

    // ---------- LOADING / ERROR STATES ----------
    if (isLoading) return <ActivityIndicator />;

    if (error) {
        return (
            <View style={{ padding: 20 }}>
                <Text style={{ color: Colors.trip.error }}>
                    Error loading agency details.
                </Text>
            </View>
        );
    }

    // ---------- HANDLERS ----------
    const handleWhatsappSync = (checked: boolean) => {
        setIsWhatsappSame(checked);
        setDetails((prev) => ({
            ...prev,
            whatsapp: checked ? prev.phone : "",
        }));
    };

    const handleChange = (
        key: keyof AgencyDetailsPayload,
        value: string
    ) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone: string) =>
        /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};

        if (!details.agencyName) newErrors.agencyName = "Agency name is required";
        if (!details.ownerName) newErrors.ownerName = "Owner name is required";
        if (!details.email) newErrors.email = "Email is required";
        else if (!validateEmail(details.email))
            newErrors.email = "Enter a valid email";
        if (!details.phone) newErrors.phone = "Phone number is required";
        else if (!validatePhone(details.phone))
            newErrors.phone = "Enter a valid phone";

        if (!details.address) newErrors.address = "Address required";
        if (!details.city) newErrors.city = "City required";
        if (!details.state) newErrors.state = "State required";
        if (!details.country) newErrors.country = "Country required";
        if (!details.postalCode) newErrors.postalCode = "Postal code required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // INSERT
        if (!agency) {
            insertAgency.mutate(
                { ...details, uid: userId! },
                {
                    onSuccess: (created) => {
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

    // ---------- INPUT RENDER ----------
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
                style={styles.input}
                outlineColor={
                    errors[key] ? Colors.trip.error : Colors.trip.border
                }
                activeOutlineColor={
                    errors[key] ? Colors.trip.error : Colors.trip.primary
                }
                textColor={Colors.trip.text}
                editable={isEditable}
                keyboardType={keyboardType}
                theme={inputTheme}
            />
            {errors[key] && (
                <HelperText type="error">{errors[key]}</HelperText>
            )}
        </>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.card} elevation={3}>
                <View style={styles.header}>
                    <Text style={styles.title}>Agency Details</Text>

                    {agency && (
                        <IconButton
                            icon="pencil"
                            size={22}
                            onPress={() => setIsEditable(true)}
                            iconColor={Colors.trip.primary}
                        />
                    )}
                </View>

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
                {renderField("Website (optional)", "website", details.website || "")}
                {renderField(
                    "Registration Number (optional)",
                    "registrationNumber",
                    details.registrationNumber || ""
                )}

                {isEditable && (
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.button}
                        buttonColor={Colors.trip.primary}
                        textColor={Colors.trip.surface}
                        labelStyle={styles.buttonLabel}
                    >
                        Save Details
                    </Button>
                )}
            </Surface>
        </ScrollView>
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
    },
    card: {
        backgroundColor: Colors.trip.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.trip.border,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontFamily: "Montserrat-SemiBold",
        color: Colors.trip.primary,
        fontSize: 22,
    },
    input: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 6,
    },
    button: {
        marginTop: 10,
        borderRadius: 12,
    },
    buttonLabel: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 16,
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
});
