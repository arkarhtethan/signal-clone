import { Auth, DataStore } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { User } from '../../src/models';
import styles from './styles';

const blue = "#3777f0";
const grey = "lightgrey";
const myID = 'u1';

const Message = ({ message }: any) => {
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

    return (
        <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>
            <Text style={{ color: isMe ? '#000' : 'white' }}>{message.content}</Text>
        </View>
    )
}

export default Message
