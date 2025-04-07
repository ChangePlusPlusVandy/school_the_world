import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { createDatabase, DatabaseService } from "../db/base";
import { Entry } from "../db/entry";
import { Canvas, Rect } from "@shopify/react-native-skia";
import InfrastructureChart from "./components/InfrastructureChart";
import HoursChart from "./components/HoursChart";
import RecessChart from "./components/RecessChart";

const screenWidth = Dimensions.get("window").width;

export default function FilterPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const [db, setDb] = useState<DatabaseService | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        const databaseService = await createDatabase();
        setDb(databaseService);
        const availableYears = await databaseService.getAllAvailableYears();
        setYears(availableYears);
      } catch (error) {
        console.error("Error initializing database: ", error);
      }
    };
    initializeDb();
  }, []);

  useEffect(() => {
    if (selectedYear && db) {
      db.getEntrybyArrivalYear(selectedYear).then((results) => {
        setEntries(results ?? []);
      });
    }
  }, [selectedYear, db]);

  // Example population stats
  const totalStudents = 1000;
  const totalParents = 525;
  const totalTeachers = 300;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Nav */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/")}>
          <MaterialIcons name="home-filled" size={50} />
        </TouchableOpacity>
        <MaterialIcons name="upload" size={40} />
      </View>

      {/* Page Title */}
      <Text style={styles.title}>Annual Data</Text>

      {/* Dropdown */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text>{selectedYear || "All Years"}</Text>
          <AntDesign name={showDropdown ? "up" : "down"} size={12} />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownList}>
            {years.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedYear(item);
                  setShowDropdown(false);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Infrastructure Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Infrastructure ({selectedYear || "All"})</Text>
      </View>
      <View style={styles.chart}>
        <InfrastructureChart
          data={[
            { country: "Country A", values: { construction: 50, dedicated: 30 } },
            { country: "Country B", values: { construction: 20, dedicated: 40 } },
          ]}
        />
      </View>

      {/* Population Totals Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Early Childhood ({selectedYear || "All"})</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>POPULATION TOTALS</Text>
          <View style={styles.totalsRow}>
            <View style={[styles.totalCard, { backgroundColor: "#DDEAFF" }]}>
              <Text style={styles.totalLabel}>Students</Text>
              <Text style={styles.totalValue}>{totalStudents}</Text>
            </View>
            <View style={[styles.totalCard, { backgroundColor: "#DDEAFF" }]}>
              <Text style={styles.totalLabel}>Parents</Text>
              <Text style={styles.totalValue}>{totalParents}</Text>
            </View>
            <View style={[styles.totalCard, { backgroundColor: "#DDEAFF" }]}>
              <Text style={styles.totalLabel}>Teachers</Text>
              <Text style={styles.totalValue}>{totalTeachers}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Primary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Primary ({selectedYear || "All"})</Text>
      </View>
      <View style={styles.chart}>
      <HoursChart
          data={[
            { country: "Country A", values: { "5hrs": 10, "no_info": 20 } },
            { country: "Country B", values: { "4.5hrs": 15, "4hrs": 25 } },
          ]}
        />
        <RecessChart
          data={[
            { country: "Country A", values: { "30min": 5, "1hr": 10 } },
            { country: "Country B", values: { "30min": 8, "1hr": 12 } },
          ]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EAF0F8",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 60,
  },
  topRow: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dropdownContainer: {
    width: "85%",
    marginBottom: 24,
  },
  dropdownButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
    elevation: 2,
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
  },
  section: {
    width: "95%",
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  totalCard: {
    marginLeft: 10,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    width: 90,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  chart: {
    marginBottom: 20,
    marginTop: -30
  },
});
