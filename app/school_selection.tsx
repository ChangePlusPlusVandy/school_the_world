// app/school_selection.tsx

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState, useEffect } from "react";

export default function SchoolPage() {
  const [schools, setSchools] = useState<string[]>([]);

  useEffect(() => {
    // Fetch schools based on the selected community
    setSchools(Array.from({ length: 12 }, (_, index) => `School ${index + 1}`));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FD" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <TouchableOpacity>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Link href="/">
            <MaterialIcons name="home-filled" size={24} color="black" />
          </Link>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="file-upload" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", marginVertical: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Choose School</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 8,
            marginBottom: 16,
          }}
          placeholder="Search..."
        />

        {schools.map((school, index) => (
          <Link
            key={index}
            href="/survey"
            style={{ flex: 1, marginBottom: 12 }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#FFFFFF",
                padding: 16,
                borderRadius: 8,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>{school}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}
