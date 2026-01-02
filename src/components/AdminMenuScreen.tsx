import Colors from "@/constants/Colors";
import { AdminMenuItem } from "@/constants/adminMenus"; // import type
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, IconButton } from "react-native-paper";

type AdminMenuScreenProps = {
    menus: AdminMenuItem[];
};

export default function AdminMenuScreen({ menus }: AdminMenuScreenProps) {
    const router = useRouter();

    const handleNavigation = (route: string) => {
        router.push(route as any);   // ⬅️ FIX: bypass strict expo-router types
    };
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {menus.map((item) => (
                    <Card
                        key={item.id}
                        onPress={() => handleNavigation(item.route)}
                        style={styles.card}
                        mode="elevated"
                    >
                        <Card.Title
                            title={item.title}
                            titleStyle={styles.title}
                            left={(props) => (
                                <IconButton
                                    {...props}
                                    icon={item.icon}      // ALWAYS show folder icons
                                    iconColor={styles.icon.color}
                                />
                            )}
                        />
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.trip.background,
    },
    scrollContainer: {
        padding: 16,
        rowGap: 12,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: Colors.admin.card,
        borderRadius: 16,
    },
    title: {
        color: Colors.trip.surface,
        fontFamily: "Montserrat-Medium",
        fontSize: 18,
    },
    icon: {
        color: Colors.trip.surface,
    },
});
