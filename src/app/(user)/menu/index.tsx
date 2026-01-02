import { useAuth } from '@/app/providers/AuthProvider';
import MenuScreen from '@/components/MenuScreen';
import Colors from '@/constants/Colors';
import { Redirect, Stack } from 'expo-router';

import { StyleSheet, View } from 'react-native';


export default function HomeScreen() {
    const { isAdmin, loading, session } = useAuth();
    // Wait until auth is ready
    if (loading) return null;

    // Not logged in → go to login
    if (!session) return <Redirect href="/(auth)/sign-in" />;

    // ADMIN SHOULD NOT SEE USER MENU
    if (isAdmin) return <Redirect href="/(admin)" />;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: " TripCat" }} />
            <MenuScreen />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.trip.background,
        padding: 20,
    },

});
