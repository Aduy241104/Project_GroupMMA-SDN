import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const ActionButtons = ({ onLike, onBookmark, onComment, liked, bookmarked }) => {
    return (
        <View style={ styles.container }>
            {/* Nút Like */ }
            <TouchableOpacity
                style={ [styles.btn, liked && styles.activeLike] }
                onPress={ onLike }
                activeOpacity={ 0.7 }
            >
                <MaterialCommunityIcons
                    name={ liked ? "heart" : "heart-outline" }
                    size={ 26 }
                    color={ liked ? "#fff" : "#e74c3c" }
                />
            </TouchableOpacity>

            {/* Nút Bookmark */ }
            <TouchableOpacity
                style={ [styles.btn, bookmarked && styles.activeBookmark] }
                onPress={ onBookmark }
                activeOpacity={ 0.7 }
            >
                <Ionicons
                    name={ bookmarked ? "bookmark" : "bookmark-outline" }
                    size={ 25 }
                    color={ bookmarked ? "#fff" : "#f39c12" }
                />
            </TouchableOpacity>

            {/* Nút Comment */ }
            <TouchableOpacity
                style={ styles.btn }
                onPress={ onComment }
                activeOpacity={ 0.7 }
            >
                <Ionicons name="chatbubble-ellipses-outline" size={ 25 } color="#3498db" />
            </TouchableOpacity>
        </View>
    );
};

export default ActionButtons;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 15,
        gap: 20,
    },
    btn: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    activeLike: {
        backgroundColor: "#e74c3c",
    },
    activeBookmark: {
        backgroundColor: "#f39c12",
    },
});
