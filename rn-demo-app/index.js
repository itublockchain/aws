import "react-native-get-random-values";
import "@react-native-anywhere/polyfill-base64";
import { Buffer } from "buffer";
import "expo-router/entry";

// Polyfill for @dynamic-labs/solana-extension
global.TextEncoder = require("text-encoding").TextEncoder;
global.Buffer = Buffer;
