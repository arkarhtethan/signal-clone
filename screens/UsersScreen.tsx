import { StyleSheet, View, FlatList } from 'react-native';
import UserItem from '../components/UserItem';
import { RootTabScreenProps } from '../types';
import Users from "../assets/dummy-data/Users";

export default function UsersScreen ({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.page}>
      <FlatList
        data={Users}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <UserItem user={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {}
});
