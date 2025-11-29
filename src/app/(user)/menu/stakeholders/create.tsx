import { useCreateStakeholder } from "@/api/stakeholders";
import { useAuth } from "@/app/providers/AuthProvider";
import Colors from "@/constants/Colors";
import { Stakeholder } from "@/constants/Types";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, HelperText, Surface, Text, TextInput } from "react-native-paper";

export default function CreateStakeholderScreen() {
    const { session } = useAuth();
    const userId = session?.user.id ?? "";

    const createStakeholder = useCreateStakeholder();

    const [details, setDetails] = useState<Stakeholder>({
        stakeholderType: "",
        taxiType: "",
        businessName: "",
        contactPersonName: "",
        designation: "",
        phone: "",
        whatsapp: "",
        alternatePhone: "",
        address: "",
        uid: userId,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isWhatsappSame, setIsWhatsappSame] = useState(false);
    const [showStakeholderType, setShowStakeholderType] = useState(false);
    const [showTaxiType, setShowTaxiType] = useState(false);

    const stakeholderTypes = [
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

    const taxiTypes = [
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

    const handleChange = (key: keyof Stakeholder, value: string) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const handleWhatsappSync = (checked: boolean) => {
        setIsWhatsappSame(checked);
        setDetails((prev) => ({
            ...prev,
            whatsapp: checked ? prev.phone : "",
        }));
    };

    const validatePhone = (phone: string) =>
        /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!details.stakeholderType.trim()) newErrors.stakeholderType = "Please select stakeholder type";

        const isTaxi =
            details.stakeholderType === "TAXI DRIVER" ||
            details.stakeholderType === "RENTAL TAXI PROVIDER";

        if (isTaxi && !details.taxiType?.trim()) newErrors.taxiType = "Please select taxi type";

        if (!details.businessName.trim()) newErrors.businessName = "Business name is required";
        if (!details.contactPersonName.trim()) newErrors.contactPersonName = "Contact person name is required";
        if (!details.designation.trim()) newErrors.designation = "Designation is required";
        if (!details.phone.trim()) newErrors.phone = "Phone is required";
        else if (!validatePhone(details.phone)) newErrors.phone = "Enter valid phone number";
        if (!details.address.trim()) newErrors.address = "Address is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        createStakeholder.mutate(
            {
                uid: userId,
                stakeholderType: details.stakeholderType,
                taxiType: details.taxiType || null,
                businessName: details.businessName,
                contactPersonName: details.contactPersonName,
                designation: details.designation,
                phone: details.phone,
                whatsapp: details.whatsapp || null,
                alternatePhone: details.alternatePhone || null,
                address: details.address,
            },
            {
                onSuccess: () => {
                    alert("Stakeholder added successfully!");
                    router.replace("/(user)/menu/stakeholders");
                },
                onError: (err) => alert(err.message),
            }
        );
    };

    const Dropdown = ({
        items,
        onSelect,
        onClose,
    }: {
        items: string[];
        onSelect: (value: string) => void;
        onClose: () => void;
    }) => (
        <Surface style={styles.dropdown} elevation={3}>
            <ScrollView style={{ maxHeight: 250 }}>
                {items.map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => {
                            onSelect(item);
                            onClose();
                        }}
                        style={styles.dropdownItem}
                    >
                        <Text>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Surface>
    );

    const renderField = (
        label: string,
        key: keyof Stakeholder,
        value: string,
        keyboardType: any = "default"
    ) => (
        <>
            <TextInput
                mode="outlined"
                label={label}
                value={value}
                onChangeText={(v) => handleChange(key, v)}
                keyboardType={keyboardType}
                textColor={Colors.trip.text}
                style={styles.input}
                outlineColor={errors[key] ? Colors.trip.error : Colors.trip.border}
                activeOutlineColor={errors[key] ? Colors.trip.error : Colors.trip.primary}
                theme={inputTheme}
            />
            {errors[key] && <HelperText type="error">{errors[key]}</HelperText>}
        </>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.card} elevation={3}>
                <Text style={styles.title}>Add Stakeholder</Text>

                {/* Stakeholder Type */}
                <View style={styles.dropdownContainer}>
                    <TextInput
                        mode="outlined"
                        label="Stakeholder Type"
                        value={details.stakeholderType}
                        editable={false}
                        textColor={Colors.trip.text}
                        right={
                            <TextInput.Icon
                                icon={showStakeholderType ? "chevron-up" : "chevron-down"}
                                onPress={() => setShowStakeholderType((s) => !s)}
                            />
                        }
                        style={styles.input}
                        theme={inputTheme}
                    />

                    {showStakeholderType && (
                        <Dropdown
                            items={stakeholderTypes}
                            onSelect={(item) => {
                                handleChange("stakeholderType", item);
                                handleChange("taxiType", "");
                            }}
                            onClose={() => setShowStakeholderType(false)}
                        />
                    )}
                </View>

                {errors.stakeholderType && <HelperText type="error">{errors.stakeholderType}</HelperText>}

                {/* Taxi Type Conditional */}
                {(details.stakeholderType === "TAXI DRIVER" ||
                    details.stakeholderType === "RENTAL TAXI PROVIDER") && (
                        <View style={styles.dropdownContainer}>
                            <TextInput
                                mode="outlined"
                                label="Taxi Type"
                                value={details.taxiType ?? ""}
                                editable={false}
                                textColor={Colors.trip.text}
                                right={
                                    <TextInput.Icon
                                        icon={showTaxiType ? "chevron-up" : "chevron-down"}
                                        onPress={() => setShowTaxiType((s) => !s)}
                                    />
                                }
                                style={styles.input}
                                theme={inputTheme}
                            />

                            {showTaxiType && (
                                <Dropdown
                                    items={taxiTypes}
                                    onSelect={(item) => handleChange("taxiType", item)}
                                    onClose={() => setShowTaxiType(false)}
                                />
                            )}
                        </View>
                    )}

                {errors.taxiType && <HelperText type="error">{errors.taxiType}</HelperText>}

                {/* Text Fields */}
                {renderField("Business Name", "businessName", details.businessName)}
                {renderField("Contact Person Name", "contactPersonName", details.contactPersonName)}
                {renderField("Designation", "designation", details.designation)}
                {renderField("Phone", "phone", details.phone, "phone-pad")}

                {/* WhatsApp Same as Phone */}
                <View style={styles.checkboxRow}>
                    <Checkbox
                        status={isWhatsappSame ? "checked" : "unchecked"}
                        onPress={() => handleWhatsappSync(!isWhatsappSame)}
                        color={Colors.trip.primary}
                    />
                    <Text style={styles.checkboxText}>WhatsApp same as phone</Text>
                </View>

                {renderField("WhatsApp", "whatsapp", details.whatsapp, "phone-pad")}
                {renderField("Alternate Phone", "alternatePhone", details.alternatePhone, "phone-pad")}
                {renderField("Address", "address", details.address)}

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    buttonColor={Colors.trip.primary}
                    textColor="#fff"
                    style={styles.button}
                    labelStyle={{ fontFamily: "Montserrat-SemiBold" }}
                >
                    Save Stakeholder
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
        padding: 20,
        borderRadius: 16,
        backgroundColor: Colors.trip.surface,
        borderWidth: 1,
        borderColor: Colors.trip.border,
    },
    title: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 22,
        color: Colors.trip.primary,
        marginBottom: 20,
    },
    input: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 6,
    },
    dropdownContainer: {
        zIndex: 10,
        marginBottom: 6,
    },
    dropdown: {
        backgroundColor: Colors.trip.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        marginTop: 4,
        maxHeight: 250,
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.trip.border,
    },
    button: {
        marginTop: 16,
        borderRadius: 12,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    checkboxText: {
        marginLeft: 8,
        color: Colors.trip.text,
    },
});
