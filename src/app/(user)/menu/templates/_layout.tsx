import { Stack } from "expo-router";

export default function TemplatesLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerTitleStyle: {
                    fontFamily: "Montserrat-SemiBold",
                },
            }}
        >
            {/* Templates Index */}
            <Stack.Screen
                name="index"
                options={{
                    title: "Templates",
                }}
            />

            {/* Create Template */}
            <Stack.Screen
                name="create"
                options={{
                    title: "Create Template",
                }}
            />

            {/* View Template */}
            <Stack.Screen
                name="[id]"
                options={{
                    title: "Template Details",
                }}
            />

            {/* Edit Template */}
            <Stack.Screen
                name="edit/[id]"
                options={{
                    title: "Edit Template",
                }}
            />
        </Stack>
    );
}
