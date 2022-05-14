import { Feather } from "@expo/vector-icons";
import { Auth, DataStore } from "aws-amplify";
import * as React from 'react';
import { Image, Text, useWindowDimensions, View } from 'react-native';
import { ChatRoomUser, User } from "../src/models";

export const ChatRoomHeader = (props: any) => {
    const { id, children } = props;
    const { width } = useWindowDimensions();
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        const fetchUsers = async () => {
            if (!id) return;
            const fetchedUsers = (await DataStore.query(ChatRoomUser)).filter(chatRoomUser => chatRoomUser.chatRoom.id === id)
                .map(chatRoomUser => chatRoomUser.user)
            const authUser = await Auth.currentAuthenticatedUser();
            setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null)
        }
        fetchUsers();

    }, [])


    return (<View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between', width: width - 75, marginRight: 10 }}>
        <Image
            source={{ uri: user?.imageUri }}
            style={{ width: 30, height: 30, borderRadius: 30, }} />
        <Text style={{ fontWeight: 'bold' }}>{user?.name}</Text>
        <View style={{ flexDirection: "row" }}>
            <Feather
                name="camera"
                size={24}
                color="#595959"
                style={{ marginHorizontal: 10 }} />
            <Feather
                name="edit-2"
                size={24}
                color="#595959"
                style={{}} />
        </View>
    </View>);
};
