import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import Colors from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from "react-native-paper";
import { useColorScheme } from '../../components/useColorScheme';
import { useAuth } from '../providers/AuthProvider';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { session } = useAuth();


  const paperTheme = {
    roundness: 12,
    colors: {
      primary: Colors.trip.primary,
      secondary: Colors.trip.secondary,
      background: Colors.trip.background,
      surface: Colors.trip.surface,
      error: Colors.trip.error,
      text: Colors.trip.text,
      onSurface: Colors.trip.text,
    },
  };

  if (!session) {
    return <Redirect href="/" />
  }

  return (
    <PaperProvider theme={paperTheme}>
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // // Disable the static render of the header on web
          // // to prevent a hydration error in React Navigation v6.
          // headerShown: useClientOnlyValue(false, true),
          headerStyle: {
            backgroundColor: Colors.trip.primary,   // top bar color
          },
          headerTintColor: Colors.trip.surface,     // title color
          tabBarActiveTintColor: Colors.trip.secondary, // active icon/text color
          tabBarInactiveTintColor: Colors.trip.muted,   // inactive icon/text color
          tabBarStyle: {
            backgroundColor: Colors.trip.background,    // tab bar background
            borderTopColor: Colors.trip.border,
          },
          headerShown: false
        }}>
        <Tabs.Screen name='index' options={{ href: null }} />
        <Tabs.Screen
          name="menu"
          options={{
            headerTitle: 'TripCat',
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={size}
              />
            ),
            // headerRight: () => (
            //   <Link href="/modal" asChild>
            //     <Pressable>
            //       {({ pressed }) => (
            //         <FontAwesome
            //           name="info-circle"
            //           size={25}
            //           color={Colors.trip.surface}
            //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            //         />
            //       )}
            //     </Pressable>
            //   </Link>
            // ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'account' : 'account-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
