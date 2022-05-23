import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from './styles';

const UserItem = ({ user, onPress, isSelected }: any) => {

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image source={{ uri: user.imageUri }} style={styles.image} />
            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{user.name}</Text>
                </View>
            </View>
            {isSelected !== undefined && <Feather name={isSelected ? "check-circle" : "circle"} size={20} color="#4f4f4f" />}
        </Pressable>
    )
}

export default UserItem
