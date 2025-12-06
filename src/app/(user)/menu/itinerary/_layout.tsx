import Colors from "@/constants/Colors";
import { Stack } from "expo-router";

export default function ItineraryLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: Colors.trip.primary,
                },
                headerTintColor: Colors.trip.surface,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="create" options={{ title: "Create Itinerary" }} />
            <Stack.Screen name="[id]" options={{ title: "Itinerary Details" }} />
            <Stack.Screen name="edit" options={{ title: "Edit Itinerary" }} />
        </Stack>
    );
}
