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
import { Link, useLocalSearchParams } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { createDatabase, DatabaseService } from "../db/base";
import { useRouter } from "expo-router";
import ProgressBar from "./components/ProgressBar";

type Community = {
  id: number;
  name: string;
  country: string;
};

export default function CommunityList() {
  const router = useRouter();
  const [schools, setSchools] = useState<string[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    school: string | null;
  }>({ visible: false, school: null });
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    school: string | null;
    newName: string;
  }>({ visible: false, school: null, newName: "" });
  const [schoolName, setSchoolName] = useState("");
  const [status, setStatus] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [db, setDb] = useState<DatabaseService | null>(null);
  const { country } = useLocalSearchParams();

  const statuses = [
    "Not Started",
    "Identified",
    "Agreement Signed",
    "In Progress",
    "Dedicated",
  ];

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

  // Fetch communities based on the selected country
  useEffect(() => {
    if (db && country) {
      const fetchCommunities = async () => {
        try {
          const communities = await db.getCommunitiesByCountry(
            country as string
          );
          if (communities) {
            setSchools(communities.map((community) => community.name));
            setFilteredSchools(communities.map((community) => community.name));
          }
        } catch (error) {
          console.error("Error fetching communities:", error);
        }
      };
      fetchCommunities();
    }
  }, [db, country]);
  // Fetch communities based on the selected country
  useEffect(() => {
    if (db && country) {
      fetchCommunitiesFromDb();
    }
  }, [db, country]);

  // Fetch communities from the database
  const fetchCommunitiesFromDb = async () => {
    if (!db || !country) return;

    try {
      const communities = await db.getCommunitiesByCountry(country as string);
      if (communities) {
        setSchools(communities.map((community) => community.name));
        setFilteredSchools(communities.map((community) => community.name));
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  // Handle search functionality
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredSchools(schools); // Reset to full list if search query is empty
    } else {
      const filtered = schools.filter((school) =>
        school.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSchools(filtered);
    }
  }, [searchQuery, schools]);

  const addSchool = () => {
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (schoolName && status && db) {
      try {
        // Generate a unique ID (you might want to improve this logic)
        const id = String(Date.now());

        // Insert the community into the database
        const newCommunity = await db.addCommunity(
          schoolName,
          country as string,
          id
        );

        if (newCommunity) {
          // Refresh the communities list from the database
          await fetchCommunitiesFromDb();

          // Reset form
          setSchoolName("");
          setStatus("");
          setModalVisible(false);

          // Show success message
          Alert.alert("Success", `${schoolName} added successfully!`);
        } else {
          Alert.alert("Error", "Failed to add school to database.");
        }
      } catch (error) {
        console.error("Error adding community:", error);
        Alert.alert("Error", "An error occurred while adding the school.");
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleDelete = async (school: string) => {
    if (db) {
      const community = await db.deleteCommunity(school, country as string);
      if (community) {
        console.log(`Deleted community: ${community.name}`);
        await fetchCommunitiesFromDb();
      } else {
        console.error("Failed to delete community");
      }
    } else {
      console.error("Database not initialized");
    }
  };

  const confirmDelete = (school: string) => {
    setDeleteModal({ visible: true, school });
  };

  const confirmEdit = (school: string) => {
    setEditModal({ visible: true, school, newName: school });
  };

  const handleEditButton = () => {
    setEditMode(!editMode);
  };

  const fetchCommunityId = async (schoolName: string) => {
    if (!db) return null;
    const communities = await db.getCommunitiesByCountry(country as string);
    const community = communities?.find((c) => c.name === schoolName);
    return community ? community.id : null;
  };

  const handleEditSave = async () => {
    if (!db) {
      console.error("Database not initialized");
      return;
    }

    if (editModal.school && editModal.newName.trim()) {
      const communityId = await fetchCommunityId(editModal.school);
      if (!communityId) {
        Alert.alert("Error", "Failed to find community ID.");
        return;
      }

      try {
        const updatedCommunity: Community = {
          id: communityId,
          name: editModal.newName,
          country: country as string,
        };

        const success = await db.editCommunity(updatedCommunity, communityId);

        if (success) {
          setSchools((prev) =>
            prev.map((s) => (s === editModal.school ? editModal.newName : s))
          );
          setEditModal({ visible: false, school: null, newName: "" });
          console.log("Community updated successfully");
        } else {
          Alert.alert("Error", "Failed to update community in database.");
        }
      } catch (error) {
        console.error("Error updating community:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } else {
      Alert.alert("Error", "School name cannot be empty!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/")}>
          <MaterialIcons name="home-filled" size={50} />
        </TouchableOpacity>
        <MaterialIcons name="upload" size={40} />
      </View>

      <Text style={styles.title}>Choose Community</Text>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.addCardContainer}>
        <View style={[styles.card, styles.addCard]}>
          <Pressable style={styles.addCardContent} onPress={addSchool}>
            <Text style={[styles.cardTitle, styles.addTitle]}>
              Add a School
            </Text>
            <Text style={[styles.cardTitle, styles.addTitle]}> +</Text>
          </Pressable>
        </View>
        <TouchableOpacity onPress={handleEditButton} style={styles.editCard}>
          <Feather name="edit" size={24} color="green" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {schools.map((school, index) => (
          <View key={index} style={[styles.card, styles.schoolCard]}>
            <View style={styles.schoolRow}>
              <Link
                href={`/choose_program?country=${country}&community=${school}`}
                asChild
              >
                <Pressable>
                  <Text style={styles.cardTitle}>{school}</Text>
                </Pressable>
              </Link>
              {editMode && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => confirmEdit(school)}
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
            <Text style={styles.deleteModalTitle}>
              Are you sure you want to delete:
            </Text>
            <Text style={styles.schoolNameText}>
              {deleteModal.school ?? ""}
            </Text>
            <View style={styles.deleteModalActions}>
              <Pressable
                style={styles.deleteButton}
                onPress={() => setDeleteModal({ visible: false, school: null })}
              ></Pressable>
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

      <Modal
        transparent={true}
        visible={editModal.visible}
        onRequestClose={() =>
          setEditModal({ visible: false, school: null, newName: "" })
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Edit School Name</Text>
            <TextInput
              style={styles.input}
              value={editModal.newName}
              onChangeText={(text) =>
                setEditModal((prev) => ({ ...prev, newName: text }))
              }
              placeholder="Enter new school name"
            />
            <View style={styles.deleteModalActions}>
              <Pressable
                style={[
                  styles.deleteButton,
                  { backgroundColor: "grey", marginBottom: 10 },
                ]}
                onPress={() =>
                  setEditModal({ visible: false, school: null, newName: "" })
                }
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.deleteButton, styles.confirmDeleteButton]}
                onPress={handleEditSave}
              >
                <Text style={styles.confirmButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ProgressBar currentStep={2} />
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
  scrollContent: { width: "100%" },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  addCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  addCard: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "85%",
    borderRadius: 8,
  },
  addCardContent: { flexDirection: "row", alignItems: "center" },
  schoolCard: { width: "100%" },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "black" },
  addTitle: { color: "white", paddingLeft: 10 },
  editCard: {
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 8,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  schoolRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButtons: { flexDirection: "row" },
  iconButton: { marginLeft: 10 },
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
  dropdownText: { fontSize: 16, color: "#6b7280" },
  dropdownContainer: {
    position: "absolute",
    top: 170,
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
  dropdownItemText: { fontSize: 16, color: "#374151" },
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
  cancelButton: { backgroundColor: "grey" },
  saveButton: { backgroundColor: "green" },
  buttonText: { color: "white", fontWeight: "bold" },
});
