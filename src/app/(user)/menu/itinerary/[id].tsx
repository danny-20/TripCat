import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function ItineraryDetails() {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Itinerary Details</Text>
            <Text>ID: {id}</Text>

            <Link
                href={{
                    pathname: "/(user)/menu/itinerary/edit",
                    params: { id },
                }}
                asChild
            >
                <Button mode="contained" style={styles.button}>
                    Edit Itinerary
                </Button>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    button: {
        marginTop: 20,
    },
});
