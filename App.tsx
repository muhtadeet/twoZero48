import { View } from "react-native";
import { AppScreen } from "./src/components";
import { useFonts } from "expo-font";
import { theme } from "./src/constants";

export default function App() {
  const [fontsLoaded] = useFonts({
    [theme.fonts.bold]: require("./assets/fonts/ProtestRiot-Regular.ttf"),
    [theme.fonts.regular]: require("./assets/fonts/SueEllenFrancisco-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundPrimary }} />
    );
  }

  return <AppScreen />;
}
