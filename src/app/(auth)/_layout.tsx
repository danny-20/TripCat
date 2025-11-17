import { userTheme } from "@/constants/Colors";
import { Redirect, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useAuth } from "../providers/AuthProvider";

export default function AuthLayout() {
    const { session } = useAuth();

    if (session) {
        return <Redirect href="/" />
    }
    return (
        <PaperProvider theme={userTheme}>
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: userTheme.colors.primary,   // Header background
                    },
                    headerTintColor: userTheme.colors.text,         // Back icon
                    headerTitleStyle: {
                        color: userTheme.colors.surface,              // Header title text
                        fontWeight: "600",
                    },
                }}
            />
        </PaperProvider>
    );
}
