import Colors from "@/constants/Colors";
import { DropdownProps } from "@/constants/Types";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Dropdown({
    label,
    value,
    list,
    onSelect,
    theme,
    error,
}: DropdownProps) {
    const [visible, setVisible] = useState(false);

    return (
        <>
            {/* FIX: Wrap TextInput in Pressable */}
            <Pressable onPress={() => setVisible(true)}>
                <TextInput
                    mode="outlined"
                    label={label}
                    value={value}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                    style={styles.input}
                    pointerEvents="none"  // FIX: prevents TextInput from blocking touches
                    outlineColor={error ? Colors.trip.error : Colors.trip.border}
                    activeOutlineColor={error ? Colors.trip.error : Colors.trip.primary}
                    theme={theme}
                />
            </Pressable>

            {error && <Text style={styles.error}>{error}</Text>}

            <Modal visible={visible} transparent animationType="fade">
                {/* Background overlay */}
                <Pressable style={styles.overlay} onPress={() => setVisible(false)} />

                {/* Dropdown container */}
                <View style={styles.dropdownBox}>
                    <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingVertical: 6 }}
                        style={styles.scrollArea}
                    >
                        {list.map((item) => (
                            <Pressable
                                key={item}
                                onPress={() => {
                                    onSelect(item);
                                    setVisible(false);
                                }}
                                style={({ pressed }) => [
                                    styles.item,
                                    pressed && styles.itemPressed,
                                ]}
                            >
                                <Text style={styles.itemText}>{item}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.trip.surface,
        marginBottom: 6,
    },
    error: {
        color: Colors.trip.error,
        fontSize: 12,
        marginBottom: 6,
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    dropdownBox: {
        position: "absolute",
        top: SCREEN_HEIGHT * 0.25,
        left: 16,
        right: 16,
        maxHeight: SCREEN_HEIGHT * 0.55,
        backgroundColor: Colors.trip.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.trip.border,
        elevation: 10,
        overflow: "hidden",
    },
    scrollArea: {
        maxHeight: SCREEN_HEIGHT * 0.55,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    itemPressed: {
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    itemText: {
        color: Colors.trip.text,
        fontSize: 16,
    },
});
