import { useNavigation } from '@react-navigation/native';
import { Auth, DataStore } from 'aws-amplify';
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { ChatRoomUser, Message, User } from '../../src/models';
import styles from './styles';

const ChatRoomItem = ({ chatRoom }: any) => {
    // const [me, chattingWith,] = chatRoom.users;
    const [users, setUsers] = useState<User[]>([]);// all users in this chatrooms
    const [user, setUser] = useState<User | null>(null);
    const [lastMessage, setLastMessage] = useState<Message | undefined>(undefined);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = (await DataStore.query(ChatRoomUser)).filter(chatRoomUser => chatRoomUser.chatRoom.id === chatRoom.id).map(chatRoomUser => chatRoomUser.user)
            const authUser = await Auth.currentAuthenticatedUser();
            setUsers(fetchedUsers);
            setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null)
        }
        fetchUsers();
    }, [])

    useEffect(() => {
        if (!chatRoom.chatRoomLastMessageId) { return; }
        DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(setLastMessage)
    }, [])


    const onPress = () => {
        navigation.navigate("ChatRoom", { id: chatRoom.id })
    }
    if (!user) {
        return <ActivityIndicator />
    }

    const time = moment(lastMessage?.createdAt).from(moment())

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image source={{ uri: user.imageUri }} style={styles.image} />
            {!!chatRoom.newMessages && <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
            </View>}
            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.text}>{time}</Text>
                </View>
                <Text numberOfLines={1} style={styles.text}>{lastMessage?.content}</Text>
            </View>
        </Pressable>
    )
}

export default ChatRoomItem
