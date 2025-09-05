import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";
import { ZeroDevExtension } from "@dynamic-labs/zerodev-extension";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { baseSepolia } from "viem/chains";

export const dynamicClient = createClient({
  environmentId: "fb1c20ed-d5a1-483f-9666-88b0f04f97e8",
  appLogoUrl: "https://demo.dynamic.xyz/favicon-32x32.png",
  appName: "AWS Demo App",
})
  .extend(ReactNativeExtension())
  .extend(ViemExtension())
  .extend(ZeroDevExtension());

export const useDynamic = () => useReactiveClient(dynamicClient);

export const getUser = () => {
  return dynamicClient.auth.authenticatedUser?.verifiedCredentials.find(
    (c) => c.format === "oauth"
  );
};

export function getPublicClient() {
  return dynamicClient.viem.createPublicClient({
    chain: baseSepolia,
  });
}

export async function getWalletClient() {
  return await dynamicClient.viem.createWalletClient({
    wallet: dynamicClient.wallets.primary!,
    chain: baseSepolia,
  });
}

export async function getKernelClient() {
  return await dynamicClient.zeroDev.createKernelClient({
    wallet: dynamicClient.wallets.primary!,
    chainId: baseSepolia.id,
    paymaster: "SPONSOR",
    bundlerRpc:
      "https://rpc.zerodev.app/api/v3/84bfab67-bb27-441a-9ce0-d8a844e66c6c/chain/84532",

    paymasterRpc:
      "https://rpc.zerodev.app/api/v3/84bfab67-bb27-441a-9ce0-d8a844e66c6c/chain/84532",
  });
}
