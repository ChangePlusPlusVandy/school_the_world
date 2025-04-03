import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link, useLocalSearchParams, useRouter} from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { createDatabase, DatabaseService } from "../db/base";
import ProgressBar from './components/ProgressBar';

export default function DataTrackingCountry() {
  const router = useRouter();
  const { country } = useLocalSearchParams();
  const { community } = useLocalSearchParams();

  const [programs, setPrograms] = useState([
    "Early Childhood",
    "Primary School",
    "Middle School",
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.push({pathname: '/community_list'})}>
          <MaterialIcons name="arrow-back" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/")}>
          <MaterialIcons name="home-filled" size={50} />
        </TouchableOpacity>
        <MaterialIcons name="upload" size={40} />
      </View>

      <Text style={styles.title}>Choose a program</Text>

      {programs.map((program, index) => (
        <View key={index} style={styles.buttonContainer}>
          <Link href={`/entry_form?country=${country}&community=${community}&program=${program}`} style={styles.buttonLabels}>
            {program}
          </Link>
        </View>
      ))}

      <ProgressBar currentStep={3} />
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
    marginBottom: 32,
    paddingBottom: "3%",
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

  buttonContainer: {
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#FFFFFF',
    // marginTop: 20,
    // marginBottom: 10,
    // borderRadius: 20,
    // width: 331,
    // height: 102,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center",
  },

  buttonLabels: {
    // textAlign: 'center',
    // fontFamily: 'Plus Jakarta Sans',
    // fontSize: 20,
    // fontStyle: 'normal',
    // fontWeight: 700,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    marginRight: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: 8,
    padding: 12,
    width: "85%",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  continueButton: {
    backgroundColor: "green",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    marginLeft: 10,
  },
});
