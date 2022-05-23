import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import NewGroupButton from '../components/NewGroupButton';
import UserItem from '../components/UserItem';
import { ChatRoom, ChatRoomUser, User } from '../src/models';
import { RootTabScreenProps } from '../types';

export default function UsersScreen ({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [users, setUsers] = useState<User[]>([]);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const fetchedUsers = (await DataStore.query(User)).filter(user => user.id !== authUser.attributes.sub)
      setUsers(fetchedUsers)
    })();

  }, [])

  const addUserToChatRoom = async (user: any, chatRoom: any) => {
    await DataStore.save(new ChatRoomUser({ user, chatRoom }))
  }

  const createChatRoom = async ({ users }: any) => {
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    const newChatRoomData = { newMessages: 0, admin: dbUser };
    if (users.length > 1) {
      newChatRoomData.name = "New Group"
      newChatRoomData.imageUri = "https://notjustdev-dummy.s2.us-east-2.amazonaws.com/avatars.group.jpeg"
    }
    const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));

    if (dbUser) {
      await addUserToChatRoom(dbUser, newChatRoom);
    }
    await Promise.all(users.map((user: any) => (
      addUserToChatRoom(user, newChatRoom)
    )))
    navigation.navigate("ChatRoom", { id: newChatRoom.id })
  }

  const isUserSelected = (user: any) => {
    return selectedUsers.some(selectedUser => selectedUser.id === user.id)
  }

  const onUserPress = async (user: any) => {
    if (isNewGroup) {
      if (isUserSelected(user)) {
        setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id))
      } else {
        setSelectedUsers([...selectedUsers, user])
      }
    } else { await createChatRoom({ users: [user] }) }

  }

  const saveGroup = async () => {
    await createChatRoom({ users: selectedUsers })
  }

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={users}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <UserItem
          isSelected={isNewGroup ? isUserSelected(item) : undefined}
          user={{ ...item }}
          onPress={() => onUserPress(item)}
        />}
        ListHeaderComponent={() => <NewGroupButton onPress={() => setIsNewGroup(prev => !prev)} />}
      />
      {isNewGroup && <Pressable style={styles.button} onPress={saveGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </Pressable>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff"
  },
  button: {
    backgroundColor: "#3777f0",
    margin: 10,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
});
