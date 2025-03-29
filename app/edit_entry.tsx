import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { createDatabase, DatabaseService } from '../db/base';
import { Entry } from '../db/entry';
import ProgressBar from './components/ProgressBar';

type Time = {
  hour: string;
  minute: string;
  period: string;
};

type State = {
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

export default function EditEntryScreen() {
  const { entryId } = useLocalSearchParams();
  const [db, setDb] = useState<DatabaseService | null>(null);
  const [state, setState] = useState<State>({
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

  const recessTimes = ["10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60"];
  const count = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const cleanlinessOptions = ["1", "2", "3", "4", "5"];
  const usageOptions = ["Yes", "No", "This observation could not be made"];
  const decorationOptions = ["Yes, all of them", "Yes, more than half", "Yes, less than half", "No, none"];

  // Initialize database
  useEffect(() => {
    const initializeDb = async () => {
      const databaseService = await createDatabase();
      setDb(databaseService);
    };

    initializeDb();
  }, []);

  // Fetch entry data
  useEffect(() => {
    const fetchEntry = async () => {
      if (!db || !entryId) return;

      try {
        const entry = await db.getEntryById(entryId as string);
        if (entry) {
          // Parse arrival date
          const [year, month, day] = entry.arrival_date.split('-');
          
          // Convert boolean values from database to form values
          const convertBoolean = (value: string) => {
            if (value === "1") return "Yes";
            if (value === "0") return "No";
            return value;
          };

          setState(prev => ({
            ...prev,
            date: { month, day, year },
            times: {
              arrivalTime: parseTime(entry.arrival_time),
              teacherArrivalTime: parseTime(entry.time_teachers_arrive),
              childrenArrivalTime: parseTime(entry.time_children_leave),
              classStartTime: parseTime(entry.time_classes_start),
              classEndTime: parseTime(entry.time_classes_end),
            },
            numChildren: entry.num_children || "",
            numParents: entry.num_parents || "",
            recessTime: entry.recess_time || "",
            schoolTime: entry.num_hours_children || "",
            absentTeachers: entry.num_teachers_absent || "",
            cleanliness: entry.cleanliness || "",
            playgroundUse: convertBoolean(entry.playground_used),
            sinkUse: convertBoolean(entry.sinks_used),
            decorationUse: entry.classroom_decor || "",
            classroomUse: convertBoolean(entry.classrooms_used),
            observations: entry.observations || "",
          }));
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
      }
    };

    fetchEntry();
  }, [db, entryId]);

  const parseTime = (timeStr: string): Time => {
    const [time, period] = timeStr.split(' ');
    const [hour, minute] = time.split(':');
    return { hour, minute, period };
  };

  const handleInputChange = (name: keyof State, value: any) => {
    setState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (
    category: keyof State,
    subcategory: string,
    field: string,
    value: string
  ) => {
    setState(prev => {
      const categoryValue = prev[category];
      if (typeof categoryValue !== 'object') {
        return prev;
      }

      return {
        ...prev,
        [category]: {
          ...categoryValue,
          [subcategory]: {
            ...(categoryValue as Record<string, any>)[subcategory],
            [field]: value,
          },
        },
      };
    });
  };

  const handleDateChange = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      date: {
        ...prev.date,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!db || !entryId) return;

    try {
      const entry = await db.getEntryById(entryId as string);
      if (!entry) return;

      const formatTime = (time: Time) => `${time.hour}:${time.minute} ${time.period}`;

      // Convert form values back to database format
      const convertToDbBoolean = (value: string) => {
        if (value === "Yes") return "1";
        if (value === "No") return "0";
        if (value === "This observation could not be made") return "2";
        return value;
      };

      const updatedEntry: Entry = {
        ...entry,
        arrival_date: `${state.date.year}-${state.date.month}-${state.date.day}`,
        arrival_time: formatTime(state.times.arrivalTime),
        time_teachers_arrive: formatTime(state.times.teacherArrivalTime),
        time_children_leave: formatTime(state.times.childrenArrivalTime),
        time_classes_start: formatTime(state.times.classStartTime),
        time_classes_end: formatTime(state.times.classEndTime),
        recess_time: state.recessTime,
        num_hours_children: state.schoolTime,
        num_teachers_absent: state.absentTeachers,
        cleanliness: state.cleanliness,
        playground_used: convertToDbBoolean(state.playgroundUse),
        sinks_used: convertToDbBoolean(state.sinkUse),
        classroom_decor: state.decorationUse,
        classrooms_used: convertToDbBoolean(state.classroomUse),
        observations: state.observations,
        num_children: state.numChildren,
        num_parents: state.numParents,
        last_updated: Date.now(),
      };

      await db.editEntry(entry?.country || '', entryId as string, updatedEntry);
      router.back();
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <View style={styles.iconWrapper}>
            <Feather name="chevron-left" size={20} color="#374151" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack}>
          <FontAwesome name="home" size={48} color="#1e293b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack}>
          <View style={styles.iconWrapper}>
            <Feather name="share" size={20} color="#374151" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.schoolName}>Community Name</Text>
        <Text style={styles.schoolLocation}>Country</Text>
        
        {/* Edit Entry Section */}
        <Text style={styles.sectionTitle}>Edit Entry</Text>
        
        {/* Date Input */}
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

        {/* Time Inputs */}
        <TimeInput
          label="Arrival Time"
          time={state.times.arrivalTime}
          onChange={(field, value) => handleNestedInputChange("times", "arrivalTime", field, value)}
        />

        {/* Number Inputs */}
        <FormInput
          label="Number of children attended"
          value={state.numChildren}
          onChangeText={(text) => handleInputChange("numChildren", text)}
        />
        <FormInput
          label="Number of parents attended"
          value={state.numParents}
          onChangeText={(text) => handleInputChange("numParents", text)}
        />

        <TimeInput
          label="Time teachers arrive to school"
          time={state.times.teacherArrivalTime}
          onChange={(field, value) => handleNestedInputChange("times", "teacherArrivalTime", field, value)}
        />
        <TimeInput
          label="Time children arrive to school"
          time={state.times.childrenArrivalTime}
          onChange={(field, value) => handleNestedInputChange("times", "childrenArrivalTime", field, value)}
        />
        <TimeInput
          label="Time classes start"
          time={state.times.classStartTime}
          onChange={(field, value) => handleNestedInputChange("times", "classStartTime", field, value)}
        />
        <TimeInput
          label="Time classes end"
          time={state.times.classEndTime}
          onChange={(field, value) => handleNestedInputChange("times", "classEndTime", field, value)}
        />

        {/* Dropdowns */}
        <DropdownInput
          label="Recess Time (Minutes)"
          value={state.recessTime}
          options={recessTimes}
          isOpen={state.recessDropdown}
          onToggle={() => handleInputChange("recessDropdown", !state.recessDropdown)}
          onSelect={(value) => {
            handleInputChange("recessTime", value);
            handleInputChange("recessDropdown", false);
          }}
        />
        <DropdownInput
          label="School Time (Hours)"
          value={state.schoolTime}
          options={count}
          isOpen={state.schoolTimeDropdown}
          onToggle={() => handleInputChange("schoolTimeDropdown", !state.schoolTimeDropdown)}
          onSelect={(value) => {
            handleInputChange("schoolTime", value);
            handleInputChange("schoolTimeDropdown", false);
          }}
        />
        <DropdownInput
          label="Number of Teachers Absent"
          value={state.absentTeachers}
          options={count}
          isOpen={state.teacherDropdown}
          onToggle={() => handleInputChange("teacherDropdown", !state.teacherDropdown)}
          onSelect={(value) => {
            handleInputChange("absentTeachers", value);
            handleInputChange("teacherDropdown", false);
          }}
        />

        {/* Cleanliness Score */}
        <View style={styles.entryBox}>
          <Text style={styles.entryLabel}>School Cleanliness</Text>
          <View style={styles.radioGroup}>
            {cleanlinessOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioButton}
                onPress={() => handleInputChange("cleanliness", option)}
              >
                <View style={styles.radioCircle}>
                  {state.cleanliness === option && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Usage Options */}
        <RadioGroup
          label="Was the playground used?"
          value={state.playgroundUse}
          options={usageOptions}
          onChange={(value) => handleInputChange("playgroundUse", value)}
        />
        <RadioGroup
          label="Were the school sinks used?"
          value={state.sinkUse}
          options={usageOptions}
          onChange={(value) => handleInputChange("sinkUse", value)}
        />
        <RadioGroup
          label="Classroom decorations"
          value={state.decorationUse}
          options={decorationOptions}
          onChange={(value) => handleInputChange("decorationUse", value)}
        />
        <RadioGroup
          label="Are there classrooms not being used?"
          value={state.classroomUse}
          options={usageOptions}
          onChange={(value) => handleInputChange("classroomUse", value)}
        />

        {/* Observations */}
        <FormInput
          label="Other Observations"
          value={state.observations}
          onChangeText={(text) => handleInputChange("observations", text)}
        />
        
        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={goBack}>
            <Text style={styles.linkButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ProgressBar currentStep={4} />
    </View>
  );
}

const TimeInput = ({ label, time, onChange }: {
  label: string;
  time: Time;
  onChange: (field: string, value: string) => void;
}) => (
  <View style={styles.entryBox}>
    <Text style={styles.entryLabel}>{label}</Text>
    <View style={styles.timeInputContainer}>
      <TextInput
        value={time.hour}
        onChangeText={(text) => onChange("hour", text)}
        placeholder="HH"
        keyboardType="numeric"
        maxLength={2}
        style={styles.timeInput}
      />
      <Text style={styles.separator}>:</Text>
      <TextInput
        value={time.minute}
        onChangeText={(text) => onChange("minute", text)}
        placeholder="MM"
        keyboardType="numeric"
        maxLength={2}
        style={styles.timeInput}
      />
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => onChange("period", time.period === "AM" ? "PM" : "AM")}
      >
        <Text style={styles.dropdownText}>{time.period}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FormInput = ({ label, value, onChangeText }: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View style={styles.entryBox}>
    <Text style={styles.entryLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const DropdownInput = ({ label, value, options, isOpen, onToggle, onSelect }: {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) => (
  <View style={styles.entryBox}>
    <Text style={styles.entryLabel}>{label}</Text>
    <TouchableOpacity style={styles.dropdown} onPress={onToggle}>
      <Text style={styles.dropdownText}>{value || "Select an option"}</Text>
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.dropdownList}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.dropdownItem}
            onPress={() => onSelect(option)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

const RadioGroup = ({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <View style={styles.entryBox}>
    <Text style={styles.entryLabel}>{label}</Text>
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.radioButton}
          onPress={() => onChange(option)}
        >
          <View style={styles.radioCircle}>
            {value === option && <View style={styles.radioSelected} />}
          </View>
          <Text style={styles.radioText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconWrapper: {
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    padding: 8,
  },
  content: {
    alignItems: 'center',
  },
  schoolName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
  },
  schoolLocation: {
    fontSize: 22,
    color: '#6b7280',
    marginBottom: 20,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 22,
    color: '#374151',
    marginBottom: 20,
  },
  entryBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 25,
    marginBottom: 20,
    width: '100%',
    elevation: 2,
  },
  entryLabel: {
    marginTop: 5,
    fontSize: 18,
    color: 'black',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingVertical: 5,
    marginBottom: 25,
    marginTop: 25,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  dateInput: {
    borderBottomWidth: 1,
    borderColor: '#000',
    width: 40,
    height: 40,
    textAlign: 'center',
  },
  separator: {
    marginHorizontal: 5,
    fontSize: 18,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timeInput: {
    borderBottomWidth: 1,
    borderColor: '#000',
    width: 40,
    height: 40,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  dropdown: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: '#6b7280',
  },
  dropdownList: {
    marginTop: 5,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#374151',
  },
  radioText: {
    fontSize: 16,
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    top: 10,
    right: 0,
  },
  submitButton: {
    backgroundColor: '#0f1741',
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 150,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  linkButton: {
    padding: 10,
  },
  linkButtonText: {
    color: 'grey',
    fontSize: 16,
    textAlign: 'center',
  },
});