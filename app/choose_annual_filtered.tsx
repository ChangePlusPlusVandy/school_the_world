import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function Choose_Annual_Filtered() {
  return (
    <View style={styles.container}>
      {/* top line */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {}}
          style={{ position: "absolute", left: 10 }}
        >
          <MaterialIcons name="chevron-left" size={30} color="darkblue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="home" size={32} color="darkblue" />
        </TouchableOpacity>
      </View>

      {/* title section */}
      <Text style={styles.title}>Choose Type</Text>

      {/* Annual data link */}
      <View style={styles.box1Container}>
        <Link href="/choose_annual_filtered" style={styles.box1Text}>
          Annual Data
        </Link>
      </View>

      {/* Filtered data link */}
      <View style={styles.box1Container}>
        <Link href="/choose_annual_filtered" style={styles.box1Text}>
          Filtered Data
        </Link>
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
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    flexDirection: "row",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 32,
    paddingBottom: "3%",
  },
  box1Text: {
    fontSize: 20,
    fontWeight: 700,
    color: "#000",
    fontStyle: "normal",
    letterSpacing: 0.75,
    fontFamily: "Plus Jakarta Sans",
  },
  box1Container: {
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
  topLineContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
