import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createDatabase, DatabaseService } from "../db/base";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

interface EntryData {
  id: string;
  date: string;
  isExpanded: boolean;
  details: {
    teacherArrivalTime: string;
    childrenArrivalTime: string;
    childrenAttended: number;
    parentsAttended: number;
    classStartTime: string;
    classEndTime: string;
    recessLength: string;
    hoursInSchool: string;
    teachersAbsent: number;
    cleanlinessScore: number;
    playgroundUsed: string;
    wereToysUsed: string;
    roomDecorations: string;
    otherObservations: string;
    lastUpdated: string;
  };
}

export default function PastEntriesScreen() {
  const [db, setDb] = useState<DatabaseService | null>(null);
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [studentsAttended, setStudentsAttended] = useState<number>(0);
  const [parentsAttended, setParentsAttended] = useState<number>(0);
  const [teachersAbsent, setTeachersAbsent] = useState<number>(0);
  const [cleanlinessScore, setCleanlinessScore] = useState<number>(0);
  const { country } = useLocalSearchParams();
  const { community } = useLocalSearchParams();
  const { program } = useLocalSearchParams();
  // Initialize database
  useEffect(() => {
    const initializeDb = async () => {
      const databaseService = await createDatabase();
      setDb(databaseService);
      console.log("Database initialized");
    };

    initializeDb().catch((error) => {
      console.error("Error initializing database: ", error);
    });
  }, []);

  const fetchEntries = async () => {
    if (!db) {
      console.error("Database is not initialized");
      return;
    }
    try {
      const entries = await db.getEntries(country as string, community as string, program as string);

      if (!entries) {
        console.log("No entries found");
        return;
      }

      setEntries(
        entries.map((entry) => ({
          id: entry.id,
          date: entry.arrival_date,
          isExpanded: false,
          details: {
            teacherArrivalTime: entry.time_teachers_arrive,
            childrenArrivalTime: entry.time_children_leave,
            childrenAttended: parseInt(entry.num_children),
            parentsAttended: parseInt(entry.num_parents),
            classStartTime: entry.time_classes_start,
            classEndTime: entry.time_classes_end,
            recessLength: entry.recess_time,
            hoursInSchool: entry.num_hours_children,
            teachersAbsent: parseInt(entry.num_teachers_absent),
            cleanlinessScore: parseInt(entry.cleanliness),
            playgroundUsed: entry.playground_used,
            wereToysUsed: entry.sinks_used,
            roomDecorations: entry.classroom_decor,
            otherObservations: entry.observations,
            lastUpdated: new Date(entry.last_updated).toLocaleDateString(),
          },
        }))
      );
      const totalEntries = entries.length;
      const totalStudents = entries.reduce(
        (acc, entry) => acc + parseInt(entry.num_children),
        0
      );
      const totalParents = entries.reduce(
        (acc, entry) => acc + parseInt(entry.num_parents),
        0
      );
      const totalTeachersAbsent = entries.reduce(
        (acc, entry) => acc + parseInt(entry.num_teachers_absent),
        0
      );
      const totalCleanliness = entries.reduce(
        (acc, entry) => acc + parseInt(entry.cleanliness),
        0
      );
      setStudentsAttended(Math.round(totalStudents / totalEntries));
      setParentsAttended(Math.round(totalParents / totalEntries));
      setTeachersAbsent(Math.round(totalTeachersAbsent / totalEntries));
      setCleanlinessScore(Math.round(totalCleanliness / totalEntries));
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [db])
  );

  const toggleExpand = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, isExpanded: !entry.isExpanded } : entry
      )
    );
  };

  const handleEditEntry = (id: string) => {
    router.push({
      pathname: "/edit_entry",
      params: { entryId: id },
    });
  };

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.navigate("/");
  };

  const renderEntryDetails = (entryId: string, details: EntryData["details"]) => (
    <View style={styles.entryDetails}>
      <DataRow
        label="Time teachers arrive:"
        value={details.teacherArrivalTime}
      />
      <DataRow
        label="Time children arrive:"
        value={details.childrenArrivalTime}
      />
      <DataRow
        label="# of children attended:"
        value={details.childrenAttended.toString()}
      />
      <DataRow
        label="# of parents attended:"
        value={details.parentsAttended.toString()}
      />
      <DataRow label="Time classes start:" value={details.classStartTime} />
      <DataRow label="Time classes end:" value={details.classEndTime} />
      <DataRow label="Recess length:" value={details.recessLength} />
      <DataRow label="# of hours in school:" value={details.hoursInSchool} />
      <DataRow
        label="# of teachers absent:"
        value={details.teachersAbsent.toString()}
      />
      <DataRow
        label="Cleanliness score (1-5):"
        value={details.cleanlinessScore.toString()}
      />
      <DataRow
        label="Playground being used:"
        value={details.playgroundUsed ? "Yes" : "No"}
      />
      <DataRow
        label="Were the toys used:"
        value={details.wereToysUsed ? "Yes" : "No"}
      />
      <DataRow
        label="Room decorations:"
        value={details.roomDecorations ? "Yes" : "No"}
      />
      <DataRow label="Other observations:" value={details.otherObservations} />

      <Pressable style={styles.editButton} onPress={() => handleEditEntry(entryId)}>
        <Text style={styles.editButtonText}>Edit Entry</Text>
      </Pressable>

      <Text style={styles.lastUpdated}>Last Updated {details.lastUpdated}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="darkblue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goHome} style={styles.homeButton}>
          <MaterialIcons name="home" size={24} color="darkblue" />
        </TouchableOpacity>
        <View style={styles.placeholderRight} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Past Entries</Text>
        <Text style={styles.subtitle}>School Name</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* avg metrics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Average Metrics:</Text>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}># of students attended:</Text>
            <Text style={styles.metricValue}>{studentsAttended}</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}># of parents attended:</Text>
            <Text style={styles.metricValue}>{parentsAttended}</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}># of teachers absent:</Text>
            <Text style={styles.metricValue}>{teachersAbsent}</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Cleanliness score (1-5):</Text>
            <Text style={styles.metricValue}>{cleanlinessScore}</Text>
          </View>
        </View>

        {/* details  */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Click to view details:</Text>

          {entries.map((entry) => (
            <View key={entry.id}>
              <Pressable
                style={styles.entryButton}
                onPress={() => toggleExpand(entry.id)}
              >
                {/* I just displayed the date for each becuase I don't have access to the time the entry was made */}
                <Text style={styles.entryButtonText}>{entry.date}</Text>
                <Feather
                  name={entry.isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#fff"
                />
              </Pressable>
              {entry.isExpanded && renderEntryDetails(entry.id, entry.details)}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* dots at the bottom */}
      <View style={styles.paginationContainer}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <View key={dot} style={styles.paginationDot} />
        ))}
      </View>
    </View>
  );
}

// rendering data
const DataRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e8eaf6",
    justifyContent: "center",
    alignItems: "center",
  },
  homeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderRight: {
    width: 40,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: "#333",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  entryButton: {
    backgroundColor: "#6DAE57",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
  paginationDot: {
    width: 30,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF9966",
    marginHorizontal: 4,
  },
  entryDetails: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginTop: 1,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  dataLabel: {
    fontSize: 14,
    color: "#333",
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  editButton: {
    backgroundColor: "#1a237e",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  lastUpdated: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginTop: 8,
  },
});
