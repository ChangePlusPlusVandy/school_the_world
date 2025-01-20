import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function CountrySelection() {
  return (
    <View>
      <Text>Country Selection</Text>
      <Link href="/community_selection">Go to Community Selection</Link>
    </View>
  );
}
