import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import UserItem from '../components/UserItem';
import { User } from '../src/models';
import { RootTabScreenProps } from '../types';

export default function UsersScreen ({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const fetchedUsers = (await DataStore.query(User)).filter(user => user.id !== authUser.attributes.sub)
      setUsers(fetchedUsers)
    })();

  }, [])
  return (
    <View style={styles.page}>
      <FlatList
        data={users}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <UserItem user={{ ...item }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {}
});
