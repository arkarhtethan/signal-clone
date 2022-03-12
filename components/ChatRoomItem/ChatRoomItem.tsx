import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import styles from './styles'

const ChatRoomItem = () => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png" }} style={styles.image} />
            <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>2</Text>
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>Elon Musk</Text>
                    <Text style={styles.text}>11:11 AM</Text>
                </View>
                <Text numberOfLines={1} style={styles.text}>Hola lorem Hola coca cola vHola lorem Hola coca colaHola lorem Hola coca colaHola lorem Hola coca cola</Text>
            </View>
        </View>
    )
}

export default ChatRoomItem
