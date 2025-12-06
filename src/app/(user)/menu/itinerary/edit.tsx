import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function ItineraryEdit() {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Edit Itinerary</Text>
            <Text>Edit itinerary with ID: {id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});
