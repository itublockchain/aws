import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useDynamic } from "@/lib/clients/dynamic";
import ProviderWrapper from "@/lib/providers/wrapper";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const { sdk, wallets } = useDynamic();

  useEffect(() => {
    if (sdk.loaded) {
      SplashScreen.hideAsync();
    }
  }, [sdk.loaded]);

  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!wallets.primary?.address}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={!!wallets.primary?.address}>
          <Stack.Screen name="(home)" />
        </Stack.Protected>
      </Stack>
    </ProviderWrapper>
  );
}
