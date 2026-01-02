import { AdminDropdownProps } from "@/constants/dropdown";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { List, Modal, Portal, TextInput } from "react-native-paper";

export default function AdminDropdown({
    label,
    items,
    value,
    onSelect,
    disabled,
}: AdminDropdownProps) {
    const [visible, setVisible] = useState(false);

    const selectedLabel = items.find((i) => i.value === value)?.label || "";

    return (
        <View>
            {/* Prevent cursor by disabling TextInput and using Pressable */}
            <Pressable onPress={() => !disabled && setVisible(true)}>
                <View pointerEvents="none">
                    <TextInput
                        label={label}
                        mode="outlined"
                        value={selectedLabel}
                        editable={false}
                        showSoftInputOnFocus={false}
                        right={<TextInput.Icon icon="menu-down" />}
                    />
                </View>
            </Pressable>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={styles.modal}
                >
                    <ScrollView style={styles.scrollArea} keyboardShouldPersistTaps="handled">
                        {items.map((item) => (
                            <List.Item
                                key={item.id}
                                title={item.label}
                                onPress={() => {
                                    onSelect(item.value, item.label);
                                    setVisible(false);
                                }}
                            />
                        ))}
                    </ScrollView>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "white",
        borderRadius: 12,
        marginHorizontal: 20,
        maxHeight: 400,
        paddingVertical: 8,
    },
    scrollArea: {
        maxHeight: 360,
    },
});
