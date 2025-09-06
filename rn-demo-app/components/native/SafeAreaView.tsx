import React from "react";
import {
  SafeAreaView as RNCSafeAreaView,
  SafeAreaViewProps,
  Edge,
} from "react-native-safe-area-context";
import { StyleProp, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

interface Props extends Omit<SafeAreaViewProps, "style"> {
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  edges?: Edge[];
}

function SafeAreaView(props: Props) {
  const {
    style,
    backgroundColor = Colors.WHITE,
    edges = ["top"],
    children,
    ...rest
  } = props;

  return (
    <RNCSafeAreaView
      style={[{ flex: 1, backgroundColor }, style]}
      edges={edges}
      {...rest}
    >
      {children}
    </RNCSafeAreaView>
  );
}

export default SafeAreaView;
