import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createDatabase, DatabaseService } from "../db/base";

enum FilterType {
  Country = "Country",
  Community = "Community",
  StartDate = "Start Date",
  EndDate = "End Date",
}

type ChildFilterProps = {
  filterName: FilterType;
  options: string[];
  goBack: () => void;
  currentSelectedObject: Record<FilterType, any>;
  saveFilter: (filterName: FilterType, value: any) => void;
};

const ChildFilter: React.FC<ChildFilterProps> = ({
  filterName,
  options,
  goBack,
  currentSelectedObject,
  saveFilter,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.addFilters}>
      <View style={styles.addFiltersChildDropdownHeader}>
        <TouchableOpacity onPress={goBack}>
          <AntDesign name="left" size={15} color="black" />
        </TouchableOpacity>
        <Text style={styles.addFiltersChildDropdownHeaderTitle}>
          {filterName}
        </Text>
      </View>

      <View style={styles.addFiltersMainDropdown}>
        <View style={styles.addFiltersChildDropdownSearchContainer}>
          <Feather
            name="search"
            size={18}
            color="gray"
            style={styles.addFiltersChildDropdownSearchIcon}
          />
          <TextInput
            style={styles.addFiltersChildDropdownSearchInput}
            placeholder="Search..."
            placeholderTextColor="gray"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.addFiltersMainDropdownItem}
              onPress={() => saveFilter(filterName, item)}
            >
              <Text style={styles.addFiltersMainDropdownItemText}>{item}</Text>
              {currentSelectedObject[filterName] === item && (
                <AntDesign name="check" size={12} color="green" />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default function FilterPage() {
  const navigation = useNavigation();
  const [expandAddFiltersMenu, setExpandAddFiltersMenu] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState<FilterType | null>(
    null
  );
  const [currentFilterObject, setCurrentFilterObject] = useState<
    Record<FilterType, any>
  >({
    [FilterType.Country]: null,
    [FilterType.Community]: null,
    [FilterType.StartDate]: null,
    [FilterType.EndDate]: null,
  });

  const [db, setDb] = useState<DatabaseService | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [communities, setCommunities] = useState<string[]>([]);

  // Initialize database and fetch countries
  useEffect(() => {
    const initializeDb = async () => {
      try {
        const databaseService = await createDatabase();
        setDb(databaseService);
        const fetchedCountries = await databaseService.getAllCountries();
        if (fetchedCountries) {
          setCountries(fetchedCountries.map((country) => country.name));
        }
      } catch (error) {
        console.error("Error initializing database: ", error);
      }
    };

    initializeDb();
  }, []);

  // Fetch communities based on selected country (or all communities if no country is selected)
  useEffect(() => {
    const fetchCommunities = async () => {
      if (db) {
        try {
          let fetchedCommunities: string[] = [];

          if (currentFilterObject[FilterType.Country]) {
            // Fetch communities for the selected country
            const communitiesForCountry = await db.getCommunitiesByCountry(
              currentFilterObject[FilterType.Country]
            );
            if (communitiesForCountry) {
              fetchedCommunities = communitiesForCountry.map(
                (community) => community.name
              );
            }
          } else {
            // Fetch communities for all countries
            const allCountries = await db.getAllCountries();
            if (allCountries) {
              for (const country of allCountries) {
                const communitiesForCountry = await db.getCommunitiesByCountry(
                  country.name
                );
                if (communitiesForCountry) {
                  fetchedCommunities = [
                    ...fetchedCommunities,
                    ...communitiesForCountry.map((community) => community.name),
                  ];
                }
              }
            }
          }

          setCommunities(fetchedCommunities);
        } catch (error) {
          console.error("Error fetching communities: ", error);
        }
      }
    };

    fetchCommunities();
  }, [currentFilterObject[FilterType.Country], db]);

  const handleClearFilters = () => {
    setCurrentFilterObject({
      [FilterType.Country]: null,
      [FilterType.Community]: null,
      [FilterType.StartDate]: null,
      [FilterType.EndDate]: null,
    });
  };

  const handleSaveFilter = (filterName: FilterType, value: any) => {
    setCurrentFilterObject((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 10 }}
        >
          <MaterialIcons name="chevron-left" size={30} color="darkblue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="home" size={32} color="darkblue" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          style={{ position: "absolute", right: 10 }}
        >
          <MaterialCommunityIcons
            name="export-variant"
            size={24}
            color="darkblue"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Filtered Data</Text>

      {!currentFilterType ? (
        <View style={styles.addFilters}>
          <TouchableOpacity
            style={styles.addFiltersHeader}
            onPress={() => setExpandAddFiltersMenu(!expandAddFiltersMenu)}
          >
            <Text style={styles.addFiltersHeaderTitle}>Add Filters</Text>
            {expandAddFiltersMenu ? (
              <TouchableOpacity onPress={handleClearFilters}>
                <Text style={styles.addFiltersHeaderClearAll}>Clear All</Text>
              </TouchableOpacity>
            ) : (
              <AntDesign name="filter" size={15} color="darkblue" />
            )}
          </TouchableOpacity>

          {expandAddFiltersMenu && (
            <View style={styles.addFiltersMainDropdown}>
              <TouchableOpacity 
              style={styles.addFiltersMainDropdownItem}
              onPress={()=> {setCurrentFilterType(FilterType.StartDate
              )}}>
                <Text style={styles.addFiltersMainDropdownItemText}>
                  {FilterType.StartDate}
                </Text>
                <AntDesign name="right" size={12} color="black"/>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <ChildFilter
          filterName={currentFilterType}
          options={
            currentFilterType === FilterType.Country
              ? countries
              : currentFilterType === FilterType.Community
                ? communities
                : []
          }
          goBack={() => setCurrentFilterType(null)}
          currentSelectedObject={currentFilterObject}
          saveFilter={handleSaveFilter}
        />
      )}

      <View>
        <Text>Box 1</Text>
      </View>
      <View>
        <Text>Box 2</Text>
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
  addFilters: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: "85%",
    marginBottom: 16,
  },
  addFiltersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addFiltersHeaderTitle: {
    fontSize: 16,
  },
  addFiltersHeaderClearAll: {
    fontSize: 15,
    color: "red",
  },
  addFiltersMainDropdown: {
    marginVertical: 5,
  },
  addFiltersMainDropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  addFiltersMainDropdownItemText: {
    fontSize: 14,
  },
  addFiltersChildDropdownHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addFiltersChildDropdownHeaderTitle: {
    marginLeft: 10,
    fontSize: 16,
  },
  addFiltersChildDropdownSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    paddingVertical: 10,
    marginHorizontal: 30,
    marginBottom: 10,
  },
  addFiltersChildDropdownSearchIcon: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  addFiltersChildDropdownSearchInput: {
    flex: 1,
    fontSize: 14,
  },
});
