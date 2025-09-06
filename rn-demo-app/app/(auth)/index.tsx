import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { SafeAreaView } from "@/components/native";
import GoogleAuthButton from "@/components/buttons/GoogleAuth";

import { getWidth } from "@/constants/Spaces";
import { Colors } from "@/constants/Colors";

export default function Login() {
  return (
    <SafeAreaView edges={["bottom", "top"]} style={styles.container}>
      <View style={styles.image_container}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.button_container}>
        <GoogleAuthButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GREEN,
  },
  image_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: getWidth(160),
    aspectRatio: 1,
  },
  button_container: {
    paddingHorizontal: getWidth(16),
  },
});
