import { useCreateTemplate } from "@/api/templates";
import { useAuth } from "@/app/providers/AuthProvider";
import Dropdown from "@/components/Dropdown";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import {
    Button,
    HelperText,
    Surface,
    Text,
    TextInput,
} from "react-native-paper";

const DISTRICTS = ["EAST SIKKIM", "WEST SIKKIM", "NORTH SIKKIM", "SOUTH SIKKIM"];
const TRAVEL_TIMES = ["1-2 Hours", "2-3 Hours", "3-4 Hours", "4-5 Hours", "5-6 Hours"];

export default function CreateTemplateScreen() {
    const { session } = useAuth();
    const uid = session!.user!.id;
    const { mutateAsync, isPending } = useCreateTemplate();
    const [form, setForm] = useState({
        district: "",
        templateTitle: "",
        travelTime: "",
        description: "",
        overnightStay: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    /* ------------------ HANDLE CHANGE ------------------ */
    const handleChange = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    /* ------------------ VALIDATION ------------------ */
    const validateForm = () => {
        const e: Record<string, string> = {};

        if (!form.district) e.district = "District is required";
        if (!form.templateTitle.trim()) e.templateTitle = "Template title is required";
        if (!form.travelTime) e.travelTime = "Select travel time";
        if (!form.description.trim()) e.description = "Description is required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ------------------ SUBMIT ------------------ */
    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload = {
            user_id: uid,
            district: sanitize(form.district),
            template_title: sanitize(form.templateTitle),
            travel_time: sanitize(form.travelTime),
            description: sanitize(form.description),
            overnight_stay: form.overnightStay ? sanitize(form.overnightStay) : null,
        };


        try {
            await mutateAsync(payload);   // ✅ MUTATION CALL
            alert("Template created successfully!");
            router.replace("/(user)/menu/templates");
        } catch (err: any) {
            alert(err.message);
        }
    };
    const sanitize = (input: string) => {
        return input.replace(/\\/g, "\\\\");
    }

    return (
        <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
        >
            <Surface style={styles.card} elevation={0}>

                {/* Title */}
                <Text style={styles.title}>Create Template</Text>

                {/* District Dropdown */}
                <View style={{ zIndex: 1000 }}>
                    <Dropdown
                        label="District"
                        value={form.district}
                        list={DISTRICTS}
                        onSelect={(v) => handleChange("district", v)}
                        theme={inputTheme}
                        error={errors.district}
                    />
                </View>
                {errors.district && <HelperText type="error">{errors.district}</HelperText>}

                {/* Template Title */}
                <TextInput
                    mode="outlined"
                    label="Template Title"
                    value={form.templateTitle}
                    onChangeText={(v) => handleChange("templateTitle", v)}
                    style={styles.input}
                    outlineColor={errors.templateTitle ? Colors.trip.error : Colors.trip.border}
                    activeOutlineColor={
                        errors.templateTitle ? Colors.trip.error : Colors.trip.primary
                    }
                    theme={inputTheme}
                />
                {errors.templateTitle && (
                    <HelperText type="error">{errors.templateTitle}</HelperText>
                )}

                {/* Travel Time Dropdown */}
                <View style={{ zIndex: 900 }}>
                    <Dropdown
                        label="Travel Time"
                        value={form.travelTime}
                        list={TRAVEL_TIMES}
                        onSelect={(v) => handleChange("travelTime", v)}
                        theme={inputTheme}
                        error={errors.travelTime}
                    />
                </View>
                {errors.travelTime && (
                    <HelperText type="error">{errors.travelTime}</HelperText>
                )}

                {/* Description */}
                <TextInput
                    mode="outlined"
                    label="Description"
                    multiline
                    numberOfLines={5}
                    value={form.description}
                    onChangeText={(v) => handleChange("description", v)}
                    style={[styles.input, { height: 110 }]}
                    outlineColor={errors.description ? Colors.trip.error : Colors.trip.border}
                    activeOutlineColor={
                        errors.description ? Colors.trip.error : Colors.trip.primary
                    }
                    theme={inputTheme}
                />
                {errors.description && (
                    <HelperText type="error">{errors.description}</HelperText>
                )}

                {/* Overnight Stay */}
                <TextInput
                    mode="outlined"
                    label="Overnight Stay (Optional)"
                    value={form.overnightStay}
                    onChangeText={(v) => handleChange("overnightStay", v)}
                    style={styles.input}
                    outlineColor={Colors.trip.border}
                    activeOutlineColor={Colors.trip.primary}
                    theme={inputTheme}
                />

                {/* Save Button */}
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    buttonColor={Colors.trip.primary}
                    labelStyle={{ fontFamily: "Montserrat-SemiBold" }}
                >
                    Save Template
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
        overflow: "visible",
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
    button: {
        marginTop: 12,
        borderRadius: 12,
    },
});
