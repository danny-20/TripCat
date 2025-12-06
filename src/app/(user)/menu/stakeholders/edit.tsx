import { useStakeholder, useUpdateStakeholder } from "@/api/stakeholders";
import Colors from "@/constants/Colors";
import { Stakeholder } from "@/constants/Types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import {
    Button,
    Checkbox,
    HelperText,
    Text,
    TextInput,
} from "react-native-paper";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");


// ------------------------------------------------------
// FIXED & FINAL DROPDOWN COMPONENT
// ------------------------------------------------------
function ModalDropdown({
    label,
    value,
    list,
    onSelect,
    theme,
    error,
}: {
    label: string;
    value: string;
    list: string[];
    onSelect: (v: string) => void;
    theme?: any;
    error?: string;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Pressable onPress={() => setVisible(true)}>
                <TextInput
                    mode="outlined"
                    label={label}
                    value={value}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                    style={styles.input}
                    theme={theme}
                    outlineColor={error ? Colors.trip.error : Colors.trip.border}
                    activeOutlineColor={error ? Colors.trip.error : Colors.trip.primary}
                />
            </Pressable>

            {error && <HelperText type="error">{error}</HelperText>}

            <Modal visible={visible} transparent animationType="fade">
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setVisible(false)}
                />

                <View style={styles.dropdownModalBox}>
                    <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
                    >
                        {list.map((item) => (
                            <Pressable
                                key={item}
                                onPress={() => {
                                    onSelect(item);
                                    setVisible(false);
                                }}
                                style={styles.dropdownItemModal}
                            >
                                <Text style={{ fontSize: 16 }}>{item}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
}



// ------------------------------------------------------
// MAIN EDIT SCREEN
// ------------------------------------------------------
export default function EditStakeholderScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const stakeholderId = Number(id);

    const { data, isLoading } = useStakeholder(stakeholderId);
    const updateStakeholder = useUpdateStakeholder();

    const [details, setDetails] = useState<Stakeholder | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isWhatsappSame, setIsWhatsappSame] = useState(false);


    // Load stakeholder details
    useEffect(() => {
        if (data) {
            setDetails({ ...data }); // ensures new reference
            setIsWhatsappSame(data.whatsapp === data.phone);
        }
    }, [data]);


    // Stakeholder and taxi type dropdown lists
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



    // ------------------------------------------------------
    // FIXED handleChange — GUARANTEED RE-RENDER
    // ------------------------------------------------------
    const handleChange = (key: keyof Stakeholder, value: string) => {
        setDetails(prev => {
            if (!prev) return prev;
            return { ...prev, [key]: value }; // new object reference → rerender
        });

        setErrors(prev => ({ ...prev, [key]: "" }));
    };



    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------
    const validatePhone = (phone: string) =>
        /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));

    const validate = () => {
        if (!details) return false;

        const e: Record<string, string> = {};
        const isTaxi =
            details.stakeholderType === "TAXI DRIVER" ||
            details.stakeholderType === "RENTAL TAXI PROVIDER";

        if (!details.stakeholderType) e.stakeholderType = "Select stakeholder type";
        if (isTaxi && !details.taxiType) e.taxiType = "Taxi type required";
        if (!details.businessName) e.businessName = "Business name required";
        if (!details.contactPersonName) e.contactPersonName = "Contact person required";
        if (!details.designation) e.designation = "Designation required";
        if (!details.phone) e.phone = "Phone required";
        else if (!validatePhone(details.phone)) e.phone = "Invalid phone";
        if (!details.address) e.address = "Address required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };



    // ------------------------------------------------------
    // SUBMIT
    // ------------------------------------------------------
    const handleUpdate = () => {
        if (!details) return;
        if (!validate()) return;

        updateStakeholder.mutate(
            {
                id: stakeholderId,
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



    // ------------------------------------------------------
    // LOADING STATE
    // ------------------------------------------------------
    if (isLoading || !details) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }



    // ------------------------------------------------------
    // UI
    // ------------------------------------------------------
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Edit Stakeholder</Text>



                {/* Stakeholder Type */}
                <ModalDropdown
                    label="Stakeholder Type"
                    value={details.stakeholderType}
                    list={stakeholderTypes}
                    onSelect={(item) => {
                        setDetails(prev => ({
                            ...prev!,
                            stakeholderType: item,
                            taxiType:
                                item === "TAXI DRIVER" ||
                                    item === "RENTAL TAXI PROVIDER"
                                    ? prev!.taxiType
                                    : "",
                        }));
                    }}
                    theme={inputTheme}
                    error={errors.stakeholderType}
                />



                {/* Taxi Type if applicable */}
                {(details.stakeholderType === "TAXI DRIVER" ||
                    details.stakeholderType === "RENTAL TAXI PROVIDER") && (
                        <ModalDropdown
                            label="Taxi Type"
                            value={details.taxiType || ""}
                            list={taxiTypes}
                            onSelect={(item) => handleChange("taxiType", item)}
                            theme={inputTheme}
                            error={errors.taxiType}
                        />
                    )}



                {/* Business Name */}
                <TextInput
                    mode="outlined"
                    label="Business Name"
                    value={details.businessName}
                    onChangeText={(v) => handleChange("businessName", v)}
                    style={styles.input}
                />

                {/* Contact Person */}
                <TextInput
                    mode="outlined"
                    label="Contact Person Name"
                    value={details.contactPersonName}
                    onChangeText={(v) => handleChange("contactPersonName", v)}
                    style={styles.input}
                />

                {/* Designation */}
                <TextInput
                    mode="outlined"
                    label="Designation"
                    value={details.designation}
                    onChangeText={(v) => handleChange("designation", v)}
                    style={styles.input}
                />

                {/* Phone */}
                <TextInput
                    mode="outlined"
                    label="Phone"
                    value={details.phone}
                    onChangeText={(v) => handleChange("phone", v)}
                    keyboardType="phone-pad"
                    style={styles.input}
                />



                {/* WhatsApp Same */}
                <View style={styles.checkboxRow}>
                    <Checkbox
                        status={isWhatsappSame ? "checked" : "unchecked"}
                        onPress={() => {
                            setIsWhatsappSame(!isWhatsappSame);
                            handleChange(
                                "whatsapp",
                                !isWhatsappSame ? details.phone : ""
                            );
                        }}
                    />
                    <Text>WhatsApp same as phone</Text>
                </View>



                {/* WhatsApp */}
                <TextInput
                    mode="outlined"
                    label="WhatsApp"
                    value={details.whatsapp || ""}
                    onChangeText={(v) => handleChange("whatsapp", v)}
                    keyboardType="phone-pad"
                    style={styles.input}
                />



                {/* Alternate Phone */}
                <TextInput
                    mode="outlined"
                    label="Alternate Phone"
                    value={details.alternatePhone || ""}
                    onChangeText={(v) => handleChange("alternatePhone", v)}
                    keyboardType="phone-pad"
                    style={styles.input}
                />



                {/* Address */}
                <TextInput
                    mode="outlined"
                    label="Address"
                    value={details.address}
                    onChangeText={(v) => handleChange("address", v)}
                    style={styles.input}
                />



                {/* Save Button */}
                <Button
                    mode="contained"
                    onPress={handleUpdate}
                    buttonColor={Colors.trip.primary}
                    textColor="#fff"
                    style={styles.button}
                >
                    Save Changes
                </Button>
            </View>
        </ScrollView>
    );
}



const inputTheme = { roundness: 12 };

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.trip.background,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: Colors.trip.surface,
    },
    title: {
        fontSize: 22,
        marginBottom: 16,
        color: Colors.trip.primary,
    },
    input: {
        marginBottom: 10,
        backgroundColor: Colors.trip.surface,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    dropdownModalBox: {
        position: "absolute",
        top: SCREEN_HEIGHT * 0.25,
        left: 20,
        right: 20,
        maxHeight: SCREEN_HEIGHT * 0.55,
        borderRadius: 12,
        backgroundColor: Colors.trip.surface,
        paddingVertical: 6,
        elevation: 10,
    },
    dropdownItemModal: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    button: {
        marginTop: 16,
    },
});
