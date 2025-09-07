import { useRef } from "react";
import {
  View,
  TextInput as TextInputBase,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewProps as RNViewProps,
  TextProps as RNTextProps,
  Pressable,
} from "react-native";
import Text from "./Text";
import { getHeight } from "@/constants/Spaces";
import { TextStyle } from "@/constants/Fonts";
import { Colors } from "@/constants/Colors";

export type TextInputProps = {
  label?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  textInputProps?: RNTextInputProps;
  containerProps?: RNViewProps;
  labelProps?: RNTextProps;
  helperTextProps?: RNTextProps;
  errorMessageProps?: RNTextProps;
};

function TextInput({
  label,
  required = false,
  helperText,
  errorMessage,
  textInputProps,
  containerProps,
  labelProps,
  helperTextProps,
  errorMessageProps,
}: TextInputProps) {
  const textInputRef = useRef<TextInputBase>(null);
  return (
    <View {...containerProps} style={[styles.container, containerProps?.style]}>
      {label && (
        <Text {...labelProps} style={[styles.label_text, labelProps?.style]}>
          {label}{" "}
          {required && <Text style={styles.label_text_required}>*</Text>}
        </Text>
      )}
      <Pressable
        style={[
          styles.input_container,
          {
            borderColor: errorMessage ? Colors.ERROR_500 : Colors.GRAY_200,
          },
        ]}
        onPress={() => textInputRef.current?.focus()}
        hitSlop={12}
      >
        <TextInputBase
          style={[
            styles.input,
            {
              color: errorMessage ? Colors.ERROR_500 : Colors.GRAY_900,
            },
          ]}
          placeholderTextColor={Colors.GRAY_400}
          ref={textInputRef}
          {...textInputProps}
        />
      </Pressable>
      {helperText ||
        (errorMessage && (
          <View style={styles.helper_container}>
            {helperText && (
              <Text
                style={[styles.helper_text, helperTextProps?.style]}
                {...helperTextProps}
              >
                {helperText}
              </Text>
            )}
            {errorMessage && (
              <Text
                style={[styles.error_text, errorMessageProps?.style]}
                {...errorMessageProps}
              >
                {errorMessage}
              </Text>
            )}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: getHeight(4),
  },
  label_text: {
    fontSize: TextStyle.size.sm,
    fontWeight: TextStyle.weight.Medium,
    color: Colors.GRAY_500,
  },
  label_text_required: {
    color: Colors.ERROR_500,
  },
  input_container: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: getHeight(12),
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: TextStyle.size.lg,
    fontWeight: TextStyle.weight.Black,
    color: Colors.DARK,
  },
  helper_container: {
    gap: getHeight(4),
  },
  helper_text: {
    fontSize: TextStyle.size.sm,
    fontWeight: TextStyle.weight.Regular,
    color: Colors.GRAY_400,
  },
  error_text: {
    fontSize: TextStyle.size.sm,
    fontWeight: TextStyle.weight.Regular,
    color: Colors.ERROR_500,
  },
});

export default TextInput;
