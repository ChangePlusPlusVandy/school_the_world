import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  year: string;
  earlyCount: number;
  primaryCount: number;
  middleCount: number;
  studentCount: number;
  entryCount: number;
}

export default function AnnualData({
  year,
  earlyCount,
  primaryCount,
  middleCount,
  studentCount,
  entryCount,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.pieChartContainer}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{studentCount}</Text>
        <Text>Students Reached</Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 10 }}>
          {entryCount}
        </Text>
        <Text>Active Programs</Text>
      </View>

      <View style={styles.programContainer}>
        <Text style={styles.breakdownLabel}>Program Breakdown:</Text>
        <View style={styles.allPrograms}>
          <View style={[styles.program, styles.earlyChildhood]}>
            <Text style={styles.programLabel}>Early Childhood Program</Text>
            <Text style={styles.data}>{earlyCount} members</Text>
          </View>

          <View style={[styles.program, styles.primarySchool]}>
            <Text style={styles.programLabel}>Primary School Program</Text>
            <Text style={styles.data}>{primaryCount} members</Text>
          </View>

          <View style={[styles.program, styles.middleSchool]}>
            <Text style={styles.programLabel}>Middle School Program</Text>
            <Text style={styles.data}>{middleCount} members</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#EFF2F7",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 24,
  },
  pieChartContainer: {
    backgroundColor: "#FFFFFF",
    height: 140,
    margin: 20,
    borderRadius: 16,
    width: 250,
    padding: "3%",
    alignItems: "center",
    justifyContent: "center",
  },
  programContainer: {
    padding: "3%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: 250,
  },
  breakdownLabel: {
    fontSize: 14,
    fontWeight: "bold",
    margin: 7,
  },
  allPrograms: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginTop: 10,
  },
  program: {
    paddingLeft: 20,
    height: 70,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  programLabel: {
    fontSize: 12,
  },
  data: {
    fontSize: 20,
    fontWeight: "bold",
  },
  earlyChildhood: {
    backgroundColor: "#DDEAFF",
  },
  primarySchool: {
    backgroundColor: "#86B5FF",
  },
  middleSchool: {
    backgroundColor: "#3280FF",
  },
});
