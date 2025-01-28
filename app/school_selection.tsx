// app/school_selection.tsx

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";

export default function SchoolPage() {
  const [schools, setSchools] = useState<string[]>([]);

  useEffect(() => {
    // Fetch schools based on the selected community
    setSchools(Array.from({ length: 12 }, (_, index) => `School ${index + 1}`));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconContainer}>
          <MaterialIcons name="arrow-back" size={24} color="darkblue" />
        </Pressable>
        <Link href="/" asChild>
          <Pressable>
            <MaterialIcons name="home" size={48} color="darkblue" />
          </Pressable>
        </Link>
        <Pressable style={styles.iconContainer}>
          <MaterialIcons name="file-upload" size={24} color="darkblue" />
        </Pressable>
      </View>
      <Text style={styles.title}>Choose School</Text>
      <TextInput style={styles.input} placeholder="Search..." />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {schools.map((school, index) => (
          <Link key={index} href="/survey" asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{school}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  iconContainer: {
    backgroundColor: "#e8eaf6",
    padding: 12,
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    width: "100%",
  },
  scrollContent: {
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "darkblue",
  },
});
