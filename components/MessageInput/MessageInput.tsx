import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Auth, DataStore } from "aws-amplify";
import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, TextInput, View } from 'react-native';
import EmojiSelector from "react-native-emoji-selector";
import { ChatRoom, Message } from "../../src/models";

const MessageInput = ({ chatRoom }: any) => {
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const sendMessage = async () => {
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new Message({ content: message, userID: user.attributes.sub, chatroomID: chatRoom.id }))
        updateLastMessage(newMessage)
        setMessage("");
        setIsEmojiPickerOpen(false);
    }

    const updateLastMessage = async (newMessage: any) => {
        DataStore.save(ChatRoom.copyOf(chatRoom, updatedChatRoom => {
            updatedChatRoom.LastMessage = newMessage;
        }))
    }

    const onPlusClicked = () => {

    }

    const onPress = () => {
        if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
    }
    return (
        <KeyboardAvoidingView style={[styles.container, { height: isEmojiPickerOpen ? "50%" : "auto" }]}>
            <View style={[styles.row,]} >
                <View style={styles.inputContainer}>
                    <SimpleLineIcons
                        name="emotsmile"
                        onPress={() => setIsEmojiPickerOpen(prev => !prev)}
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
            {isEmojiPickerOpen && <EmojiSelector showSectionTitles={false} showSearchBar={false} columns={12} onEmojiSelected={(emoji: string) => {
                setMessage(prev => prev + emoji)
            }} />}
        </KeyboardAvoidingView>
    )
}

export default MessageInput

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    row: {
        flexDirection: "row"
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