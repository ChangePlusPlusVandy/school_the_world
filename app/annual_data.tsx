import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AnnualData() {
  const [programs, setPrograms] = useState([
    "Early Childhood",
    "Primary School",
    "Middle School",
  ]);

  return (
    <View style={styles.container}>
        <View style={styles.topRow}>
            <MaterialIcons name="arrow-back" size={30} />
            <MaterialIcons name="home-filled" size={50} />
            <MaterialIcons name="upload" size={40} />
        </View>

        <Text style={styles.title}>Annual Data</Text>
        <View style={styles.pieChartContainer}>
          <Text> ladeda</Text>
            {/* to be replaced with the pie chart data visualization later */}
        </View>
        <View style={styles.programContainer}>
            <Text style={styles.breakdownLabel}>Program Breakdown:</Text>
            <View style={styles.allPrograms}>

              <View style={[styles.program, styles.earlyChildhood]}>
                  <Text style={styles.programLabel}>Early Childhood Program</Text>
                  <Text style={styles.data}>data</Text>
              </View>

              <View style={[styles.program, styles.primarySchool]}>
                  <Text style={styles.programLabel}>Primary School Program</Text>
                  <Text style={styles.data}>data</Text>
              </View>

              <View style={[styles.program, styles.middleSchool]}>
                  <Text style={styles.programLabel}>Middle School Program</Text>
                  <Text style={styles.data}>data</Text>
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
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EFF2F7",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 24,
    paddingBottom: "3%",
  },

  pieChartContainer: {
    backgroundColor: "#FFFFFF",
    height: 100,
    margin: 20,
    borderRadius: 16,
    width: 250,
    padding: '3%',
  },

  programContainer: {
    padding: '3%',
    height: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: 250,
  },

  breakdownLabel: {
    fontSize: 12,
    margin: 7,
  },

  allPrograms: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  program: {
    paddingLeft: 20,
    height: 70,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },

  programLabel: {
    fontSize: 12,
  },

  data: {
    fontSize: 25,
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
