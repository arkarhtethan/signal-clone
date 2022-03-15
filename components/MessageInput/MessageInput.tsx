import React, { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Ionicons, SimpleLineIcons, Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"

const MessageInput = () => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        setMessage("");
    }

    const onPlusClicked = () => {
        console.log('on plus clicked');
    }

    const onPress = () => {
        if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
        console.log('I am pressed');
    }
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <SimpleLineIcons
                    name="emotsmile"
                    size={24}
                    color="#595959"
                    style={styles.icon}
                />
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    style={styles.textInput}
                    placeholder="Signal Message..."
                />
                <Feather
                    name="camera"
                    size={24}
                    color="#595959"
                    style={styles.icon}
                />
                <MaterialCommunityIcons
                    name="microphone-outline"
                    size={24}
                    color="#595959"
                    style={styles.icon}
                />
            </View>
            <Pressable onPress={onPress} style={styles.buttonContainer}>
                {!message ? <AntDesign
                    name="plus"
                    size={24}
                    color="white"
                /> :
                    <Ionicons
                        name="send"
                        size={18}
                        color="white"
                    />}
            </Pressable>
        </View>
    )
}

export default MessageInput

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
    },
    icon: {
        marginHorizontal: 5,
    },
    textInput: {
        flex: 1, marginHorizontal: 5,
    },
    inputContainer: {
        backgroundColor: 'lightgrey',
        flex: 1,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#dedede',
        color: '#f2f2f2',
        flexDirection: 'row',
        alignItems: "center",
        padding: 10,
    },
    buttonContainer: {
        width: 40,
        height: 40,
        backgroundColor: "#3777f0",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    },
})