import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SectionHeader({ title }) {
    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>{ title }</Text>
            <TouchableOpacity>
                <Text style={ styles.link }>Xem Thêm ›</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    link: { color: "#3fa7ff", fontSize: 14 },
});
