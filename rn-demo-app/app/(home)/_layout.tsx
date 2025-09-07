import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="send" />
      <Stack.Screen
        name="search"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
