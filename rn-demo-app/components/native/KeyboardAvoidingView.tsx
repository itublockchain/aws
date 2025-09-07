import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import SafeAreaView from "./SafeAreaView";

function KeyboardAvoidingView({
  children,
  ...props
}: React.PropsWithChildren<any>) {
  return (
    <RNKeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView {...props}>{children}</SafeAreaView>
      </TouchableWithoutFeedback>
    </RNKeyboardAvoidingView>
  );
}

export default KeyboardAvoidingView;
