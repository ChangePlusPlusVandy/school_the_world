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
} from "react-native";
import { Link } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";

export default function CommunityList() {
  const [schools, setSchools] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [status, setStatus] = useState("");
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const statuses = ["Not Started", "Identified", "Agreement Signed", "In Progress", "Dedicated"];

  useEffect(() => {
    // Fetch schools based on the selected community
    setSchools(Array.from({ length: 12 }, (_, index) => `School ${index + 1}`));
  }, []);

  const addSchool = () => {
    setModalVisible(true);
  };

  const handleSave = () => {
    if (schoolName && status) {
      setSchools((prev) => [...prev, schoolName]);
      setSchoolName("");
      setStatus("");
      setModalVisible(false);
    } else {
      alert("Please fill out all fields.");
    }
  };

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
      <Text style={styles.title}>Choose Community</Text>
      <TextInput style={styles.input} placeholder="Search..." />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable style={[styles.card, styles.addCard]} onPress={addSchool}>
          <View style={styles.addCardContent}>
            <Text style={[styles.cardTitle, styles.addTitle]}>Add a School</Text>
            <Text style={[styles.cardTitle, styles.addTitle]}> +</Text>
          </View>
        </Pressable>
        {schools.map((school, index) => (
          <Link key={index} href="/" asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{school}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a School</Text>
            <TextInput
              style={styles.input}
              placeholder="School Name"
              value={schoolName}
              onChangeText={setSchoolName}
            />
            <TouchableOpacity
  style={styles.dropdown}
  onPress={() => setStatusDropdownVisible(!statusDropdownVisible)}
>
  <Text style={styles.dropdownText}>{status || "Select Status"}</Text>
</TouchableOpacity>
{statusDropdownVisible && (
  <View style={styles.dropdownContainer}>
    <View style={styles.dropdownList}>
      {statuses.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.dropdownItem}
          onPress={() => {
            setStatus(item);
            setStatusDropdownVisible(false);
          }}
        >
          <Text style={styles.dropdownItemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)}

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  addCard: {
    backgroundColor: "green",
  },
  addCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "darkblue",
  },
  addTitle: {
    color: "white",
    paddingLeft: 40,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    height: "40%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 25,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: "#6b7280",
  },
  dropdownContainer: {
    position: "absolute",
    top: 200, 
    left: 20,
    width: "100%",
    zIndex: 1,
  },
  dropdownList: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#374151",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "grey",
  },
  saveButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
