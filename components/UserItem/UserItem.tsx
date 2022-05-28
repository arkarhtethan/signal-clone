import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from './styles';

const UserItem = ({ user, onPress, onLongPress, isSelected, isAdmin = false }: any) => {

    return (
        <Pressable onLongPress={onLongPress} onPress={onPress} style={styles.container}>
            <Image source={{ uri: user.imageUri }} style={styles.image} />
            <View style={styles.rightContainer}>
                <Text style={styles.name}>{user.name}</Text>
                {isAdmin && <Text>admin</Text>}
            </View>
            {isSelected !== undefined && <Feather name={isSelected ? "check-circle" : "circle"} size={20} color="#4f4f4f" />}
        </Pressable>
    )
}

export default UserItem
