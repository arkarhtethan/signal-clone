import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import styles from './styles'
import { useNavigation } from '@react-navigation/native';

const UserItem = ({ user }: any) => {
    const navigation = useNavigation();
    const onPress = () => {
        // navigation.navigate("ChatRoom", { id: chatRoom.id })
    }
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image source={{ uri: user.imageUri }} style={styles.image} />

            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{user.name}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default UserItem
