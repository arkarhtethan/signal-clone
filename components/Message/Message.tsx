import { Auth, DataStore } from 'aws-amplify';
import { S3Image } from "aws-amplify-react-native";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, useWindowDimensions, View } from 'react-native';
import { User } from '../../src/models';
import styles from './styles';

const blue = "#3777f0";
const grey = "lightgrey";
const myID = 'u1';

const Message = ({ message }: any) => {
    const { width } = useWindowDimensions();
    const [user, setUser] = useState<User | undefined>();
    const [isMe, setIsMe] = useState<boolean>(false);
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

    if (!user) { return <ActivityIndicator /> }
    console.log(message)
    return (
        <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>
            {message.image && <S3Image imgKey={message.image} style={{ width: width * 0.7, aspectRatio: 4 / 3 }} />}
            <Text style={{ color: isMe ? '#000' : 'white' }}>{message.content}</Text>
        </View>
    )
}

export default Message
