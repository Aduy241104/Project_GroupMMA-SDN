import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const icons = {
    "Đánh Giá": "star",
    "Yêu Thích": "heart",
    "Xem Nhiều": "stats-chart",
    "Thịnh Hành": "trending-up",
    "Category": "albums",
    "User": "people",
    "Create Story": "chatbubbles",
    "Comments": "person",
};

export default function CategoryButton({ title, onPress }) {
    return (
        <TouchableOpacity style={ styles.button } onPress={ onPress }>
            <Ionicons name={ icons[title] } size={ 20 } color="#6fd4ff" />
            <Text style={ styles.text }>{ title }</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#1a1a1a",
        width: 90,
        height: 70,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    text: {
        color: "#fff",
        marginTop: 5,
        fontSize: 13,
    },
});
