import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

enum FilterType {
  Country = "Country",
  Community = "Community",
  StartDate = "Start Date",
  EndDate = "End Date",
}

type FilterScreenProps = {
  filterName: FilterType;
  options: string[];
  goBack: () => void;
};

export default function FilterPage() {
  const navigation = useNavigation();
  const [expandAddFiltersMenu, setExpandAddFiltersMenu] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType | null>(null);

  useEffect(() => {
    setExpandAddFiltersMenu(false);
    setCurrentFilter(null);
  }, []);

  const testFilterOptions: Record<FilterType, string[]> = {
    [FilterType.Country]: ["Guatemala", "Honduras", "Panama"],
    [FilterType.Community]: ["Community A", "Community B", "Community C"],
    [FilterType.StartDate]: [],
    [FilterType.EndDate]: [],
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.topBarButtons}
        >
          <Feather name="chevron-left" size={24} color="darkblue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <AntDesign name="home" size={36} color="darkblue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.topBarButtons}>
          <MaterialCommunityIcons
            name="export-variant"
            size={20}
            color="darkblue"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Filtered Data</Text>
      {!currentFilter ? (
        <View style={styles.addFilters}>
          <TouchableOpacity
            style={styles.addFiltersHeader}
            onPress={() => setExpandAddFiltersMenu(!expandAddFiltersMenu)}
          >
            <Text style={styles.addFiltersHeaderTitle}>Add Filters</Text>
            {expandAddFiltersMenu ? (
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.addFiltersHeaderClearAll}>Clear All</Text>
              </TouchableOpacity>
            ) : (
              <AntDesign name="filter" size={15} color="darkblue" />
            )}
          </TouchableOpacity>

          {expandAddFiltersMenu && (
            <View style={styles.addFiltersMainDropdown}>
              <FlatList
                data={Object.values(FilterType)}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.addFiltersMainDropdownItem}
                    onPress={() => setCurrentFilter(item)}
                  >
                    <Text style={styles.addFiltersMainDropdownItemText}>
                      {item}
                    </Text>
                    <AntDesign name="right" size={12} color="black" />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      ) : (
        <SpecificFilter
          filterName={currentFilter}
          options={testFilterOptions[currentFilter]}
          goBack={() => setCurrentFilter(null)}
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

const SpecificFilter: React.FC<FilterScreenProps> = ({
  filterName,
  options,
  goBack,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [filterName]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.addFilters}>
      <View style={styles.addFiltersChildDropdownHeader}>
        <TouchableOpacity onPress={() => goBack()}>
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
              onPress={() => setSelected(item)}
            >
              <Text style={styles.addFiltersMainDropdownItemText}>{item}</Text>
              {selected === item && (
                <AntDesign name="check" size={12} color="green" />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EFF2F7",
    paddingTop: 40,
    paddingHorizontal: "5%",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  topBarButtons: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#e8eaf6",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { paddingTop: 40, fontSize: 25, fontWeight: "bold" },
  addFilters: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    marginHorizontal: "10%",
    marginTop: 20,
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
