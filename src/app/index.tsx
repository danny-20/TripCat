import React from 'react';
import { View } from 'react-native';

import { Link } from 'expo-router';
import { Button } from 'react-native-paper';

const Index = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
            <Link href="/(user)" asChild>
                <Button>User</Button>
            </Link>
            <Link href="/(admin)" asChild>
                <Button>Admin</Button>
            </Link>
            <Link href="/sign-in" asChild>
                <Button>Sign-in</Button>
            </Link>
        </View>
    );
};

export default Index;
