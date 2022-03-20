import { StyleSheet, View, FlatList } from 'react-native';
import UserItem from '../components/UserItem';
import { RootTabScreenProps } from '../types';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../src/models';

export default function UsersScreen ({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    DataStore.query(User).then(setUsers);
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
