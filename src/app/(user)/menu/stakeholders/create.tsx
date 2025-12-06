import { useCreateStakeholder } from "@/api/stakeholders";
import { useAuth } from "@/app/providers/AuthProvider";
import Dropdown from "@/components/Dropdown";
import Colors from "@/constants/Colors";
import { StakeholderForm } from "@/constants/Types";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardTypeOptions,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import {
    Button,
    Checkbox,
    HelperText,
    Surface,
    Text,
    TextInput,
} from "react-native-paper";


export default function StakeholderCreateScreen() {
    const { session } = useAuth();
    const uid = session!.user!.id;
    const { mutate, isPending } = useCreateStakeholder(uid);

    const [details, setDetails] = useState<StakeholderForm>({
        stakeholderType: "",
        taxiType: "",
        businessName: "",
        contactPersonName: "",
        designation: "",
        phone: "",
        whatsapp: "",
        alternatePhone: "",
        address: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isWhatsappSame, setIsWhatsappSame] = useState<boolean>(false);

    const stakeholderTypes: string[] = [
        "HOTEL",
        "HOMESTAY",
        "GUEST HOUSE",
        "RESORT",
        "RESTAURANT/CAFÉ",
        "TAXI DRIVER",
        "RENTAL TAXI PROVIDER",
        "LOCAL GUIDE",
        "TREKKING COOK",
        "TREKKING PORTER",
        "TOUR OPERATOR",
        "MEDICAL EMERGENCY SUPPORT",
        "SECURITY EMERGENCY SUPPORT",
    ];

    const taxiTypes: string[] = [
        "SUMO",
        "XYLO",
        "INNOVA",
        "ERTIGA",
        "BOLERO",
        "SCORPIO",
        "WAGONR",
        "SWIFT DZIRE",
        "SWIFT HATCHBACK",
        "ALTO",
        "BALENO",
        "CIAZ",
        "VITARA BREZZA",
        "FORTUNER",
        "CRYSTA",
        "HIACE VAN",
        "TRAVELLER (12-SEATER)",
        "MINI BUS",
        "TWO WHEELER",
        "ELECTRIC VEHICLE (EV)",
        "OTHERS: MENTION",
    ];

    const handleChange = (key: keyof StakeholderForm, value: string) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const validatePhone = (phone: string): boolean =>
        /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));

    const validateForm = (): boolean => {
        const e: Record<string, string> = {};

        if (!details.stakeholderType) e.stakeholderType = "Select stakeholder type";

        if (
            (details.stakeholderType === "TAXI DRIVER" ||
                details.stakeholderType === "RENTAL TAXI PROVIDER") &&
            !details.taxiType
        )
            e.taxiType = "Select taxi type";

        if (!details.businessName.trim()) e.businessName = "Business name required";

        if (!details.contactPersonName.trim())
            e.contactPersonName = "Contact person name required";

        if (!details.designation.trim()) e.designation = "Designation required";

        if (!details.phone) e.phone = "Phone is required";
        else if (!validatePhone(details.phone)) e.phone = "Invalid phone number";

        if (!details.whatsapp) e.whatsapp = "Whatsapp is required";

        if (!details.address.trim()) e.address = "Address is required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const parseSupabaseError = (message: string): string => {
        if (message.includes("duplicate key")) {
            return "A stakeholder with these details already exists.";
        }

        if (message.includes("row-level security")) {
            return "You do not have permission to perform this action.";
        }

        if (message.includes("foreign key")) {
            return "Related data is missing. Please check your inputs.";
        }

        if (message.includes("null value")) {
            return "Some required fields are missing.";
        }

        // Default fallback
        return "Something went wrong. Please try again.";
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        mutate(
            {
                stakeholderType: details.stakeholderType,
                taxiType: details.taxiType || null,
                businessName: details.businessName,
                contactPersonName: details.contactPersonName,
                designation: details.designation,
                phone: details.phone,
                whatsapp: details.whatsapp,
                alternatePhone: details.alternatePhone,
                address: details.address,
            },
            {
                onSuccess: () => {
                    alert("Stakeholder created successfully!");
                    router.replace("/(user)/menu/stakeholders");   // 👈 redirect to index
                },
                onError: (err: Error) => {
                    const friendly = parseSupabaseError(err.message);
                    alert(friendly);
                },
            }
        );
    };

    const renderInput = (
        label: string,
        key: keyof StakeholderForm,
        keyboardType: KeyboardTypeOptions = "default"
    ) => (
        <>
            <TextInput
                mode="outlined"
                label={label}
                value={details[key]}
                onChangeText={(v) => handleChange(key, v)}
                style={styles.input}
                keyboardType={keyboardType}
                outlineColor={errors[key] ? Colors.trip.error : Colors.trip.border}
                activeOutlineColor={
                    errors[key] ? Colors.trip.error : Colors.trip.primary
                }
                theme={inputTheme}
            />
            {errors[key] && <HelperText type="error">{errors[key]}</HelperText>}
        </>
    );

    return (
        <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
        >
            {/** FIX 1: Remove elevation effect */}
            <Surface style={styles.card} elevation={0}>
                <Text style={styles.title}>Create Stakeholder</Text>

                {/** FIX 2: Add zIndex wrapper for dropdown */}
                <View style={{ zIndex: 1000 }}>
                    <Dropdown
                        label="Stakeholder Type"
                        value={details.stakeholderType}
                        list={stakeholderTypes}
                        onSelect={(item) => {
                            handleChange("stakeholderType", item);
                            handleChange("taxiType", "");
                        }}
                        theme={inputTheme}
                        error={errors.stakeholderType}
                    />
                </View>

                {(details.stakeholderType === "TAXI DRIVER" ||
                    details.stakeholderType === "RENTAL TAXI PROVIDER") && (
                        <View style={{ zIndex: 900 }}>
                            <Dropdown
                                label="Taxi Type"
                                value={details.taxiType}
                                list={taxiTypes}
                                onSelect={(item) => handleChange("taxiType", item)}
                                theme={inputTheme}
                                error={errors.taxiType}
                            />
                        </View>
                    )}

                {renderInput("Name of Business", "businessName")}
                {renderInput("Designation", "designation")}
                {renderInput("Contact Person Name", "contactPersonName")}
                {renderInput("Phone", "phone", "phone-pad")}

                <View style={styles.checkboxRow}>
                    <Checkbox
                        status={isWhatsappSame ? "checked" : "unchecked"}
                        onPress={() => {
                            const next = !isWhatsappSame;
                            setIsWhatsappSame(next);
                            handleChange("whatsapp", next ? details.phone : "");
                        }}
                        color={Colors.trip.primary}
                    />
                    <Text style={styles.checkboxText}>WhatsApp same as phone</Text>
                </View>

                {renderInput("WhatsApp", "whatsapp", "phone-pad")}
                {renderInput("Alternate Phone", "alternatePhone", "phone-pad")}
                {renderInput("Address", "address")}

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={isPending}
                    style={styles.button}
                    buttonColor={Colors.trip.primary}
                >
                    {isPending ? "Saving..." : "Save Stakeholder"}
                </Button>
            </Surface>
        </ScrollView>
    );
}

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
        overflow: "visible", // FIX 3: allow dropdown to overflow
    },
    title: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 22,
        color: Colors.trip.primary,
        marginBottom: 16,
    },
    input: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 6,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
    },
    checkboxText: {
        marginLeft: 6,
        fontSize: 14,
        color: Colors.trip.text,
    },
    button: {
        marginTop: 12,
        borderRadius: 12,
    },
});
