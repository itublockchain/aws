import { Text as BaseText } from "react-native";
import { Colors } from "@/constants/Colors";
import * as Fonts from "@/constants/Fonts";

function Text(props: any) {
  const { style, ...rest } = props;

  // Apply default styles if not provided
  const defaultStyle = {
    fontFamily: Fonts.TextStyle.family.nunito,
    fontSize: Fonts.TextStyle.size.xs,
    color: Colors.BLACK,
  };

  return <BaseText style={[defaultStyle, style]} {...rest} />;
}

export default Text;
