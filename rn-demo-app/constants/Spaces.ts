import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const [baseWidth, baseHeight] = [375, 812];

const getWidth = (unit = baseWidth) => (unit / baseWidth) * width;
const getHeight = (unit = baseHeight) => (unit / baseHeight) * height;

export { getWidth, getHeight };
