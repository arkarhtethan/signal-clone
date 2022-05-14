import { useNavigation } from '@react-navigation/native';
import { Auth, DataStore } from 'aws-amplify';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { ChatRoom, ChatRoomUser, User } from '../../src/models';
import styles from './styles';

const UserItem = ({ user }: any) => {
    const navigation = useNavigation();

    const onPress = async () => {
        const newChatRoom = await DataStore.save(new ChatRoom({ newMessages: 0 }));
        const authUser = await Auth.currentAuthenticatedUser();
        const users = await DataStore.query(User);
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
