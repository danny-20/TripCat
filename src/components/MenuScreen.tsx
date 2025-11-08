import Colors from '@/constants/Colors';
import { menus } from '@/constants/Types';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, FAB, IconButton } from 'react-native-paper';

const MenuScreen = () => {
    const router = useRouter();



    return (
        <View style={styles.container}>
            {/* scrollable content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {menus.map((item) => (
                    <Card
                        key={item.id}
                        onPress={() => router.push(item.route as any)}
                        style={styles.card}
                        mode="elevated"
                    >
                        <Card.Title
                            title={item.title}
                            titleStyle={styles.title}
                            left={(props) => (
                                <IconButton {...props} icon={item.icon} iconColor={styles.icon.color} />
                            )}
                        />
                    </Card>
                ))}
            </ScrollView>

            {/* Floating button at bottom of screen */}
            <FAB
                icon="plus"
                style={styles.fab}
                color="#FEFCF3"
                onPress={() => console.log('Create pressed')}
            />
        </View>
    );
};

export default MenuScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.trip.background,
    },
    card: {
        backgroundColor: Colors.trip.primary,
        borderRadius: 16,
        marginBottom: 12,
    },
    title: {
        color: Colors.trip.surface,
        fontFamily: 'Montserrat-Medium',
        fontSize: 18,
    },
    icon: {
        color: Colors.trip.surface,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: Colors.trip.secondary,
    },
    scrollContainer: {
        paddingVertical: 16,   // vertical padding inside scroll view
        paddingHorizontal: 16, // horizontal padding (space from left/right edges)
        paddingBottom: 100,    // extra space at bottom for tab bar or FAB
        rowGap: 12,            // space between each Card (works like marginBottom)
    },
});