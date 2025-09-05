import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";
import { ZeroDevExtension } from "@dynamic-labs/zerodev-extension";

export const dynamicClient = createClient({
  environmentId: "fb1c20ed-d5a1-483f-9666-88b0f04f97e8",
  appLogoUrl: "https://demo.dynamic.xyz/favicon-32x32.png",
  appName: "AWS Demo App",
})
  .extend(ReactNativeExtension())
  .extend(ViemExtension())
  .extend(ZeroDevExtension());
