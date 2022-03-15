import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import styles from './styles'
import { useNavigation } from '@react-navigation/native';

const ChatRoomItem = ({ chatRoom }: any) => {
    const [me, chattingWith,] = chatRoom.users;
    const navigation = useNavigation();
    const onPress = () => {
        navigation.navigate("ChatRoom", { id: chatRoom.id })
    }
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image source={{ uri: chattingWith.imageUri }} style={styles.image} />
            {chatRoom.newMessage && <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>2</Text>
            </View>}
            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{chattingWith.name}</Text>
                    <Text style={styles.text}>{chatRoom.lastMessage.createdAt}</Text>
                </View>
                <Text numberOfLines={1} style={styles.text}>{chatRoom.lastMessage.content}</Text>
            </View>
        </Pressable>
    )
}

export default ChatRoomItem
