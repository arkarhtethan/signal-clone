import { Text, View } from 'react-native'
import React from 'react'
import styles from './styles'

const blue = "#3777f0";
const grey = "lightgrey";
const myID = 'u1';

const Message = ({ message }: any) => {
    const isMe = message.user.id === myID;

    return (
        <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>
            <Text style={{ color: isMe ? '#000' : 'white' }}>{message.content}</Text>
        </View>
    )
}

export default Message
