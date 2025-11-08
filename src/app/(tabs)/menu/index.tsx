import MenuScreen from '@/components/MenuScreen';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';

import { StyleSheet, View } from 'react-native';


export default function HomeScreen() {
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
