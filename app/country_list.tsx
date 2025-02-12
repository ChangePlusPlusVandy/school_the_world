import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function DataTrackingCountry() {
  const [searchQuery, setSearchQuery] = useState("")
  const [countries, setCountries] = useState(["Guatemala", "Honduras", "Panama"])
  const [modalVisible, setModalVisible] = useState(false)
  const [newCountry, setNewCountry] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement filtering logic here
    console.log(query);
  };

  const handleAddCountry = () => {
    if (newCountry) {
      setCountries([...countries, newCountry])
      setNewCountry("")
      setModalVisible(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <MaterialIcons name="arrow-back" size={30} />
        <MaterialIcons name="home-filled" size={50} />
        <MaterialIcons name="upload" size={40} />
      </View>

      <Text style={styles.title}>Choose Country</Text>
      <TextInput style={styles.input} placeholder="Search..." />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add a Country</Text>
        </TouchableOpacity>

      {countries.map((country, index) => (
        <View key={index} style={styles.buttonContainer}>
          <Link href="/" style={styles.buttonLabels}>
            {country}
          </Link>
        </View>
      ))}

      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add a Country</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Country Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter country name"
                  value={newCountry}
                  onChangeText={setNewCountry}
                />
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleAddCountry}>
                <Text style={styles.continueButtonText}>Add and Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    alignItems: "center",
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
});
