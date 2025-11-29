
import { logoutUser } from '@/api';
import { View } from '@/components/Themed';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';

export default function ProfileScreen() {

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/");

    } catch (error) {
      alert("Failed to logout!");
      console.log(error);
    }
  }
  return (
    <View>
      <Button
        mode='contained'
        onPress={handleLogout}
      >Logout</Button>
    </View>
  );
}

