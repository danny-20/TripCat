import React from 'react';

import { Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { useAuth } from './providers/AuthProvider';

const Index = () => {

    // const { session, loading, isAdmin } = useAuth();

    // if (loading) {
    //     return <ActivityIndicator />
    // }

    // if (!session) {
    //     return <Redirect href="/sign-in" />
    // }

    // if (!isAdmin) {
    //     return <Redirect href="/(user)" />
    // }

    // return (
    //     <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
    //         <Link href="/(user)" asChild>
    //             <Button>User</Button>
    //         </Link>
    //         <Link href="/(admin)" asChild>
    //             <Button>Admin</Button>
    //         </Link>
    //         <Link href="/sign-in" asChild>
    //             <Button>Sign-in</Button>
    //         </Link>

    //         <Button onPress={() => supabase.auth.signOut()}>Sign- out</Button>

    //     </View>
    // );
    const { session, loading, isAdmin } = useAuth();

    if (loading) {
        return <ActivityIndicator />;
    }

    // Open login page if not logged in
    if (!session) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    // Logged in → route according to group
    if (isAdmin) {
        return <Redirect href="/(admin)" />;
    }

    return <Redirect href="/(user)" />;

};

export default Index;
