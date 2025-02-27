import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

interface EntryData {
  id: string;
  date: string;
  isExpanded: boolean;
  details: {
    teacherArrivalTime: string;
    childrenArrivalTime: string;
    childrenAttended: number;
    parentsAttended: number;
    classStartTime: string;
    classEndTime: string;
    recessLength: string;
    hoursInSchool: string;
    teachersAbsent: number;
    cleanlinessScore: number;
    playgroundUsed: boolean;
    wereToysUsed: boolean;
    roomDecorations: boolean;
    otherObservations: string;
    lastUpdated: string;
  };
}

export default function PastEntriesScreen() {
  const [entries, setEntries] = useState<EntryData[]>([
    {
      id: '1',
      date: '00:00, MM/DD/YYYY',
      isExpanded: false,
      details: {
        teacherArrivalTime: '00:00 AM',
        childrenArrivalTime: '00:00 AM',
        childrenAttended: 15,
        parentsAttended: 3,
        classStartTime: '00:00 AM',
        classEndTime: '00:00 AM',
        recessLength: '30 mins',
        hoursInSchool: '4 hours',
        teachersAbsent: 2,
        cleanlinessScore: 3,
        playgroundUsed: true,
        wereToysUsed: false,
        roomDecorations: true,
        otherObservations: 'N/A',
        lastUpdated: '2/25/25 11:59 PM',
      },
    },
    {
      id: '2',
      date: '00:00, MM/DD/YYYY',
      isExpanded: false,
      details: { teacherArrivalTime: '', childrenArrivalTime: '', childrenAttended: 1, parentsAttended: 2, classStartTime: '', classEndTime: '', recessLength: '', hoursInSchool: '', 
        teachersAbsent: 4, cleanlinessScore: 1, playgroundUsed: true, wereToysUsed: false, roomDecorations: true, otherObservations: '', lastUpdated: '2/25/25 11:59 PM',
        },
    },
    {
      id: '3',
      date: '00:00, MM/DD/YYYY',
      isExpanded: false,
      details: { teacherArrivalTime: '', childrenArrivalTime: '', childrenAttended: 1, parentsAttended: 2, classStartTime: '', classEndTime: '', recessLength: '', hoursInSchool: '', 
        teachersAbsent: 4, cleanlinessScore: 1, playgroundUsed: true, wereToysUsed: false, roomDecorations: true, otherObservations: '', lastUpdated: '2/25/25 11:59 PM',
        },
    },
    {
      id: '4',
      date: '00:00, MM/DD/YYYY',
      isExpanded: false,
      details: { teacherArrivalTime: '', childrenArrivalTime: '', childrenAttended: 1, parentsAttended: 2, classStartTime: '', classEndTime: '', recessLength: '', hoursInSchool: '', 
        teachersAbsent: 4, cleanlinessScore: 1, playgroundUsed: true, wereToysUsed: false, roomDecorations: true, otherObservations: '', lastUpdated: '2/25/25 11:59 PM',
        },
    },
  ]);

  const toggleExpand = (id: string) => {
    setEntries(
      entries.map(entry => 
        entry.id === id ? { ...entry, isExpanded: !entry.isExpanded } : entry
      )
    );
  };

  const handleEditEntry = (id: string) => {
    console.log('Edit entry:', id);
  };

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.navigate('/');
  };

  const renderEntryDetails = (details: EntryData['details']) => (
    <View style={styles.entryDetails}>
      <DataRow label="Time teachers arrive:" value={details.teacherArrivalTime} />
      <DataRow label="Time children arrive:" value={details.childrenArrivalTime} />
      <DataRow label="# of children attended:" value={details.childrenAttended.toString()} />
      <DataRow label="# of parents attended:" value={details.parentsAttended.toString()} />
      <DataRow label="Time classes start:" value={details.classStartTime} />
      <DataRow label="Time classes end:" value={details.classEndTime} />
      <DataRow label="Recess length:" value={details.recessLength} />
      <DataRow label="# of hours in school:" value={details.hoursInSchool} />
      <DataRow label="# of teachers absent:" value={details.teachersAbsent.toString()} />
      <DataRow label="Cleanliness score (1-5):" value={details.cleanlinessScore.toString()} />
      <DataRow label="Playground being used:" value={details.playgroundUsed ? 'Yes' : 'No'} />
      <DataRow label="Were the toys used:" value={details.wereToysUsed ? 'Yes' : 'No'} />
      <DataRow label="Room decorations:" value={details.roomDecorations ? 'Yes' : 'No'} />
      <DataRow label="Other observations:" value={details.otherObservations} />
      
      <Pressable 
        style={styles.editButton}
        onPress={() => handleEditEntry('1')}
      >
        <Text style={styles.editButtonText}>Edit Entry</Text>
      </Pressable>
      
      <Text style={styles.lastUpdated}>Last Updated {details.lastUpdated}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="darkblue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goHome} style={styles.homeButton}>
          <MaterialIcons name="home" size={24} color="darkblue" />
        </TouchableOpacity>
        <View style={styles.placeholderRight} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Past Entries</Text>
        <Text style={styles.subtitle}>School Name</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* avg metrics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Average Metrics:</Text>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}># of students attended:</Text>
            <Text style={styles.metricValue}>15</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}># of parents attended:</Text>
            <Text style={styles.metricValue}>15</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}># of teachers absent:</Text>
            <Text style={styles.metricValue}>15</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Cleanliness score (1-5):</Text>
            <Text style={styles.metricValue}>3</Text>
          </View>
        </View>

        {/* details  */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Click to view details:</Text>
          
          {entries.map((entry) => (
            <View key={entry.id}>
              <Pressable 
                style={styles.entryButton}
                onPress={() => toggleExpand(entry.id)}
              >
                <Text style={styles.entryButtonText}>{entry.date}</Text>
                <Feather 
                  name={entry.isExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#fff" 
                />
              </Pressable>
              {entry.isExpanded && renderEntryDetails(entry.details)}
            </View>
          ))}
        </View>
      </ScrollView>
       
      { /* dots at the bottom */}    
      <View style={styles.paginationContainer}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <View key={dot} style={styles.paginationDot} />
        ))}
      </View>
    </View>
  );
}

// rendering data
const DataRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderRight: {
    width: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: "#333",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  entryButton: {
    backgroundColor: '#6DAE57',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  paginationDot: {
    width: 30,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF9966',
    marginHorizontal: 4,
  },
  entryDetails: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 1,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  dataLabel: {
    fontSize: 14,
    color: '#333',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#1a237e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
  },
});