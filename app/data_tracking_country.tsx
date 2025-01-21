import { View, Text, Button, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { MaterialIcons } from "@expo/vector-icons"


export default function DataTrackingCountry(){
    return(
        
        <View style={styles.container}>
            <View style={styles.topRow}>
                <MaterialIcons name="arrow-back"  size={30}/>
                <MaterialIcons name="home-filled"  size={50}/>
                <MaterialIcons name="upload"  size={40}/>
            </View>

            <Text style={styles.title}>Choose Country</Text>
            <View style={styles.buttonContainer}>
                <Link href="" style={styles.buttonLabels}>Guatemala</Link>
            </View>
            <View style={styles.buttonContainer}>
                <Link href="" style={styles.buttonLabels}>Honduras</Link>
            </View>
            <View style={styles.buttonContainer}>
                <Link href="" style={styles.buttonLabels}>Panama</Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    topRow: {
        width: 331,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#EFF2F7'
    },

    title: {
        marginTop: 20,
        fontSize: 25,
        fontStyle: 'normal',
        fontWeight: 700,
        letterSpacing: 0.75,
        fontFamily: 'Plus Jakarta Sans'
        
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 20,
        width: 331,
        height: 102,
    },

    buttonLabels: {
        textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: 700,
    }

})