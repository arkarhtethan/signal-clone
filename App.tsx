import { Amplify, DataStore, Hub } from "aws-amplify";
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react";
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import awsconfig from './aws-exports';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { Message } from "./src/models";

Amplify.configure(awsconfig)

function App () {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

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