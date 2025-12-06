import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

export default function StakeholderLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // ❗ do NOT show its own header
                headerStyle: { backgroundColor: Colors.trip.primary },
                headerTintColor: Colors.trip.surface,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="create" options={{ title: "Create Stakeholder" }} />
            <Stack.Screen name="edit" options={{ title: "Edit Stakeholder" }} />
            <Stack.Screen name="delete" options={{ title: "Delete Stakeholder" }} />
        </Stack>
    );
}
