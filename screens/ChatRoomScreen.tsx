import { useRoute } from '@react-navigation/native';
import { DataStore, SortDirection } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
import MessageComponent from '../components/Message';
import MessageInput from '../components/MessageInput';
import { ChatRoom, Message } from '../src/models';
import { RootTabScreenProps } from '../types';

export default function ChatRoomScreen ({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const route = useRoute();
    const { width } = useWindowDimensions();

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

    const fetchMessages = async () => {
        if (!chatRoom) {
            return;
        }
        await DataStore.query(Message, message => message.chatroomID("eq", chatRoom?.id), { sort: message => message.createdAt(SortDirection.DESCENDING) }).then(setMessages);
    }

    useEffect(() => {
        fetchChatRoom();
    }, [])

    useEffect(() => {
        if (!chatRoom) return;
        fetchMessages();
    }, [chatRoom])

    useEffect(() => {
        const subscription = DataStore.observe(Message).subscribe(msg => {
            if (msg.model === Message && msg.opType === "INSERT") {
                setMessages(existingMessages => [msg.element, ...existingMessages])
            }
        })
        return () => subscription.unsubscribe();
    }, [])

    if (!(chatRoom && messages)) {
        return <ActivityIndicator />
    }

    return (
        <SafeAreaView style={styles.page}>
            <FlatList
                data={messages}
                renderItem={({ item }) => <MessageComponent message={item} />}
                inverted
            />
            <MessageInput chatRoom={chatRoom} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    }
});
