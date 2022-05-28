
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import GroupInfoScreen from '../screens/GroupInfoScreen';
import HomeScreen from '../screens/HomeScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import UsersScreen from "../screens/UsersScreen";
import { RootStackParamList } from '../types';
import { ChatRoomHeader } from "./ChatRoomHeader";
import { HomeHeader } from "./HomeHeader";
import LinkingConfiguration from './LinkingConfiguration';



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
      <Stack.Screen name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: () => <ChatRoomHeader id={route.params?.id} />,
          title: "Username",
          headerBackTitleVisible: false,
        })} />
      <Stack.Screen name="GroupInfoScreen"
        component={GroupInfoScreen}
      />
      <Stack.Screen name="UsersScreen" component={UsersScreen} options={{
        title: "Users",
      }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
