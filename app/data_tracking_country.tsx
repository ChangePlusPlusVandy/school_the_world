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
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#EFF2F7',
        paddingTop: 60,
        paddingHorizontal: 20
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 32,
        paddingBottom: "3%"
    },

    buttonContainer: {
        // alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: '#FFFFFF',
        // marginTop: 20,
        // marginBottom: 10,
        // borderRadius: 20,
        // width: 331,
        // height: 102,
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

    buttonLabels: {
        // textAlign: 'center',
        // fontFamily: 'Plus Jakarta Sans',
        // fontSize: 20,
        // fontStyle: 'normal',
        // fontWeight: 700,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    }

})