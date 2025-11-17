import React from 'react';
import { View } from 'react-native';

import { supabase } from '@/lib/supabase';
import { Link, Redirect } from 'expo-router';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useAuth } from './providers/AuthProvider';

const Index = () => {

    const { session, loading, isAdmin } = useAuth();

    if (loading) {
        return <ActivityIndicator />
    }

    if (!session) {
        return <Redirect href="/sign-in" />
    }

    if (!isAdmin) {
        return <Redirect href="/(user)" />
    }

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

            <Button onPress={() => supabase.auth.signOut()}>Sign- out</Button>

        </View>
    );
};

export default Index;
