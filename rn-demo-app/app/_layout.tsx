import { Stack } from "expo-router";
import ProviderWrapper from "@/lib/providers/wrapper";

export default function RootLayout() {
  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(home)" />
      </Stack>
    </ProviderWrapper>
  );
}
