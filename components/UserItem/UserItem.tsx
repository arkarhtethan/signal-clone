import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import styles from './styles'
import { useNavigation } from '@react-navigation/native';
import { ChatRoom, ChatRoomUser, User } from '../../src/models';
import { Auth, DataStore } from 'aws-amplify';

const UserItem = ({ user }: any) => {
    const navigation = useNavigation();

    const onPress = async () => {
        const newChatRoom = await DataStore.save(new ChatRoom({ newMessages: 0 }));
        const authUser = await Auth.currentAuthenticatedUser();
        const dbUser = await DataStore.query(User, authUser.attributes.sub);
        if (dbUser) {
            await DataStore.save(new ChatRoomUser({ user: dbUser, chatRoom: newChatRoom }));
        }
        await DataStore.save(new ChatRoomUser({ user, chatRoom: newChatRoom }));
        navigation.navigate("ChatRoom", { id: newChatRoom.id })
    }

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image source={{ uri: user.imageUri }} style={styles.image} />
            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{user.name}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default UserItem
