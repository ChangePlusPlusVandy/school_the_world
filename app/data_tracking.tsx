import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function DataTracking() {
  return (
    <View>
      <Text>Data tracking</Text>
      <Link href="/country_selection">Go to Country Selection</Link>
    </View>
  );
}
