import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Auth, DataStore, Storage } from 'aws-amplify';
import { S3Image } from "aws-amplify-react-native";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Message as MessageModel, User } from "../../src/models";
import AudioPlayer from '../AudioPlayer';
import MessageReply from "../MessageReply";
import styles from './styles';
const blue = "#3777f0";
const grey = "lightgrey";
const myID = 'u1';

const Message = (props: any) => {
    const {
        setAsMessageReply, message: propsMessage
    } = props;
    const [message, setMessage] = useState<MessageModel>(propsMessage);
    const [replyTo, setReplyTo] = useState<MessageModel | undefined>();
    const { width } = useWindowDimensions();
    const [user, setUser] = useState<User | undefined>();
    const [isMe, setIsMe] = useState<boolean>(false);
    const [soundURI, setSoundURI] = useState<string | null>(null);
    const { showActionSheetWithOptions } = useActionSheet();
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser)
    }, [])

    useEffect(() => {
        if (message.replyToMessageID) {
            DataStore.query(MessageModel, message.replyToMessageID).then(setReplyTo)
        }
    }, [message])

    useEffect(() => {
        setMessage(propsMessage)
    }, [propsMessage])

    useEffect(() => {
        const checkIfMe = async () => {
            if (!user) {
                return;
            }
            const authUser = await Auth.currentAuthenticatedUser();
            setIsMe(authUser.attributes.sub === user?.id)
        }
        checkIfMe();
    }, [user])

    useEffect(() => {
        setAsRead();
    }, [isMe, message])


    useEffect(() => {
        const subscription = DataStore.observe(MessageModel, message.id).subscribe((msg) => {
            if (msg.model === MessageModel) {
                if (msg.opType === "UPDATE") {
                    setMessage((originalMessage: any) => ({ ...originalMessage, ...msg.element, }))
                } else if (msg.opType === "DELETE") {
                    setIsDeleted(true)
                }
            }
        })
        return () => subscription.unsubscribe();
    }, [])

    useEffect(() => {
        const downloadSound = async () => {
            if (message.audio) {
                const uri = await Storage.get(message.audio);
                setSoundURI(uri)
            }
        }
        downloadSound();
    }, [message])

    const setAsRead = () => {
        if (isMe === false && message.status !== "READ") {
            DataStore.save(MessageModel.copyOf(message, updated => { updated.status = "READ" }))
        }
    }

    const deleteMessage = async () => {
        await DataStore.delete(message)
        setIsDeleted(true);
    }

    const confirmDelete = () => {
        Alert.alert("Confirm delete", "Are you sure you want to delete the message ?", [{ text: "Delete", onPress: deleteMessage, style: "destructive" }, { text: "Cancel" }])
    }

    const onActionPress = (index: number | undefined) => {
        if (!index) return;
        if (index === 0) {
            setAsMessageReply();
        } else if (index === 1) {
            if (isMe) {
                confirmDelete();
            } else {
                Alert.alert("Can't perform action", "This is not your message.")
            }
        }
    }

    const openActionMenu = () => {
        const options = ["Reply", "Delete", "Cancel"];

        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 2;
        showActionSheetWithOptions({
            options,
            destructiveButtonIndex,
            cancelButtonIndex,
        }, onActionPress);
    }

    if (!user) { return <ActivityIndicator /> }

    return (
        <Pressable onLongPress={openActionMenu} style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer, { width: soundURI ? "75%" : "auto" }]}>
            {replyTo && <MessageReply message={replyTo} />}
            <View style={styles.row}>
                {message.image && <S3Image imgKey={message.image} style={{ width: width * 0.6, aspectRatio: 4 / 3 }} />}
                {soundURI && <AudioPlayer soundURI={soundURI} />}
                {!!message.content && <Text style={{ color: isMe ? '#000' : 'white' }}>{isDeleted ? "message deleted" : message.content}</Text>}
            </View>
            <View>
                {isMe &&
                    message.status !== null &&
                    message.status !== "SENT" &&
                    (<Ionicons
                        name={message.status === "DELIVERED" ? "checkmark" : "checkmark-done"}
                        size={16}
                        color="grey"
                        style={{ marginHorizontal: 5 }}
                    />)}
            </View>
        </Pressable>
    )
}

export default Message
