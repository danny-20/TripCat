import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function SignUp() {
    const router = useRouter();
    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleEmailChange = (value: string) => {
        setEmail(value);

        // remove error if valid
        if (emailRegex.test(value)) {
            setEmailError("");
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);

        // remove error if valid
        if (value.length >= 6) {
            setPasswordError("");
        }
    };


    const signUpWithEMail = () => {
        let valid = true;

        // email check
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email.");
            valid = false;
        }

        // password check
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            valid = false;
        }

        if (!valid) return;

        console.log("Validation passed");
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
                onChangeText={handleEmailChange}
                mode="outlined"
                outlineColor={"#D1D5DB"} // subtle border
                activeOutlineColor={theme.colors.primary}        // TripCat primary on focus
                style={{ marginBottom: 20 }}
            />
            {emailError ? <Text style={{ color: "red" }}>{emailError}</Text> : null}


            <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
                mode="outlined"
                outlineColor={"#D1D5DB"}
                activeOutlineColor={theme.colors.primary}
                style={{ marginBottom: 20 }}
            />
            {passwordError ? <Text style={{ color: "red", marginBottom: 10 }}>{passwordError}</Text> : null}


            <Button mode="contained" onPress={signUpWithEMail} style={{ paddingVertical: 6 }}>
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

