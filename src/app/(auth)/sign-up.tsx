import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function SignUp() {
    const router = useRouter();
    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSignUp = () => {
        // TODO: Supabase signup logic
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
                Create Account
            </Text>

            {/* Text Input with custom colors */}
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                outlineColor={"#D1D5DB"} // subtle border
                activeOutlineColor={theme.colors.primary}        // TripCat primary on focus
                style={{ marginBottom: 20 }}
            />

            <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                outlineColor={"#D1D5DB"}
                activeOutlineColor={theme.colors.primary}
                style={{ marginBottom: 30 }}
            />

            <Button mode="contained" onPress={onSignUp} style={{ paddingVertical: 6 }}>
                Sign Up
            </Button>

            <Link href="/sign-in" asChild>
                <Button
                    mode="text"
                    style={{ marginTop: 10 }}
                    textColor={theme.colors.primary}
                >
                    Already have an account?
                </Button>
            </Link>
        </View>
    );
}
