import { View, Text, TouchableOpacity, Button, StyleSheet} from "react-native";
import { Link } from 'expo-router';
import { MaterialIcons} from "@expo/vector-icons";


export default function Choose_Annual_Filtered () {
    return (
        <View style={styles.container}>
            {/* top line */}
            <View style={styles.home_back_row}>
                <MaterialIcons name="arrow-back" size={30} style={{paddingRight: 150}}/>
                <MaterialIcons name="home-filled" style={{marginBottom: 20}} size={50}/>
            </View>

            {/* title section */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Choose Type</Text>
            </View>

            {/* Annual data link */}
            <View style={styles.box1Container}>
                <Link href="/choose_annual_filtered" style={styles.box1Text}>Annual Data</Link>
            </View>

            {/* Filtered data link */}
            <View style={styles.box1Container}>
            <Link href="/choose_annual_filtered" style={styles.box1Text}>Filtered Data</Link>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#EFF2F7'
    },

    home_back_row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // backgroundColor: 'red',
        width: 400
    },

    backButton: {
      width: 42,
      height: 42
    },

    titleText: {
        fontSize: 25,
        fontWeight: 700,
        color: '#000',
        fontStyle: 'normal',
        letterSpacing: 0.75,
        fontFamily: 'Plus Jakarta Sans'
    },

    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 100,
        marginTop: 40
    },

    box1Text: {
        fontSize: 20,
        fontWeight: 700,
        color: '#000',
        fontStyle: 'normal',
        letterSpacing: 0.75,
        fontFamily: 'Plus Jakarta Sans',
    },

    box1Container: {
        backgroundColor: '#fff',
        width: 331,
        height: 102,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },

    topLineContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }   
});