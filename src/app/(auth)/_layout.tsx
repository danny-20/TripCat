import { userTheme } from "@/constants/Colors";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function AuthLayout() {
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
