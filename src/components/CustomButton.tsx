import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface CustomButtonProps {
    label: string;
    onPress: () => void;
    mode?: 'text' | 'outlined' | 'contained';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    onPress,
    mode = 'contained',
    disabled = false,
    loading = false,
    icon,
    style,
}) => {
    return (
        <Button
            mode={mode}
            onPress={onPress}
            disabled={disabled}
            loading={loading}
            icon={icon}
            labelStyle={styles.label}
            contentStyle={styles.content}
            style={[styles.button, style]}
        >
            {label}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        marginVertical: 8,
        elevation: 2,
    },
    content: {
        paddingVertical: 6,
    },
    label: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
    },
});

export default CustomButton;
