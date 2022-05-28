import { useRoute } from '@react-navigation/native';
import { Auth, DataStore } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import UserItem from '../../components/UserItem';
import { ChatRoom, ChatRoomUser, User } from '../../src/models';

const GroupInfoScreen = () => {
    const route = useRoute();
    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const [allUsers, setAllUsers] = React.useState<User[]>([]);

    const fetchUsers = async () => {
        const fetchedUsers = (await DataStore.query(ChatRoomUser)).filter(chatRoomUser => chatRoomUser.chatRoom.id === route?.params?.id)
            .map(chatRoomUser => chatRoomUser.user)
        setAllUsers(fetchedUsers)
    }
    const fetchChatRoom = async () => {
        if (!route?.params?.id) {
            return;
        }
        const chatRoom = await DataStore.query(ChatRoom, route.params.id);
        if (!chatRoom) {
        } else {
            setChatRoom(chatRoom)
        }
    }

    useEffect(() => {
        fetchChatRoom();
        fetchUsers();
    }, [])

    const confirmDelete = async (user: User) => {
        const authData = await Auth.currentAuthenticatedUser();
        if (chatRoom?.Admin?.id !== authData.attributes.sub) {
            Alert.alert(`You are not the admin of this group.`)
            return;
        }
        if (user.id === chatRoom?.Admin?.id) {
            Alert.alert(`You are the admin, you cannot delete yourself.`)
            return;
        }
        Alert.alert("Confirm delete.", `Are you sure you want to delete ${user.name} from the group.`, [{ text: "Delete", onPress: () => { deleteUser(user) }, }, { text: "Cancel" }])
    }

    const deleteUser = async (user: User) => {
        const chatRoomUsersToDelete = (await DataStore.query(ChatRoomUser)).filter(cru => cru.chatRoom.id === chatRoom?.id && cru.user.id === user.id);
        if (chatRoomUsersToDelete.length > 0) {
            await DataStore.delete(chatRoomUsersToDelete[0])
            setAllUsers(allUsers.filter(u => u.id !== user.id))
        }
    }

    return (
        <View style={styles.root}>
            <Text style={styles.title}>{chatRoom?.name}</Text>
            <Text style={styles.title}>Users ({allUsers.length})</Text>
            <FlatList
                data={allUsers}
                renderItem={({ item }) => <UserItem
                    user={item}
                    isAdmin={chatRoom?.Admin?.id === item.id}
                    onLongPress={() => confirmDelete(item)}
                />} />
        </View>
    )
}

export default GroupInfoScreen

const styles = StyleSheet.create({
    root: { backgroundColor: "#fff", padding: 10, flex: 1, },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
})