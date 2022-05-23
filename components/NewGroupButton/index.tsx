import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const NewGroupButton = ({ onPress }: any) => {
    return (
        <Pressable onPress={onPress}>
            <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                <FontAwesome name="group" size={24} color="#4f4f4f" />
                <Text style={{ marginLeft: 10, fontWeight: "bold" }}>New Group</Text>
            </View>
        </Pressable>
    )
}

export default NewGroupButton

const styles = StyleSheet.create({})