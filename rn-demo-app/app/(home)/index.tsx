import { Text, Button } from "react-native";
import { SafeAreaView } from "@/components/native";

import { dynamicClient } from "@/lib";

export default function Homepage() {
  return (
    <SafeAreaView>
      <Text>Homepage</Text>
      <Button
        title="Logout"
        onPress={() => {
          dynamicClient.auth.logout();
        }}
      />
    </SafeAreaView>
  );
}
