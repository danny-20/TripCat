import { useGetAgencyDetail } from "@/api";
import Colors from "@/constants/Colors";
import { AgencyDetails } from "@/constants/Types";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    Checkbox,
    HelperText,
    IconButton,
    Surface,
    Text,
    TextInput
} from "react-native-paper";

const AgencyDetailsScreen = () => {
    const [details, setDetails] = useState<AgencyDetails>({
        id: "",
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

    const handleWhatsappSync = (checked: boolean) => {
        setIsWhatsappSame(checked);
        if (checked) {
            setDetails({ ...details, whatsapp: details.phone });
        } else {
            setDetails({ ...details, whatsapp: "" });
        }
    };



    const { data, error, isLoading } = useGetAgencyDetail()
    console.log(data)

    if (isLoading) {
        return <ActivityIndicator />
    }

    if (error) {
        return <Text>Failed to load data</Text>
    }



    // Handle input changes
    const handleChange = (key: keyof AgencyDetails, value: string) => {
        setDetails({ ...details, [key]: value });
        if (errors[key]) setErrors({ ...errors, [key]: "" });
    };

    // Validators
    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone: string) =>
        /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));

    // Submit logic
    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};

        if (!details.agencyName.trim())
            newErrors.agencyName = "Agency name is required";
        if (!details.ownerName.trim())
            newErrors.ownerName = "Owner name is required";
        if (!details.email.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(details.email))
            newErrors.email = "Enter a valid email address";
        if (!details.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!validatePhone(details.phone))
            newErrors.phone = "Enter a valid phone number";
        if (!details.address.trim()) newErrors.address = "Address is required";
        if (!details.city.trim()) newErrors.city = "City is required";
        if (!details.state.trim()) newErrors.state = "State is required";
        if (!details.country.trim()) newErrors.country = "Country is required";
        if (!details.postalCode.trim())
            newErrors.postalCode = "Postal code is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log("✅ Valid form data:", details);
            alert("Form saved successfully!");
            setIsEditable(false);
        }
    };

    // Renders each input field
    const renderField = (
        label: string,
        key: keyof AgencyDetails,
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
                outlineColor={errors[key] ? Colors.trip.error : Colors.trip.border}
                activeOutlineColor={
                    errors[key] ? Colors.trip.error : Colors.trip.primary
                }
                textColor={Colors.trip.text}
                editable={isEditable}
                keyboardType={keyboardType}
                theme={inputTheme}
            />
            {errors[key] && <HelperText type="error">{errors[key]}</HelperText>}
        </>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.card} elevation={3}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Agency Details</Text>

                    {!isEditable && (
                        <IconButton
                            icon="pencil"
                            size={22}
                            onPress={() => setIsEditable(true)}
                            iconColor={Colors.trip.primary}
                        />
                    )}
                </View>

                {/* Inputs */}
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
                    <Text style={styles.checkboxText}>WhatsApp same as phone</Text>
                </View>
                {renderField("WhatsApp", "whatsapp", details.whatsapp, "phone-pad")}
                {renderField("Address", "address", details.address)}
                {renderField("City", "city", details.city)}
                {renderField("State", "state", details.state)}
                {renderField("Country", "country", details.country)}
                {renderField("Postal Code", "postalCode", details.postalCode, "numeric")}
                {renderField("Website (optional)", "website", details.website || "")}
                {renderField(
                    "Registration Number (optional)",
                    "registrationNumber",
                    details.registrationNumber || ""
                )}

                {/* Save button only when editing */}
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
};

// Input theme for consistent rounded fields
const inputTheme = {
    roundness: 12,
    colors: {
        background: Colors.trip.surface,
        placeholder: Colors.trip.muted,
    },
};

// Styles
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

export default AgencyDetailsScreen;
