import { Auth, DataStore } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';
import { ChatRoom, ChatRoomUser } from '../src/models';
import { RootTabScreenProps } from '../types';

export default function HomeScreen ({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])

  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const chatRoomsResponse = (await DataStore.query(ChatRoomUser)).filter(chatRoomUser => chatRoomUser.user.id === userData.attributes.sub).map(chatRoomUser => chatRoomUser.chatRoom);
      setChatRooms(chatRoomsResponse)

    }
    fetchChatRooms();
  }, [])


  const onPress = async () => {
    await DataStore.clear();
    Auth.signOut();
  }

  return (
    <View style={styles.page}>
      {chatRooms && <FlatList
        data={chatRooms}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return <ChatRoomItem chatRoom={item} />
        }}
      />}
      <Pressable onPress={onPress}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {}
});
