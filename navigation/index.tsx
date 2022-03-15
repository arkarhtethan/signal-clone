
import { Feather, } from "@expo/vector-icons"
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Image, Pressable, Text, useWindowDimensions, View } from 'react-native';


import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import { RootStackParamList, } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import UsersScreen from "../screens/UsersScreen";

export default function Navigation ({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true, headerTitle: () => <HomeHeader /> }} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{
        headerShown: true,
        headerTitle: () => <ChatRoomHeader />,
        title: "Username",
        headerBackTitleVisible: false,
      }} />
      <Stack.Screen name="UsersScreen" component={UsersScreen} options={{
        title: "Users",
      }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

const HomeHeader = (props: any) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  return (<View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between', width, paddingRight: 20 }}>
    <Image
      source={{ uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg" }}
      style={{ width: 30, height: 30, borderRadius: 30, }}
    />
    <Text style={{ flex: 1, textAlign: "center", fontWeight: 'bold' }}>Signal</Text>
    <Feather
      name="camera"
      size={24}
      color="#595959"
      style={{ marginHorizontal: 10 }}
    />
    <Pressable onPress={() => navigation.navigate("UsersScreen")}>
      <Feather
        name="edit-2"
        size={24}
        color="#595959"
      />
    </Pressable>
  </View>)
}


const ChatRoomHeader = (props: any) => {
  const { width } = useWindowDimensions();
  console.log(props);
  return (<View style={{ flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'space-between', width: width - 75, marginRight: 10 }}>
    <Image
      source={{ uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg" }}
      style={{ width: 30, height: 30, borderRadius: 30, }}
    />
    <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
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
  </View >)
}