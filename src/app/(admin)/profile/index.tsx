import { logoutUser } from "@/api";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";

export default function ProfileScreen() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/sign-in");
    } catch (error) {
      alert("Failed to logout!");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={3}>

        <Button
          mode="contained"
          icon="logout"
          onPress={handleLogout}
          style={styles.button}
          buttonColor={Colors.trip.error}
          textColor={Colors.trip.surface}
          labelStyle={styles.buttonLabel}
        >
          Logout
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.trip.background,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: Colors.trip.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.trip.border,
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 22,
    color: Colors.trip.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
  },
});
