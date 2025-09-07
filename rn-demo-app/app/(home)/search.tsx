import { View, StyleSheet } from "react-native";

import { Text } from "@/components/native";
import { Colors } from "@/constants/Colors";
import { getHeight, getWidth } from "@/constants/Spaces";
import { DisplayStyle } from "@/constants/Fonts";

export default function Search() {
  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.header_title}>Nearby Wallets</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GREEN,
    padding: getWidth(20),
  },
  header_container: {
    marginVertical: getHeight(8),
  },
  header_title: {
    color: Colors.DARK,
    fontSize: DisplayStyle.size.sm,
    fontWeight: DisplayStyle.weight.Black,
    letterSpacing: -1.2,
  },
});
