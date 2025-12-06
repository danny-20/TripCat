import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';


export default function MenuStack() {


    return (

        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: Colors.trip.primary,   // header background color
            },
            headerTintColor: Colors.trip.surface,     // header text/icon color
            contentStyle: {
                backgroundColor: Colors.trip.background, // default screen background
            },
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="agencyDetails" options={{ title: 'Agency Details' }} />
            <Stack.Screen name="bookingData" options={{ title: 'Booking Data' }} />
            <Stack.Screen name="bookingDetails" options={{ title: 'Booking Details' }} />


        </Stack>

    )
}