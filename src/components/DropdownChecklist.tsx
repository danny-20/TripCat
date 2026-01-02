import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, Text } from "react-native-paper";

export interface DropdownChecklistProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (values: string[]) => void;
}

const DropdownChecklist: React.FC<DropdownChecklistProps> = ({
    label,
    options,
    selected,
    onChange,
}) => {
    const [open, setOpen] = useState(false);
    const safeSelected = Array.isArray(selected) ? selected : [];


    const toggleSelect = (value: string) => {
        if (safeSelected.includes(value)) {
            onChange(safeSelected.filter((v) => v !== value));
        } else {
            onChange([...safeSelected, value]);
        }
    };
    console.log("CHECKLIST OPTIONS:", options);
    console.log("CHECKLIST SELECTED:", safeSelected);
    return (
        <View style={styles.container}>
            {/* Dropdown Header */}
            <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={() => setOpen(!open)}
            >
                <Text style={styles.label}>
                    {selected.length > 0
                        ? `${label}: ${selected.join(", ")}`
                        : label}
                </Text>

                <MaterialIcons
                    name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={24}
                />
            </TouchableOpacity>

            {/* Expanding Checklist */}
            {open && (
                <View style={styles.optionsContainer}>
                    {options.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={styles.optionRow}
                            onPress={() => toggleSelect(item)}
                        >
                            <Checkbox
                                status={safeSelected.includes(item) ? "checked" : "unchecked"}

                            />
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    dropdownHeader: {
        borderWidth: 1,
        borderColor: "#c4c4c4",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 16,
    },
    optionsContainer: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#d1d1d1",
        borderRadius: 8,
        paddingVertical: 4,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
});

export default DropdownChecklist;
