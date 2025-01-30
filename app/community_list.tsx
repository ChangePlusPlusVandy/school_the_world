import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

type Community = { id: number; name: string; country: string };

export default function CommunityList() {
  const country = useSearchParams().get("country") || "";
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchCommunities();
  }, [country]);

  const fetchCommunities = async () => {
    const fakeCommunities: Community[] = [
      { id: 1, name: "Longtanhu Park", country: "Guatemala" },
      { id: 2, name: "Chongwenmen", country: "Guatemala" },
      { id: 3, name: "Fuguiyuan No.1", country: "Guatemala" },
      { id: 4, name: "Donghuashi Street", country: "Honduras" },
      { id: 5, name: "Huashizaoyuan", country: "Honduras" },
      { id: 6, name: "Temple of Heaven", country: "Honduras" },
      { id: 7, name: "Forbidden City", country: "Panama" },
      { id: 8, name: "Tiananmen", country: "Panama" },
      { id: 9, name: "Yuyuantan Park", country: "Panama" },
    ];
    const filteredCommunities = fakeCommunities.filter(
      (community) => community.country === country
    );
    setCommunities(filteredCommunities);
  };

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/country_list")}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="home" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="share-social" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Choose Community</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#aaa"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#aaa"
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((community) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/school_list",
                  params: {
                    communityName: community.name,
                    communityId: community.id,
                    country: country,
                  },
                });
              }}
              key={community.id}
              style={styles.communityBox}
            >
              <Text style={styles.communityName}>{community.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResults}>No communities found</Text>
        )}
      </ScrollView>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  communityBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginBottom: 12,
    alignItems: "center",
  },
  communityName: {
    fontSize: 16,
  },
  noResults: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    marginVertical: 16,
    overflow: "hidden",
  },
  progressFill: {
    width: "10%",
    height: "100%",
    backgroundColor: "#4169e1",
  },
});
