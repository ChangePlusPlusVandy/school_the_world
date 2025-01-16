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

export default function SchoolInfo() {
  const handleBack = () => console.log("Back button pressed");
  const handleHome = () => console.log("Home button pressed");
  const handleShare = () => console.log("Share button pressed");

  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [teacherArrivalTime, setTeacherArrivalTime] = useState("");
  const [childrenArrivalTime, setChildrenArrivalTime] = useState("");
  const [classStartTime, setClassStartTime] = useState("");
  const [classEndTime, setClassEndTime] = useState("");
  const [recessDropdown, setRecessDropdown] = useState(false);
  const [schoolTimeDropdown, setSchoolTimeDropdown] = useState(false);
  const [teacherDropdown, setTeacherDropdown] = useState(false);
  const [programType, setProgramType] = useState("");
  const [numChildren, setNumChildren] = useState("");
  const [numParents, setNumParents] = useState("");
  const [recessTime, setRecessTime] = useState("");
  const [schoolTime, setSchoolTime] = useState("");
  const [absentTeachers, setAbsentTeachers] = useState("");
  const [cleanliness, setCleanliness] = useState(0);
  const [playgroundUse, setPlaygroundUse] = useState("");
  const [sinkUse, setSinkUse] = useState("");
  const [decorationUse, setDecorationUse] = useState("");
  const [classroomUse, setClassroomUse] = useState("");
  const [observations, setObservations] = useState("");

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
  const programTypeOptions = ["Early Childhood", "Primary", "Middle"];
  const usageOptions = ["Yes", "No", "This observation could not be made"];
  const decorationOptions = [
    "Yes, all of them",
    "Yes, more than half",
    "Yes, less than half",
    "No, none",
  ];

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
        <Text style={styles.schoolName}>SCHOOL NAME</Text>
        <Text style={styles.schoolLocation}>Community, Country</Text>
        {/* Past Entries Button */}
        <TouchableOpacity style={styles.pastEntriesButton}>
          <Text style={styles.pastEntriesText}>Past Entries</Text>
        </TouchableOpacity>
        {/* Create a New Entry Section */}
        <Text style={styles.sectionTitle}>Create a New Entry</Text>
        {/* Arrival Date */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Arrival Date:</Text>
          <View style={styles.dateInputContainer}>
            <TextInput
              value={month}
              onChangeText={setMonth}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              style={styles.dateInput}
            />
            <Text style={styles.separator}>/</Text>
            <TextInput
              value={day}
              onChangeText={setDay}
              placeholder="DD"
              keyboardType="numeric"
              maxLength={2}
              style={styles.dateInput}
            />
            <Text style={styles.separator}>/</Text>
            <TextInput
              value={year}
              onChangeText={setYear}
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
          <TextInput
            style={styles.input}
            placeholder="__:__ AM"
            value={arrivalTime}
            onChangeText={setArrivalTime}
          />
        </View>
        {/* Program Type */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Program Type</Text>
          {programTypeOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => setProgramType(option)}
            >
              <View style={styles.radioCircle}>
                {programType === option && (
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
            value={numChildren}
            onChangeText={setNumChildren}
          />
        </View>
        {/* Number of Parents */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Number of parents attended</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a number"
            value={numParents}
            onChangeText={setNumParents}
          />
        </View>
        {/* Teacher Arrival Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Time Teachers Arrive to School</Text>
          <TextInput
            style={styles.input}
            placeholder="__:__ AM"
            value={teacherArrivalTime}
            onChangeText={setTeacherArrivalTime}
          />
        </View>
        {/* Children Arrival Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Time Children Arrive to School</Text>
          <TextInput
            style={styles.input}
            placeholder="__:__ AM"
            value={childrenArrivalTime}
            onChangeText={setChildrenArrivalTime}
          />
        </View>
        {/* Class Start Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Time Classes Start</Text>
          <TextInput
            style={styles.input}
            placeholder="__:__ AM"
            value={classStartTime}
            onChangeText={setClassStartTime}
          />
        </View>
        {/* Class End Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Time Classes End</Text>
          <TextInput
            style={styles.input}
            placeholder="__:__ PM"
            value={classEndTime}
            onChangeText={setClassEndTime}
          />
        </View>
        {/* Dropdown for Recess Time */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Recess Time (Minutes)</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setRecessDropdown(!recessDropdown)}
          >
            <Text style={styles.dropdownText}>{recessTime}</Text>
          </TouchableOpacity>
          {recessDropdown && (
            <View style={styles.dropdownList}>
              {recessTimes.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setRecessTime(time);
                    setRecessDropdown(false);
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
            onPress={() => setSchoolTimeDropdown(!schoolTimeDropdown)}
          >
            <Text style={styles.dropdownText}>{schoolTime}</Text>
          </TouchableOpacity>
          {schoolTimeDropdown && (
            <View style={styles.dropdownList}>
              {count.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSchoolTime(c);
                    setSchoolTimeDropdown(false);
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
          <Text style={styles.entryLabel}>Time in school (Hours)</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setTeacherDropdown(!teacherDropdown)}
          >
            <Text style={styles.dropdownText}>{absentTeachers}</Text>
          </TouchableOpacity>
          {teacherDropdown && (
            <View style={styles.dropdownList}>
              {count.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setAbsentTeachers(c);
                    setTeacherDropdown(false);
                  }}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Playground Use */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>Was the playground used?</Text>
          {usageOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => setPlaygroundUse(option)}
            >
              <View style={styles.radioCircle}>
                {playgroundUse === option && (
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
              onPress={() => setSinkUse(option)}
            >
              <View style={styles.radioCircle}>
                {sinkUse === option && <View style={styles.radioSelected} />}
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
              onPress={() => setDecorationUse(option)}
            >
              <View style={styles.radioCircle}>
                {decorationUse === option && (
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
              onPress={() => setClassroomUse(option)}
            >
              <View style={styles.radioCircle}>
                {classroomUse === option && (
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
            value={observations}
            onChangeText={setObservations}
          />
        </View>
        <View style={styles.submitButton}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
    width: 60,
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
  submitButton: {
    backgroundColor: "#0000FF", // Blue color
    width: "30%", // Smaller width
    height: 40, // Smaller height
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginBottom: 20,
    alignSelf: "flex-start", // Float to the left
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
});
