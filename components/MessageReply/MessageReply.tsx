import { Ionicons } from "@expo/vector-icons";
import { Auth, DataStore, Storage } from 'aws-amplify';
import { S3Image } from "aws-amplify-react-native";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, useWindowDimensions, View } from 'react-native';
import { Message as MessageModel, User } from "../../src/models";
import AudioPlayer from '../AudioPlayer';
import styles from './styles';

const MessageReply = (props: any) => {

    const {
        message: propsMessage
    } = props;
    const [message, setMessage] = useState<MessageModel>(propsMessage);
    const { width } = useWindowDimensions();
    const [user, setUser] = useState<User | undefined>();
    const [isMe, setIsMe] = useState<boolean>(false);
    const [soundURI, setSoundURI] = useState<string | null>(null);

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser)
    }, [])

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

    if (!user) { return <ActivityIndicator /> }
    return (
        <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer, { width: soundURI ? "75%" : "auto" }]}>
            <View style={styles.row}>
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
        </View>
    )
}

export default MessageReply
