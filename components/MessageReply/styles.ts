import { StyleSheet } from "react-native";

const blue = "#3777f0";
const grey = "lightgrey";

export default StyleSheet.create({
    container: {
        padding: 10,
        margin: 10,
        borderRadius: 15,
        maxWidth: '75%',
        alignItems: "flex-end",
    },
    text: {
        color: 'white'
    },
    leftContainer: {
        backgroundColor: blue,
        marginLeft: 10,
        marginRight: 'auto',
    },
    rightContainer: {
        backgroundColor: grey,
        marginRight: 10,
        marginLeft: 'auto',
        alignItems: "flex-end"
    },
    messageReply: {
        backgroundColor: "gray",
        padding: 5,
        borderRadius: 5,
        borderColor: "#3777f0",
        borderLeftWidth: 3,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-end"
    },
})