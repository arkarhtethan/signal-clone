import { Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { Auth, DataStore } from "aws-amplify";
import * as React from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { User } from "../src/models";

export const HomeHeader = (props: any) => {
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        const fetchUsers = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            const fetchedUser = (await DataStore.query(User, authUser.attributes.sub))

            if (fetchedUser) setUser(fetchedUser)
        }
        fetchUsers();

    }, [])


    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    if (!user) return null;

    return (<View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between', width, paddingRight: 20 }}>
        <Image
            source={{ uri: user.imageUri }}
            style={{ width: 30, height: 30, borderRadius: 30, }} />
        <Text style={{ flex: 1, textAlign: "center", fontWeight: 'bold' }}>Signal</Text>
        <Feather
            name="camera"
            size={24}
            color="#595959"
            style={{ marginHorizontal: 10 }} />
        <Pressable onPress={() => navigation.navigate("UsersScreen")}>
            <Feather
                name="edit-2"
                size={24}
                color="#595959" />
        </Pressable>
    </View>);
};
