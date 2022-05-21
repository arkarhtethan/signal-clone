import { Amplify, Auth, DataStore, Hub } from "aws-amplify";
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import awsconfig from './aws-exports';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { Message, User } from "./src/models";

Amplify.configure(awsconfig)

function App () {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, [])

  const fetchUser = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const user = await DataStore.query(User, userData.attributes.sub);
    if (user) {
      setUser(user)
    }
  }

  useEffect(() => {
    if (!user) return;
    const subscription = DataStore.observe(User, user.id).subscribe((msg) => {
      if (msg.model === User && msg.opType === "UPDATE") {
        setUser((curUser: any) => ({ ...curUser, ...msg.element, }))
      }
    })
    return () => subscription.unsubscribe();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      updateLastOnline();
    }, 1 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user])


  const updateLastOnline = async () => {
    if (!user) return;
    await DataStore.save(User.copyOf(user, updated => { updated.lastOnlineAt = +(new Date()) }))
  }


  useEffect(() => {
    const listener = Hub.listen('datastore', async hubData => {
      const { event, data } = hubData.payload;
      if (event === "networkStatus") {
        console.log(`User has a network connection : ${data.active}`)
      }
      if (event === "outboxMutationProcessed" &&
        data.model === Message &&
        !(["DELIVERED", "READ"].includes(data.element.status))) {
        DataStore.save(Message.copyOf(data.element, (updated) => {
          updated.status = "DELIVERED"
        }))
      }
    })
    return () => listener();
  }, [])


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}


export default withAuthenticator(App)