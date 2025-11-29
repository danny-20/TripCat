import { useStakeholder, useUpdateStakeholder } from "@/api/stakeholders";
import Colors from "@/constants/Colors";
import { Stakeholder } from "@/constants/Types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Checkbox, HelperText, Surface, Text, TextInput } from "react-native-paper";

export default function EditStakeholderScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const stakeholderId = Number(id);

    const { data, isLoading } = useStakeholder(stakeholderId);
    const updateStakeholder = useUpdateStakeholder();

    const [details, setDetails] = useState<Stakeholder | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isWhatsappSame, setIsWhatsappSame] = useState(false);
    const [showStakeholderType, setShowStakeholderType] = useState(false);
    const [showTaxiType, setShowTaxiType] = useState(false);

    useEffect(() => {
        if (data) {
            setDetails(data);
            setIsWhatsappSame(data.whatsapp === data.phone);
        }
    }, [data]);

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
        if (!details) return;
        setDetails((prev) => prev ? { ...prev, [key]: value } : prev);
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const handleWhatsappSync = (checked: boolean) => {
        setIsWhatsappSame(checked);
        if (!details) return;
        setDetails((prev) => prev ? { ...prev, whatsapp: checked ? prev.phone : "" } : prev);
    };

    const validatePhone = (phone: string) =>
        /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!details?.stakeholderType?.trim())
            newErrors.stakeholderType = "Please select stakeholder type";

        const isTaxi =
            details?.stakeholderType === "TAXI DRIVER" ||
            details?.stakeholderType === "RENTAL TAXI PROVIDER";

        if (isTaxi && !details?.taxiType?.trim())
            newErrors.taxiType = "Taxi type required";

        if (!details?.businessName.trim())
            newErrors.businessName = "Business name required";

        if (!details?.contactPersonName.trim())
            newErrors.contactPersonName = "Contact person required";

        if (!details?.designation.trim())
            newErrors.designation = "Designation required";

        if (!details?.phone.trim())
            newErrors.phone = "Phone required";
        else if (!validatePhone(details.phone))
            newErrors.phone = "Invalid phone";

        if (!details?.address.trim())
            newErrors.address = "Address required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = () => {
        if (!details) return;
        if (!validate()) return;

        updateStakeholder.mutate(
            {
                id: stakeholderId,
                payload: {
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
            },
            {
                onSuccess: () => {
                    alert("Updated successfully!");
                    router.replace({
                        pathname: "/(user)/menu/stakeholders/details",
                        params: { id },
                    });
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
        onSelect: (v: string) => void;
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

    if (isLoading || !details) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.card} elevation={3}>
                <Text style={styles.title}>Edit Stakeholder</Text>

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

                {/* Taxi Type If Required */}
                {(details.stakeholderType === "TAXI DRIVER" ||
                    details.stakeholderType === "RENTAL TAXI PROVIDER") && (
                        <>
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
                            {errors.taxiType && <HelperText type="error">{errors.taxiType}</HelperText>}
                        </>
                    )}

                {/* Other Fields */}
                {renderField("Business Name", "businessName", details.businessName)}
                {renderField("Contact Person Name", "contactPersonName", details.contactPersonName)}
                {renderField("Designation", "designation", details.designation)}
                {renderField("Phone", "phone", details.phone, "phone-pad")}

                {/* WhatsApp Same */}
                <View style={styles.checkboxRow}>
                    <Checkbox
                        status={isWhatsappSame ? "checked" : "unchecked"}
                        onPress={() => handleWhatsappSync(!isWhatsappSame)}
                        color={Colors.trip.primary}
                    />
                    <Text style={styles.checkboxText}>WhatsApp same as phone</Text>
                </View>

                {renderField("WhatsApp", "whatsapp", details.whatsapp || "", "phone-pad")}
                {renderField("Alternate Phone", "alternatePhone", details.alternatePhone || "", "phone-pad")}
                {renderField("Address", "address", details.address)}

                <Button
                    mode="contained"
                    onPress={handleUpdate}
                    buttonColor={Colors.trip.primary}
                    textColor="#fff"
                    style={styles.button}
                    labelStyle={{
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 16,
                    }}
                >
                    Save Changes
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
        borderWidth: 1,
        borderColor: Colors.trip.border,
        backgroundColor: Colors.trip.surface,
    },
    title: {
        fontSize: 22,
        color: Colors.trip.primary,
        fontFamily: "Montserrat-SemiBold",
        marginBottom: 16,
    },
    input: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 6,
    },
    dropdownContainer: {
        zIndex: 20,
        marginBottom: 6,
    },
    dropdown: {
        backgroundColor: Colors.trip.surface,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.trip.border,
        marginTop: 4,
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.trip.border,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },
    checkboxText: {
        marginLeft: 6,
        color: Colors.trip.text,
    },
    button: {
        marginTop: 16,
        borderRadius: 12,
    },
});
