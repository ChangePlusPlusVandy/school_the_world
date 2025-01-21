// app/index.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MaterialIcons name="home-filled" size={50} />
      <TouchableOpacity>
        <Link href="/data_tracking">
          Go to Data Tracking
        </Link>
        <Link href="/school_info">
          Go to School Info Page
        </Link>
      </TouchableOpacity>
    </View>
  );
}
