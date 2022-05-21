import { Ionicons } from "@expo/vector-icons";
import { Auth, DataStore, Storage } from 'aws-amplify';
import { S3Image } from "aws-amplify-react-native";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, useWindowDimensions, View } from 'react-native';
import { Message as MessageModel, User } from "../../src/models";
import AudioPlayer from '../AudioPlayer';
import styles from './styles';
const blue = "#3777f0";
const grey = "lightgrey";
const myID = 'u1';

const Message = (props: any) => {
    const [message, setMessage] = useState(props.message);
    const { width } = useWindowDimensions();
    const [user, setUser] = useState<User | undefined>();
    const [isMe, setIsMe] = useState<boolean>(false);
    const [soundURI, setSoundURI] = useState<string | null>(null);

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser)
    }, [])

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
            if (msg.model === MessageModel && msg.opType === "UPDATE") {
                setMessage((originalMessage: any) => ({ ...originalMessage, ...msg.element, }))
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

    if (!user) { return <ActivityIndicator /> }

    return (
        <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer, { width: soundURI ? "75%" : "auto" }]}>
            {message.image && <S3Image imgKey={message.image} style={{ width: width * 0.6, aspectRatio: 4 / 3 }} />}
            {soundURI && <AudioPlayer soundURI={soundURI} />}
            {!!message.content && <Text style={{ color: isMe ? '#000' : 'white' }}>{message.content}</Text>}
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
    )
}

export default Message
