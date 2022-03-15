import { StyleSheet, View, FlatList, SafeAreaView, Image, Text, useWindowDimensions } from 'react-native';
import { RootTabScreenProps } from '../types';
import Message from '../components/Message';
import Chats from '../assets/dummy-data/Chats';
import MessageInput from '../components/MessageInput';
import { useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Feather } from '@expo/vector-icons';

export default function ChatRoomScreen ({ navigation }: RootTabScreenProps<'TabOne'>) {
    const route = useRoute();
    const { width } = useWindowDimensions();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between', width: width - 75, marginRight: 10 }}>
                <Image
                    source={{ uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg" }}
                    style={{ width: 30, height: 30, borderRadius: 30, }}
                />
                <Text style={{ fontWeight: 'bold' }}>{"ELon"}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Feather
                        name="camera"
                        size={24}
                        color="#595959"
                        style={{ marginHorizontal: 10 }}
                    />
                    <Feather
                        name="edit-2"
                        size={24}
                        color="#595959"
                        style={{}}
                    />
                </View>
            </View >
        });
    }, [navigation]);
    return (
        <SafeAreaView style={styles.page}>
            <FlatList
                data={Chats.messages}
                renderItem={({ item }) => <Message message={item} />}
                inverted
            />
            <MessageInput />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    }
});
