import { Stack } from 'expo-router';

// consistent TripCat header styling
export default function ProfileStack() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#2B7A78' },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 20,
                },

            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: 'Profile' }} // Title shown in header
            />
        </Stack>
    );
}
