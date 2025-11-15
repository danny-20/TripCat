import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function SignIn() {
    const router = useRouter();
    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async () => {
        setErrorMsg("");

        if (!emailRegex.test(email)) {
            setErrorMsg("Enter a valid email.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setErrorMsg(error.message);
            return;
        }

        // Login successful → redirect user
        router.replace("/"); // Change this to your protected route
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
                Login
            </Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                outlineColor={"#D1D5DB"}
                activeOutlineColor={theme.colors.primary}
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
                style={{ marginBottom: 20 }}
            />

            {errorMsg ? (
                <Text style={{ color: "red", marginBottom: 10 }}>{errorMsg}</Text>
            ) : null}

            <Button
                mode="contained"
                onPress={handleLogin}
                disabled={loading}
                style={{ paddingVertical: 6 }}
            >
                {loading ? "Signing In..." : "Login"}
            </Button>

            <Link href="/sign-up" asChild>
                <Button mode="text" style={{ marginTop: 10 }} textColor={theme.colors.primary}>
                    Create a new account
                </Button>
            </Link>
        </View>
    );
}
