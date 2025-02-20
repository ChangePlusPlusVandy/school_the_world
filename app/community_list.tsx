import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, ScrollView, Pressable, Alert } from "react-native";
import { Link } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { createDatabase, DatabaseService } from "../db/base";
import { Community } from "../db/community";

export default function CommunityList() {
  const [schoolName, setSchoolName] = useState("");
  const [status, setStatus] = useState("");
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ visible: boolean; school: Community | null }>({ visible: false, school: null });
  const [schools, setSchools] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [db, setDb] = useState<DatabaseService | null>(null);

  const statuses = ["Active", "Inactive", "Pending", "Dedicated"];

  useEffect(() => {
    const initializeDb = async () => {
      const databaseService = await createDatabase();
      setDb(databaseService);
      console.log("Database initialized");
    };

    initializeDb().catch((error) => {
      console.error("Error initializing database: ", error);
    });

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

  //this is assuming that the school array contains Community objects
  const handleDelete = async (school: Community) => {
    if (db) {
      const community = await db.deleteCommunityById(school.id);
      if (community) {
        console.log(`Deleted community: ${community.name}`);
      } else {
        console.error("Failed to delete community");
      }
    } else {
      console.error("Database not initialized");
    }
  };

  const confirmDelete = (school: Community) => {
    setDeleteModal({ visible: true, school });
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Community</Text>
      <TextInput style={styles.input} placeholder="Search..." />
      <View style={styles.addCardContainer}>
        <View style={[styles.card, styles.addCard]}>
          <Pressable style={styles.addCardContent} onPress={addSchool}>
            <Text style={[styles.cardTitle, styles.addTitle]}>
              Add a School
            </Text>
            <Text style={[styles.cardTitle, styles.addTitle]}> +</Text>
          </Pressable>
        </View>
        <TouchableOpacity onPress={handleEdit} style={styles.editCard}>
          <Feather name="edit" size={24} color="green" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* change the schools array to be an array of Community objects, the confirmDelete shoud stop erroring out */}
        {schools.map((school, index) => (
          <View key={index} style={[styles.card, styles.schoolCard]}>
            <View style={styles.schoolRow}>
              <Link href="/" asChild>
                <Pressable>
                  <Text style={styles.cardTitle}>{school}</Text>
                </Pressable>
              </Link>
              {editMode && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => Alert.alert("Edit", "Edit school")}
                    style={styles.iconButton}
                  >
                    <Feather name="edit" size={24} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => confirmDelete(school)}
                    style={styles.iconButton}
                  >
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
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
              <Text style={styles.dropdownText}>
                {status || "Select Status"}
              </Text>
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={deleteModal.visible}
        onRequestClose={() => setDeleteModal({ visible: false, school: null })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Are you sure you want to delete:</Text>
            <Text style={styles.schoolNameText}>{deleteModal.school?.name ?? ""}</Text>
            <View style={styles.deleteModalActions}>
              <Pressable
                style={styles.deleteButton}
                onPress={() => setDeleteModal({ visible: false, school: null })}
              >
              </Pressable>
              <Pressable
                style={[styles.deleteButton, styles.confirmDeleteButton]}
                onPress={() => {
                  if (deleteModal.school) {
                    handleDelete(deleteModal.school);
                    setDeleteModal({ visible: false, school: null });
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>Yes, Delete</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  addCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: "black",
  },
  addTitle: {
    color: "white",
  },
  editCard: {
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  schoolCard: {
    width: "100%",
  },
  schoolRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  deleteModalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
  },
  deleteModalTitle: {
    fontSize: 20,
    marginBottom: 20,
    width: "70%",
    fontWeight: "bold",
    textAlign: "center",
  },
  schoolNameText: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  deleteModalActions: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  deleteButton: {
    marginHorizontal: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmDeleteButton: {
    backgroundColor: "green",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
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
  saveButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});