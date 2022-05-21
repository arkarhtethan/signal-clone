import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Auth, DataStore, Storage } from "aws-amplify";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import EmojiSelector from "react-native-emoji-selector";
import { v4 as uuidv4 } from "uuid";
import { ChatRoom, Message as MessageModel, MessageStatus } from "../../src/models";
import AudioPlayer from "../AudioPlayer";
import Message from "../Message/Message";

const MessageInput = ({ chatRoom, messageReplyTo, removeMessageReplyTo }: any) => {
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [recording, setRecording] = useState<Audio.Recording | undefined>();
    const [soundURI, setSoundURI] = useState<string | null>(null)


    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const libraryResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
                const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
                await Audio.requestPermissionsAsync();
                if (libraryResponse.status !== "granted" || photoResponse.status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this workd!");
                }
            }
        })();
    }, [])

    async function startRecording () {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }


    async function stopRecording () {
        if (!recording) { return; }
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        if (!uri) return;
        setSoundURI(uri)

    }

    const sendMessage = async () => {
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new MessageModel({ content: message, userID: user.attributes.sub, chatroomID: chatRoom.id, replyToMessageID: messageReplyTo?.id }))
        updateLastMessage(newMessage)
        resetField();
    }

    const updateLastMessage = async (newMessage: any) => {
        DataStore.save(ChatRoom.copyOf(chatRoom, updatedChatRoom => {
            updatedChatRoom.LastMessage = newMessage;
        }))
    }

    const onPlusClicked = () => {

    }

    const onPress = () => {
        if (image) {
            sendImage();
        } else if (soundURI) {
            sendAudio();
        }
        else if (message) {
            sendMessage();
        } else {
            onPlusClicked();
        }
    }

    const progressCallback = (progress: any) => {
        setProgress(progress.loaded / progress.total)
    }

    const sendImage = async () => {
        if (!image) return;
        const blob = await getBlob(image);
        const { key } = await Storage.put(`${uuidv4()}.png`, blob, { progressCallback });
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new MessageModel({ content: message, image: key, userID: user.attributes.sub, chatroomID: chatRoom.id, replyToMessageID: messageReplyTo?.id }))
        updateLastMessage(newMessage)
        resetField();

    }

    const sendAudio = async () => {
        if (!soundURI) return;
        const uriParts = soundURI.split('.');
        const extension = uriParts[uriParts.length - 1];
        const blob = await getBlob(soundURI);
        const { key } = await Storage.put(`${uuidv4()}.${extension}`, blob, { progressCallback });
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new MessageModel({ content: message, audio: key, userID: user.attributes.sub, chatroomID: chatRoom.id, status: MessageStatus.SENT, replyToMessageID: messageReplyTo?.id }))
        updateLastMessage(newMessage)
        resetField();

    }

    const resetField = () => {
        removeMessageReplyTo();
        setMessage("");
        setIsEmojiPickerOpen(false);
        setImage(null);
        setProgress(0)
        setSoundURI(null);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 })
        if (!result.cancelled) {
            setImage(result.uri)
        }
    }

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, aspect: [4, 3] });
        if (!result.cancelled) {
            setImage(result.uri)
        }
    }

    const getBlob = async (uri: string) => {
        if (!uri) {
            return null;
        }
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    }


    return (
        <KeyboardAvoidingView style={[styles.container, { height: isEmojiPickerOpen ? "50%" : "auto" }]}>
            {messageReplyTo &&
                <View style={{ backgroundColor: "#f2f2f2", padding: 5, flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flex: 1 }}>
                        <Text>Reply to:</Text>
                        <Message message={messageReplyTo} />
                    </View>
                    <Pressable onPress={() => removeMessageReplyTo()}>
                        <AntDesign name="close" size={24} color="black" style={{ margin: 5 }} />
                    </Pressable>
                </View>}
            {image && (
                <View style={styles.sendImageContainer}>
                    <Image source={{ uri: image }} style={{
                        borderRadius: 10,
                        width: 100,
                        height: 100
                    }} />
                    <View style={{ flex: 1, justifyContent: "flex-start", alignSelf: "flex-end" }}>
                        <View style={{
                            height: 3,
                            backgroundColor: "#3777f0",
                            width: `${progress * 100}%`,
                            borderRadius: 5,
                        }} />
                    </View>
                    <Pressable onPress={() => { setImage(null) }}>
                        <AntDesign name="close" size={24} color="black" style={{ margin: 5 }} />
                    </Pressable>
                </View>
            )}

            {soundURI && (
                <AudioPlayer soundURI={soundURI} />
            )}

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
                    <Pressable onPress={pickImage}>
                        <Feather
                            name="image"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>
                    <Pressable onPress={takePhoto}>
                        <Feather
                            name="camera"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>
                    <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
                        <MaterialCommunityIcons
                            name={recording ? "microphone" : "microphone-outline"}
                            size={24}
                            color={recording ? "red" : "#595959"}
                            style={styles.icon}
                        />
                    </Pressable>
                </View>
                <Pressable onPress={onPress} style={styles.buttonContainer}>
                    {message || image || soundURI ?
                        <Ionicons
                            name="send"
                            size={18}
                            color="white"
                        /> : <AntDesign
                            name="plus"
                            size={24}
                            color="white"
                        />
                    }
                </Pressable>
            </View>
            {
                isEmojiPickerOpen && <EmojiSelector showSectionTitles={false} showSearchBar={false} columns={12} onEmojiSelected={(emoji: string) => {
                    setMessage(prev => prev + emoji)
                }} />
            }
        </KeyboardAvoidingView >
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
    sendImageContainer: {
        flexDirection: "row",
        marginVertical: 10,
        alignSelf: "stretch",
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "gray"
    },
    sendAudioContainer: {
        flexDirection: "row",
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "lightgray"
    },
    audioProgressBG: {
        height: 3,
        flex: 1,
        backgroundColor: "lightgray"
        , borderRadius: 5, margin: 10,
    },
    audioProgressFG: {
        width: 10,
        height: 10,
        backgroundColor: "#3777f0",
        borderRadius: 10,
        position: "absolute",
        top: -5,
        left: "50%"
    }
})