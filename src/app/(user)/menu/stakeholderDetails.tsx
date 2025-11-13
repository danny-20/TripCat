import Colors from "@/constants/Colors";
import { StakeholderDetails } from "@/constants/Types";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {
    Button,
    Checkbox,
    HelperText,
    IconButton,
    Surface,
    Text,
    TextInput,
} from "react-native-paper";

const StakeholderDetailsScreen = () => {
    const [details, setDetails] = useState<StakeholderDetails>({
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
    const [isEditable, setIsEditable] = useState(true);
    const [isWhatsappSame, setIsWhatsappSame] = useState(false);

    // replace Menu with simple inline dropdown visibility flags
    const [showStakeholderDropdown, setShowStakeholderDropdown] =
        useState<boolean>(false);
    const [showTaxiDropdown, setShowTaxiDropdown] = useState<boolean>(false);

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

    // handle input change safely
    const handleChange = (key: keyof StakeholderDetails, value: string) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const handleWhatsappSync = (checked: boolean) => {
        setIsWhatsappSame(checked);
        setDetails((prev) => ({ ...prev, whatsapp: checked ? prev.phone : "" }));
    };

    const validatePhone = (phone: string) =>
        /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};

        if (!details.stakeholderType.trim())
            newErrors.stakeholderType = "Please select stakeholder type";
        if (
            (details.stakeholderType === "TAXI DRIVER" ||
                details.stakeholderType === "RENTAL TAXI PROVIDER") &&
            !details.taxiType?.trim()
        )
            newErrors.taxiType = "Please select taxi type";
        if (!details.businessName.trim())
            newErrors.businessName = "Business name is required";
        if (!details.contactPersonName.trim())
            newErrors.contactPersonName = "Contact person name is required";
        if (!details.designation.trim())
            newErrors.designation = "Designation is required";
        if (!details.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!validatePhone(details.phone))
            newErrors.phone = "Enter a valid phone number";
        if (!details.address.trim()) newErrors.address = "Address is required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            console.log("✅ Stakeholder Saved:", details);
            alert("Stakeholder details saved successfully!");
            setIsEditable(false);
        }
    };

    // render a single dropdown list (Surface) below the TextInput
    const DropdownList = ({
        data,
        onSelect,
        onClose,
        style,
    }: {
        data: string[];
        onSelect: (item: string) => void;
        onClose: () => void;
        style?: object;
    }) => {
        // use FlatList for performance (many taxi types)
        return (
            <Surface style={[styles.dropdownSurface, style]} elevation={3}>
                <ScrollView
                    nestedScrollEnabled
                    style={{ maxHeight: 260 }}
                    showsVerticalScrollIndicator={true}
                >
                    {data.map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => {
                                onSelect(item);
                                onClose();
                            }}
                            style={styles.dropdownItem}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.dropdownItemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Surface>
        );
    };

    const renderField = (
        label: string,
        key: keyof StakeholderDetails,
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
                style={styles.input}
                outlineColor={errors[key] ? Colors.trip.error : Colors.trip.border}
                activeOutlineColor={
                    errors[key] ? Colors.trip.error : Colors.trip.primary
                }
                textColor={Colors.trip.text}
                keyboardType={keyboardType}
                theme={inputTheme}
            />
            {errors[key] && <HelperText type="error">{errors[key]}</HelperText>}
        </>
    );

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
        >
            <Surface style={styles.card} elevation={3}>
                <View style={styles.header}>
                    <Text style={styles.title}>Stakeholder Details</Text>
                    {!isEditable && (
                        <IconButton
                            icon="pencil"
                            size={22}
                            onPress={() => setIsEditable(true)}
                            iconColor={Colors.trip.primary}
                        />
                    )}
                </View>

                {/* Stakeholder Type input (looks like TextInput, triggers inline dropdown) */}
                <View style={styles.inputWithDropdown}>
                    <TextInput
                        mode="outlined"
                        label="Stakeholder Type"
                        value={details.stakeholderType}
                        editable={false}
                        right={
                            <TextInput.Icon
                                icon={showStakeholderDropdown ? "chevron-up" : "menu-down"}
                                onPress={() => {
                                    if (!isEditable) return;
                                    // toggle dropdown visibility
                                    setShowStakeholderDropdown((s) => !s);
                                    // ensure taxi dropdown closed
                                    setShowTaxiDropdown(false);
                                }}
                            />
                        }
                        outlineColor={
                            errors.stakeholderType ? Colors.trip.error : Colors.trip.border
                        }
                        activeOutlineColor={
                            errors.stakeholderType ? Colors.trip.error : Colors.trip.primary
                        }
                        theme={inputTheme}
                        style={styles.input}
                        textColor={Colors.trip.text}
                    />
                    {/* Render dropdown list inline under the input */}
                    {showStakeholderDropdown && (
                        <DropdownList
                            data={stakeholderTypes}
                            onSelect={(item) => {
                                handleChange("stakeholderType", item);
                                handleChange("taxiType", "");
                                // close taxi dropdown if open
                                setShowTaxiDropdown(false);
                            }}
                            onClose={() => setShowStakeholderDropdown(false)}
                            style={{ maxHeight: 260 }}
                        />
                    )}
                </View>
                {errors.stakeholderType && (
                    <HelperText type="error">{errors.stakeholderType}</HelperText>
                )}

                {/* Taxi Type conditional */}
                {(details.stakeholderType === "TAXI DRIVER" ||
                    details.stakeholderType === "RENTAL TAXI PROVIDER") && (
                        <>
                            <View style={styles.inputWithDropdown}>
                                <TextInput
                                    mode="outlined"
                                    label="Taxi Type"
                                    value={details.taxiType}
                                    editable={false}
                                    right={
                                        <TextInput.Icon
                                            icon={showTaxiDropdown ? "chevron-up" : "menu-down"}
                                            onPress={() => {
                                                if (!isEditable) return;
                                                setShowTaxiDropdown((s) => !s);
                                                // close stakeholder dropdown
                                                setShowStakeholderDropdown(false);
                                            }}
                                        />
                                    }
                                    outlineColor={errors.taxiType ? Colors.trip.error : Colors.trip.border}
                                    activeOutlineColor={errors.taxiType ? Colors.trip.error : Colors.trip.primary}
                                    theme={inputTheme}
                                    style={styles.input}
                                    textColor={Colors.trip.text}
                                />
                                {showTaxiDropdown && (
                                    <DropdownList
                                        data={taxiTypes}
                                        onSelect={(item) => {
                                            handleChange("taxiType", item);
                                        }}
                                        onClose={() => setShowTaxiDropdown(false)}
                                        style={{ maxHeight: 260 }}
                                    />
                                )}
                            </View>
                            {errors.taxiType && <HelperText type="error">{errors.taxiType}</HelperText>}
                        </>
                    )}

                {/* Other fields */}
                {renderField("Name of Business", "businessName", details.businessName)}
                {renderField(
                    "Designation of Contact Person",
                    "designation",
                    details.designation
                )}
                {renderField(
                    "Contact Person Name",
                    "contactPersonName",
                    details.contactPersonName
                )}
                {renderField(
                    "Contact Person Phone Number",
                    "phone",
                    details.phone,
                    "phone-pad"
                )}

                <View style={styles.checkboxRow}>
                    <Checkbox
                        status={isWhatsappSame ? "checked" : "unchecked"}
                        onPress={() => handleWhatsappSync(!isWhatsappSame)}
                        color={Colors.trip.primary}
                        disabled={!isEditable}
                    />
                    <Text style={styles.checkboxText}>
                        WhatsApp same as phone number
                    </Text>
                </View>

                {renderField(
                    "Contact WhatsApp Number",
                    "whatsapp",
                    details.whatsapp,
                    "phone-pad"
                )}
                {renderField(
                    "Alternate Phone Number",
                    "alternatePhone",
                    details.alternatePhone,
                    "phone-pad"
                )}
                {renderField("Address", "address", details.address)}

                {isEditable && (
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.button}
                        buttonColor={Colors.trip.primary}
                        textColor={Colors.trip.surface}
                        labelStyle={styles.buttonLabel}
                    >
                        Save
                    </Button>
                )}
            </Surface>
        </ScrollView>
    );
};

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
    inputWithDropdown: {
        zIndex: 9999, // keep dropdown above other content on iOS
        // higher container for Android stacking too:
        ...Platform.select({
            android: { elevation: 4 },
            ios: {},
        }),
        marginBottom: 6,
    },
    dropdownSurface: {
        marginTop: 6,
        borderRadius: 12,
        maxHeight: 240,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        backgroundColor: Colors.trip.surface,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    dropdownItemText: {
        color: Colors.trip.text,
    },
    dropdownSeparator: {
        height: 1,
        backgroundColor: Colors.trip.border,
        marginHorizontal: 6,
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

export default StakeholderDetailsScreen;
