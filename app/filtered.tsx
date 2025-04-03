import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createDatabase, DatabaseService } from "../db/base";

export default function FilterPage() {
  const navigation = useNavigation();
  const [db, setDb] = useState<DatabaseService | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        const databaseService = await createDatabase();
        setDb(databaseService);

        // TODO: Grab all years listed in entries.arrivalDate and set as filter options

      } catch (error) {
        console.error("Error initializing database: ", error);
      }
    };
    initializeDb();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={30} color="darkblue" />
        </TouchableOpacity>
        <Text style={styles.title}>Filtered Data</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.filterButtonText}>
            {selectedYear ? `Year: ${selectedYear}` : "Select Year"}
          </Text>
          <AntDesign name={showDropdown ? "up" : "down"} size={12} color="black" />
        </TouchableOpacity>
        {showDropdown && (
          <FlatList
            data={years}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedYear(item);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: "85%",
  },
  filterButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  filterButtonText: {
    fontSize: 16,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 14,
  },
});