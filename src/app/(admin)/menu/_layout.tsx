import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';


export default function MenuStack() {


    return (

        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.admin.primary,  // admin → gold-brown | user → teal
                },
                headerTintColor: Colors.admin.surface,     // header text/icon color
                contentStyle: {
                    backgroundColor: Colors.admin.background, // page background
                },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'TripCat Admin' }} />
            <Stack.Screen name="agencyDetails" options={{ title: 'Agency Details' }} />
            <Stack.Screen name="bookingData" options={{ title: 'Booking Data' }} />
            <Stack.Screen name="stakeholderDetails" options={{ title: 'Stakeholder Details' }} />
            <Stack.Screen name="bookingDetails" options={{ title: 'Booking Details' }} />

        </Stack>

    )
}