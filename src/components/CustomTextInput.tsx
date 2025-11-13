
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

interface CustomTextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
}) => (
    <View style={styles.container}>
        <TextInput
            mode="outlined"
            label={label}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            style={styles.input}
            outlineColor={Colors.trip.border}
            activeOutlineColor={Colors.trip.primary}
            textColor={Colors.trip.text}
            theme={{
                roundness: 12,
                colors: {
                    background: Colors.trip.surface,
                    placeholder: Colors.trip.muted,
                },
            }}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    input: {
        backgroundColor: Colors.trip.surface,
    },
});

export default CustomTextInput;
