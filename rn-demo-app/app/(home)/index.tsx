import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";

import { SafeAreaView, Text } from "@/components/native";

import { useDynamic } from "@/lib/clients/dynamic";

import { getHeight, getWidth } from "@/constants/Spaces";
import { DisplayStyle } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";
import { balanceService } from "@/lib/api";

function handleButton() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export default function Homepage() {
  const insets = useSafeAreaInsets();
  const { wallets, auth } = useDynamic();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["balance", wallets.primary],
    queryFn: () => balanceService.getBalance(wallets.primary?.address),
  });

  // auth.logout();

  console.log("Balance data:", data, isLoading, isError);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex_area}>
        <View style={styles.header_container}>
          <Text style={styles.header_title}>AWS Demo App</Text>
        </View>
        <View style={styles.balance_container}>
          <Text style={styles.balance_currency}>$</Text>
          <Text style={styles.balance_text}>{data ? Number(data) : "0"}</Text>
        </View>
      </View>
      <Pressable
        style={[
          styles.send_container,
          { paddingBottom: insets.bottom, paddingTop: 16 },
        ]}
        onPress={handleButton}
      >
        <Text style={styles.send_text}>SEND</Text>
      </Pressable>
      {/* <Button
        title="Logout"
        onPress={() => {
          dynamicClient.auth.logout();
        }}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GREEN,
  },
  flex_area: {
    flex: 1,
  },
  header_container: {
    marginVertical: getHeight(16),
    paddingHorizontal: getWidth(20),
  },
  header_title: {
    color: Colors.DARK,
    fontSize: DisplayStyle.size.sm,
    fontWeight: DisplayStyle.weight.Black,
    letterSpacing: -1.2,
  },
  balance_container: {
    paddingVertical: getHeight(32),
    paddingHorizontal: getWidth(20),
    flexDirection: "row",
    alignItems: "flex-end",
  },
  balance_text: {
    color: Colors.DARK,
    fontSize: 128,
    fontWeight: DisplayStyle.weight.Bold,
    lineHeight: 128 * 1.5,
  },
  balance_currency: {
    color: Colors.DARK,
    fontSize: 48,
    fontWeight: DisplayStyle.weight.Bold,
    lineHeight: 108 * 1.5,
  },
  send_container: {
    backgroundColor: Colors.DARK,
    paddingHorizontal: getWidth(20),
  },
  send_text: {
    color: Colors.GREEN,
    fontSize: DisplayStyle.size.sm,
    fontWeight: DisplayStyle.weight.Bold,
  },
});
