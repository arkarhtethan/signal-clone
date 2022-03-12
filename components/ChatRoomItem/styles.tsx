import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 3,
    },
    text: {
        color: 'grey',
    },
    rightContainer: {
        flex: 1,
    },
    badgeContainer: {
        backgroundColor: '#3872E9',
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 50,
        top: 10,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
})

export default styles;