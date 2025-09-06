import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import { Text } from "../native";
import { Colors } from "@/constants/Colors";
import { TextStyle } from "@/constants/Fonts";

import { useDynamic } from "../../lib/clients/dynamic";

function GoogleAuthButton() {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const dynamic = useDynamic();

  const waitForAuth = () =>
    new Promise<void>((resolve, reject) => {
      const onSuccess = () => {
        dynamic.auth.off("authSuccess", onSuccess);
        dynamic.auth.off("authFailed", onFailure);
        resolve();
      };
      const onFailure = (data: unknown, reason: unknown) => {
        dynamic.auth.off("authSuccess", onSuccess);
        dynamic.auth.off("authFailed", onFailure);
        reject(reason);
      };

      dynamic.auth.once("authSuccess", onSuccess);
      dynamic.auth.once("authFailed", onFailure);
    });

  const handlePress = async () => {
    try {
      await Promise.all([
        waitForAuth(),
        dynamic.auth.social.connect({ provider: "google" }),
      ]);
      setDisabled(false);
      setLoading(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    } catch (err) {
      console.error("Google auth failed", err);
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setDisabled(true);
        setLoading(true);
        await handlePress();
      }}
      style={styles.container}
      disabled={disabled || loading || !!dynamic.wallets.primary?.address}
    >
      {loading ? (
        <LottieView
          source={require("@/assets/animations/spinner.json")}
          style={styles.spinner}
          autoPlay
          loop
        />
      ) : (
        <>
          {/* <Google /> */}
          <Text style={styles.texts}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    backgroundColor: Colors.DARK,
    borderRadius: 16,
  },
  texts: {
    fontSize: TextStyle.size.lg,
    fontWeight: TextStyle.weight.SemiBold,
    color: Colors.GREEN,
  },
  spinner: {
    width: 27,
    height: 27,
  },
});

export default GoogleAuthButton;
