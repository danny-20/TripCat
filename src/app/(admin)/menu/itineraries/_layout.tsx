// src/app/(admin)/menu/itineraries/layout.tsx
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";

export default function ItinerariesLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: Colors.trip.primary,
                },
                headerTintColor: Colors.trip.surface,
                headerTitleStyle: {
                    fontFamily: "Montserrat-Medium",
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Itineraries",
                }}
            />
        </Stack>
    );
}
