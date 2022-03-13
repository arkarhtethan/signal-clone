import { StyleSheet, View, FlatList } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem/ChatRoomItem';
import { RootTabScreenProps } from '../types';
import ChatRoomsData from "../assets/dummy-data/ChatRooms";

const chat = ChatRoomsData[0];
const chat1 = ChatRoomsData[2];

export default function TabOneScreen ({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.page}>
      <FlatList
        data={ChatRoomsData}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        data={ChatRoomsData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        ListHeaderComponent={() => (<FlatList
          data={ChatRoomsData}
          renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {}
});
