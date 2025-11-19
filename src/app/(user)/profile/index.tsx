
import { logoutUser } from '@/api';
import { View } from '@/components/Themed';
import { Button } from 'react-native-paper';

export default function ProfileScreen() {

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("Logged out successfully!");

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

