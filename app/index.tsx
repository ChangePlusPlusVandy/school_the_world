import { StyleSheet, View, Text, Pressable } from "react-native"
import { Link } from "expo-router"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { useEffect } from "react"
import { firebaseSync } from "@/db/sync"

export default function Homepage() {
  useEffect(() => {
    firebaseSync.initDatabase();
  }, [])

  return (
    <View style={styles.container}>
      <MaterialIcons name="home" size={32} color="darkblue" />

      <Text style={styles.title}>Choose Page</Text>

      <Link href="/country_list" asChild>
        <Pressable style={styles.card}>
          <View>
            <View style={styles.iconContainer}>
              <Feather name="clipboard" size={24} color="darkblue" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Data Tracking</Text>
              <Text style={styles.cardSubtitle}>Create new data entries</Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <Link href="/data_visualizations" asChild>
        <Pressable style={styles.card}>
          <View>
            <View style={styles.iconContainer}>
              <Feather name="bar-chart-2" size={24} color="darkblue" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Data Visualizations</Text>
              <Text style={styles.cardSubtitle}>View and export graphs</Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <Pressable 
        style={styles.syncButton} 
        onPress={() => {firebaseSync.syncData()}}
      >
        <Text style={styles.syncButtonText}>Sync</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
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
  card: {
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
  iconContainer: {
    backgroundColor: "#e8eaf6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    width: 48,
    height: 48,
  },
  textContainer: {
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "gray",
  },
  syncButton: {
    backgroundColor: "#2196F3", // Blue color
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "25%",
    alignItems: "center",
    marginTop: 16,
  },
  syncButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})