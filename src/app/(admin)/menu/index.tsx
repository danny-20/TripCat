import AdminMenuScreen from '@/components/AdminMenuScreen';
import { adminMenus } from '@/constants/adminMenus';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';

import { StyleSheet, View } from 'react-native';


export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: " TripCat" }} />
            <AdminMenuScreen menus={adminMenus} />

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
