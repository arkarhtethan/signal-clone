import { Feather } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const AudioPlayer = ({ soundURI }: any) => {

    const [paused, setPaused] = useState<boolean>(true);
    const [audioProgress, setAudioProgress] = useState(0);
    const [sound, setSound] = useState<Audio.Sound | null>();

    useEffect(() => {
        (async () => {
            if (!soundURI) return;
            const { sound } = await Audio.Sound.createAsync({ uri: soundURI }, {}, onPlaybackStatusUpdate);
            setSound(sound)
        })();
        return () => {
            if (sound) sound.unloadAsync();
        }
    }, [soundURI])


    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            return;
        }
        setAudioProgress(status.positionMillis / (status.durationMillis || 1))
        setPaused(!status.isPlaying)
    }

    const playPauseSound = async () => {
        if (!sound) return;
        if (paused) {
            await sound?.playFromPositionAsync(0);
        } else {
            await sound?.pauseAsync();
        }
    }
    return (
        <View style={[styles.sendAudioContainer]}>
            <Pressable onPress={playPauseSound}>
                <Feather name={paused ? "play" : "pause"} size={24} color="gray" />
            </Pressable>
            <View style={styles.audioProgressBG}>
                <View style={[styles.audioProgressFG, { left: `${audioProgress * 100}%` }]} />
            </View>
        </View>
    )
}

export default AudioPlayer


const styles = StyleSheet.create({

    sendAudioContainer: {
        flexDirection: "row",
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "lightgray",
        backgroundColor: "#fff"
    },
    audioProgressBG: {
        height: 3,
        flex: 1,
        backgroundColor: "lightgray"
        , borderRadius: 5, margin: 10,
    },
    audioProgressFG: {
        width: 10,
        height: 10,
        backgroundColor: "#3777f0",
        borderRadius: 10,
        position: "absolute",
        top: -5,
        left: "50%"
    }
})