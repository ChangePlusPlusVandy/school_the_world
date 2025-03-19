import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect } from "react";
import { createDatabase, DatabaseService } from "../db/base";
import { Entry } from "../db/entry";
import { useRoute } from "@react-navigation/native";
import { Link } from "expo-router";

type Time = {
  hour: string;
  minute: string;
  period: string;
};

type State = {
  id: string;
  date: {
    month: string;
    day: string;
    year: string;
  };
  times: {
    arrivalTime: Time;
    teacherArrivalTime: Time;
    childrenArrivalTime: Time;
    classStartTime: Time;
    classEndTime: Time;
  };
  recessDropdown: boolean;
  schoolTimeDropdown: boolean;
  teacherDropdown: boolean;
  programType: string;
  numChildren: string;
  numParents: string;
  absentTeachers: string;
  cleanliness: string;
  playgroundUse: string;
  recessTime: string;
  schoolTime: string;
  sinkUse: string;
  decorationUse: string;
  classroomUse: string;
  observations: string;
};

export default function SchoolInfo() {
  const handleBack = () => console.log("Back button pressed");
  const handleHome = () => console.log("Home button pressed");
  const handleShare = () => console.log("Share button pressed");
  const [db, setDb] = useState<DatabaseService | null>(null);
  const route = useRoute();
  const { country, community, program } = route.params as {
    country: string;
    community: string;
    program: string;
  };

  const [state, setState] = useState({
    id: "",
    date: {
      month: "",
      day: "",
      year: "",
    },
    times: {
      arrivalTime: { hour: "", minute: "", period: "AM" },
      teacherArrivalTime: { hour: "", minute: "", period: "AM" },
      childrenArrivalTime: { hour: "", minute: "", period: "AM" },
      classStartTime: { hour: "", minute: "", period: "AM" },
      classEndTime: { hour: "", minute: "", period: "PM" },
    },
    recessDropdown: false,
    schoolTimeDropdown: false,
    teacherDropdown: false,
    programType: "",
    numChildren: "",
    numParents: "",
    absentTeachers: "",
    cleanliness: "",
    playgroundUse: "",
    recessTime: "",
    schoolTime: "",
    sinkUse: "",
    decorationUse: "",
    classroomUse: "",
    observations: "",
  });
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

  const handleInputChange = (name: keyof State, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (
    category: keyof State,
    subcategory: string,
    field: string,
    value: string
  ) => {
    setState((prevState) => {
      // Ensure category exists and is an object
      const updatedCategory = {
        ...(prevState[category] as Record<string, any>),
      };

      // Ensure subcategory exists and is an object
      const updatedSubcategory = {
        ...(updatedCategory[subcategory] ?? {}), // Ensure it exists
        [field]: value, // Update the field
      };

      updatedCategory[subcategory] = updatedSubcategory; // Assign back to category

      return {
        ...prevState,
        [category]: updatedCategory, // Assign updated category back to state
      };
    });
  };

  const handleDateChange = (field: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      date: {
        ...prevState.date,
        [field]: value,
      },
    }));
  };

  const recessTimes = [
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
    "60",
  ];
  const count = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const cleanlinessOptions = ["1", "2", "3", "4", "5"];
  const programTypeOptions = ["Early Childhood", "Primary", "Middle"];
  const usageOptions = ["Yes", "No", "This observation could not be made"];
  const decorationOptions = [
    "Yes, all of them",
    "Yes, more than half",
    "Yes, less than half",
    "No, none",
  ];

  const clearForm = () => {
    setState({
      id: "",
      date: {
        month: "",
        day: "",
        year: "",
      },
      times: {
        arrivalTime: { hour: "", minute: "", period: "AM" },
        teacherArrivalTime: { hour: "", minute: "", period: "AM" },
        childrenArrivalTime: { hour: "", minute: "", period: "AM" },
        classStartTime: { hour: "", minute: "", period: "AM" },
        classEndTime: { hour: "", minute: "", period: "PM" },
      },
      recessDropdown: false,
      schoolTimeDropdown: false,
      teacherDropdown: false,
      programType: "",
      numChildren: "",
      numParents: "",
      absentTeachers: "",
      cleanliness: "",
      playgroundUse: "",
      recessTime: "",
      schoolTime: "",
      sinkUse: "",
      decorationUse: "",
      classroomUse: "",
      observations: "",
    });
  };

  const submitForm = async () => {
    if (!db) {
      console.error("Database not initialized");
      return;
    }

    const entry = {
      arrival_date: `${state.date.year}-${state.date.month}-${state.date.day}`,
      arrival_time: `${state.times.arrivalTime.hour}:${state.times.arrivalTime.minute} ${state.times.arrivalTime.period}`,
      time_teachers_arrive: `${state.times.teacherArrivalTime.hour}:${state.times.teacherArrivalTime.minute} ${state.times.teacherArrivalTime.period}`,
      time_children_leave: `${state.times.childrenArrivalTime.hour}:${state.times.childrenArrivalTime.minute} ${state.times.childrenArrivalTime.period}`,
      time_classes_start: `${state.times.classStartTime.hour}:${state.times.classStartTime.minute} ${state.times.classStartTime.period}`,
      time_classes_end: `${state.times.classEndTime.hour}:${state.times.classEndTime.minute} ${state.times.classEndTime.period}`,
      recess_time: state.recessTime,
      num_hours_children: state.schoolTime,
      num_teachers_absent: state.absentTeachers,
      cleanliness: state.cleanliness,
      playground_used: state.playgroundUse,
      sinks_used: state.sinkUse,
      classroom_decor: state.decorationUse,
      classrooms_used: state.classroomUse,
      observations: state.observations,
      program_type: state.programType,
      num_children: state.numChildren,
      num_parents: state.numParents,
      country: country,
      community: community,
      program: program,
      last_updated: Date.now(),
    };

    try {
      const newEntry = await db.createEntry(entry);
      console.log("Entry created successfully:", newEntry);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };
  return (
    <View style={styles.container}>
      {/* Header, change to a common header in the future  */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <View style={styles.iconWrapper}>
            <FontAwesome name="arrow-left" size={20} color="#374151" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleHome}>
          <FontAwesome name="home" size={48} color="#1e293b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <View style={styles.iconWrapper}>
            <FontAwesome name="share-alt" size={20} color="#374151" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.schoolName}>Community Name</Text>
        <Text style={styles.schoolLocation}>Country</Text>
        {/* Past Entries Button */}
        <TouchableOpacity style={styles.pastEntriesButton}>
          <Link
            href={`/past_entries?country=${country}&community=${community}&program=${program}`}
          >
            <Text style={styles.pastEntriesText}>Past Entries</Text>
          </Link>
        </TouchableOpacity>
        {/* Create a New Entry Section */}
        <Text style={styles.sectionTitle}>Create a New Entry</Text>
        {/* Arrival Date */}
        <View style={styles.entryBox}>
          <Text>Arrival Date:</Text>
          <View style={styles.dateInputContainer}>
            <TextInput
              value={state.date.month}
              onChangeText={(text) => handleDateChange("month", text)}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              style={styles.dateInput}
            />
            <Text style={styles.separator}>/</Text>
            <TextInput
              value={state.date.day}
              onChangeText={(text) => handleDateChange("day", text)}
              placeholder="DD"
              keyboardType="numeric"
              maxLength={2}
              style={styles.dateInput}
            />
            <Text style={styles.separator}>/</Text>
            <TextInput
              value={state.date.year}
              onChangeText={(text) => handleDateChange("year", text)}
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              style={styles.dateInput}
            />
          </View>
        </View>
        {/* Arrival Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Arrival Time</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              value={state.times.arrivalTime.hour}
              onChangeText={(text) =>
                handleNestedInputChange("times", "arrivalTime", "hour", text)
              }
              placeholder="HH"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              value={state.times.arrivalTime.minute}
              onChangeText={(text) =>
                handleNestedInputChange("times", "arrivalTime", "minute", text)
              }
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  times: {
                    ...prev.times,
                    arrivalTime: {
                      ...prev.times.arrivalTime,
                      period:
                        prev.times.arrivalTime.period === "AM" ? "PM" : "AM",
                    },
                  },
                }))
              }
            >
              <Text style={styles.dropdownText}>
                {state.times.arrivalTime.period}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Program Type */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Program Type</Text>
          {programTypeOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => handleInputChange("programType", option)}
            >
              <View style={styles.radioCircle}>
                {state.programType === option && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Number of Children */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Number of children attended</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a number"
            value={state.numChildren}
            onChangeText={(text) => handleInputChange("numChildren", text)}
          />
        </View>
        {/* Number of Parents */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Number of parents attended</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a number"
            value={state.numParents}
            onChangeText={(text) => handleInputChange("numParents", text)}
          />
        </View>
        {/* Teacher Arrival Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Time teachers arrive to school</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              value={state.times.teacherArrivalTime.hour}
              onChangeText={(text) =>
                handleNestedInputChange(
                  "times",
                  "teacherArrivalTime",
                  "hour",
                  text
                )
              }
              placeholder="HH"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              value={state.times.teacherArrivalTime.minute}
              onChangeText={(text) =>
                handleNestedInputChange(
                  "times",
                  "teacherArrivalTime",
                  "minute",
                  text
                )
              }
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  times: {
                    ...prev.times,
                    teacherArrivalTime: {
                      ...prev.times.teacherArrivalTime,
                      period:
                        prev.times.teacherArrivalTime.period === "AM"
                          ? "PM"
                          : "AM",
                    },
                  },
                }))
              }
            >
              <Text style={styles.dropdownText}>
                {state.times.teacherArrivalTime.period}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Children Arrival Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Time children arrive to school</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              value={state.times.childrenArrivalTime.hour}
              onChangeText={(text) =>
                handleNestedInputChange(
                  "times",
                  "childrenArrivalTime",
                  "hour",
                  text
                )
              }
              placeholder="HH"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              value={state.times.childrenArrivalTime.minute}
              onChangeText={(text) =>
                handleNestedInputChange(
                  "times",
                  "childrenArrivalTime",
                  "minute",
                  text
                )
              }
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  times: {
                    ...prev.times,
                    childrenArrivalTime: {
                      ...prev.times.childrenArrivalTime,
                      period:
                        prev.times.childrenArrivalTime.period === "AM"
                          ? "PM"
                          : "AM",
                    },
                  },
                }))
              }
            >
              <Text style={styles.dropdownText}>
                {state.times.childrenArrivalTime.period}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Class Start Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Time Classes Start</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              value={state.times.classStartTime.hour}
              onChangeText={(text) =>
                handleNestedInputChange("times", "classStartTime", "hour", text)
              }
              placeholder="HH"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              value={state.times.classStartTime.minute}
              onChangeText={(text) =>
                handleNestedInputChange(
                  "times",
                  "classStartTime",
                  "minute",
                  text
                )
              }
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  times: {
                    ...prev.times,
                    classStartTime: {
                      ...prev.times.classStartTime,
                      period:
                        prev.times.classStartTime.period === "AM" ? "PM" : "AM",
                    },
                  },
                }))
              }
            >
              <Text style={styles.dropdownText}>
                {state.times.classStartTime.period}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Class End Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Time Classes End</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              value={state.times.classEndTime.hour}
              onChangeText={(text) =>
                handleNestedInputChange("times", "classEndTime", "hour", text)
              }
              placeholder="HH"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              value={state.times.classEndTime.minute}
              onChangeText={(text) =>
                handleNestedInputChange("times", "classEndTime", "minute", text)
              }
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              style={styles.timeInput}
            />
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setState((prev) => ({
                  ...prev,
                  times: {
                    ...prev.times,
                    classEndTime: {
                      ...prev.times.classEndTime,
                      period:
                        prev.times.classEndTime.period === "AM" ? "PM" : "AM",
                    },
                  },
                }))
              }
            >
              <Text style={styles.dropdownText}>
                {state.times.classEndTime.period}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dropdown for Recess Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Recess Time (Minutes)</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() =>
              handleInputChange("recessDropdown", !state.recessDropdown)
            }
          >
            <Text style={styles.dropdownText}>{state.recessTime}</Text>
          </TouchableOpacity>
          {state.recessDropdown && (
            <View style={styles.dropdownList}>
              {recessTimes.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleInputChange("recessTime", time);
                    handleInputChange("recessDropdown", false);
                  }}
                >
                  <Text>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* School Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>School Time (Hours)</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() =>
              handleInputChange("schoolTimeDropdown", !state.schoolTimeDropdown)
            }
          >
            <Text style={styles.dropdownText}>{state.schoolTime}</Text>
          </TouchableOpacity>
          {state.schoolTimeDropdown && (
            <View style={styles.dropdownList}>
              {count.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleInputChange("schoolTime", c);
                    handleInputChange("schoolTimeDropdown", false);
                  }}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Teachers absent */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Number of teachers absent</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() =>
              handleInputChange("teacherDropdown", !state.teacherDropdown)
            }
          >
            <Text style={styles.dropdownText}>{state.absentTeachers}</Text>
          </TouchableOpacity>
          {state.teacherDropdown && (
            <View style={styles.dropdownList}>
              {count.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleInputChange("absentTeachers", c);
                    handleInputChange("teacherDropdown", false);
                  }}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Cleanliness */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>School cleanliness</Text>
          <Text style={styles.cleanlinessText}>Not Clean</Text>
          {cleanlinessOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => handleInputChange("cleanliness", option)}
            >
              <Text style={styles.radioTextSecondary}>{option}</Text>
              <View style={styles.radioCircle}>
                {state.cleanliness === option && (
                  <View style={styles.radioSelected} />
                )}
              </View>
            </TouchableOpacity>
          ))}
          <Text style={styles.cleanlinessText}>Clean</Text>
        </View>
        {/* Playground Use */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Was the playground used?</Text>
          {usageOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => handleInputChange("playgroundUse", option)}
            >
              <View style={styles.radioCircle}>
                {state.playgroundUse === option && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Sink Usage */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Were the school sinks used?</Text>
          {usageOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => handleInputChange("sinkUse", option)}
            >
              <View style={styles.radioCircle}>
                {state.sinkUse === option && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Classroom Decoration */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Classroom decorations</Text>
          {decorationOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => handleInputChange("decorationUse", option)}
            >
              <View style={styles.radioCircle}>
                {state.decorationUse === option && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Classroom Use */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>
            Are there classrooms not being used?
          </Text>
          {usageOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => handleInputChange("classroomUse", option)}
            >
              <View style={styles.radioCircle}>
                {state.classroomUse === option && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Final Observations */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>
            Other school-related observations
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter observations"
            value={state.observations}
            onChangeText={(text) => handleInputChange("observations", text)}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={clearForm}>
            <Text style={styles.linkButtonText}>Clear Form</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  dateInput: {
    borderBottomWidth: 1,
    borderColor: "#000",
    width: 40,
    height: 40,
    textAlign: "center",
  },
  separator: {
    marginHorizontal: 5,
    fontSize: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  iconWrapper: {
    backgroundColor: "#e0e7ff",
    borderRadius: 12,
    padding: 8,
  },
  content: {
    alignItems: "center",
  },
  schoolName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 20,
  },
  schoolLocation: {
    fontSize: 22,
    color: "#6b7280",
    marginBottom: 20,
  },
  pastEntriesButton: {
    backgroundColor: "#1c2869",
    width: "90%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pastEntriesText: {
    color: "#ffffff",
    fontSize: 20,
  },
  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 22,
    color: "#374151",
    marginBottom: 20,
  },
  entryBox: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 25,
    marginBottom: 20,
    width: "100%",
    elevation: 2,
  },
  entryLabel: {
    marginTop: 5,
    fontSize: 18,
    color: "black",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingVertical: 5,
    marginBottom: 25,
    marginTop: 25,
  },
  dropdown: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: "#6b7280",
  },
  dropdownList: {
    marginTop: 5,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#374151",
  },
  radioText: {
    fontSize: 16,
    color: "#374151",
  },
  radioTextSecondary: {
    paddingLeft: 50,
    paddingRight: 20,
    fontSize: 16,
    color: "#374151",
  },
  cleanlinessText: {
    paddingTop: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: "#374151",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    top: 10,
    right: 0,
  },
  submitButton: {
    backgroundColor: "#0f1741",
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 150,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  linkButton: {
    padding: 10,
  },
  linkButtonText: {
    color: "grey",
    fontSize: 16,
    textAlign: "center",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  timeInput: {
    borderBottomWidth: 1,
    borderColor: "#000",
    width: 40,
    height: 40,
    textAlign: "center",
    marginHorizontal: 5,
  },
});
