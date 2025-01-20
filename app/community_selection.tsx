import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function CommunitySelection() {
  return (
    <View>
      <Text>Community Selection</Text>
      <Link href="/school_selection">Go to School Selection</Link>
    </View>
  );
}
