// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const rawBundleId = "com.vvc.voicesync";
const bundleId =
  rawBundleId
    .replace(/[-_]/g, ".")
    .replace(/[^a-zA-Z0-9.]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .toLowerCase()
    .split(".")
    .map((segment) => {
      return /^[a-zA-Z]/.test(segment) ? segment : "x" + segment;
    })
    .join(".") || "com.vvc.voicesync";

const config: ExpoConfig = {
  name: "VVC Voice Sync",
  slug: "vvc-voice-sync",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/ic_launcher.png",
  scheme: "vvcvoicesync",
  userInterfaceStyle: "dark",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleId,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0A0B0D",
      foregroundImage: "./assets/images/ic_launcher.png",
    },
    package: bundleId,
    permissions: ["POST_NOTIFICATIONS"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    ["expo-ai-kit", { speech: true }],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo_suite.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#0A0B0D",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
        },
      },
    ],
  ],
};

export default config;
