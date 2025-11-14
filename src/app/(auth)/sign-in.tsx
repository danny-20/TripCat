import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function SignIn() {
    const router = useRouter();
    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSignIn = () => {
        // TODO: Add your Supabase sign-in logic
        // router.replace("/(tabs)");
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
                padding: 20,
                justifyContent: "center",
            }}
        >
            <Text
                variant="headlineMedium"
                style={{
                    color: theme.colors.primary,
                    marginBottom: 30,
                    textAlign: "center",
                }}
            >
                Welcome Back
            </Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={{ marginBottom: 20 }}
            />

            <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={{ marginBottom: 30 }}
            />

            <Button
                mode="contained"
                onPress={onSignIn}
                style={{ paddingVertical: 6 }}
            >
                Sign In
            </Button>

            <Link href="/sign-up" asChild>
                <Button
                    mode="text"
                    style={{ marginTop: 10 }}
                    textColor={theme.colors.primary}
                >
                    Create an account
                </Button>
            </Link>
        </View>
    );
}
