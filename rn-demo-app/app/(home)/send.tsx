import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text, TextInput, KeyboardAvoidingView } from "@/components/native";
import { Colors } from "@/constants/Colors";
import { getHeight, getWidth } from "@/constants/Spaces";
import { DisplayStyle, TextStyle } from "@/constants/Fonts";

interface WalletData {
  ens: string;
  address: string;
}

function handleButton() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  router.push("./send");
}

export default function Send({ walletData }: { walletData: WalletData }) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.flex_area}>
        <View style={styles.header_container}>
          <Text style={styles.header_title}>Send</Text>
        </View>
        {walletData ? (
          <View style={styles.wallet_data_container}>
            <Text style={styles.wallet_data_text}>{walletData.ens}</Text>
            <Text style={styles.wallet_data_text}>{`${walletData.address.slice(
              0,
              8
            )}...${walletData.address.slice(-5)}`}</Text>
          </View>
        ) : (
          <View style={styles.wallet_data_container}>
            <TextInput
              textInputProps={{
                placeholder: "Wallet Address",
                placeholderTextColor: Colors.DARK,
                selectionColor: Colors.DARK,
              }}
            />
          </View>
        )}
        <View style={styles.amount_container}>
          <RNTextInput
            style={styles.input}
            caretHidden
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={Colors.DARK}
          />
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
    </KeyboardAvoidingView>
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
  wallet_data_container: {
    paddingHorizontal: getWidth(20),
    marginBottom: getHeight(16),
  },
  wallet_data_text: {
    color: Colors.DARK,
    fontSize: TextStyle.size.xl,
    fontWeight: DisplayStyle.weight.Black,
    letterSpacing: -1.2,
  },
  amount_container: {
    paddingVertical: getHeight(24),
    paddingHorizontal: getWidth(20),
  },
  input: {
    color: Colors.DARK,
    fontSize: 128,
    fontWeight: DisplayStyle.weight.Bold,
    textAlign: "center",
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
