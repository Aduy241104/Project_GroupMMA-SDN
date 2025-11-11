import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from "react-native";
import api from "../config/axiosConfig";
import { AuthContext } from "../context/AuthContext";

export default function CommentScreen({ route }) {
    const { storyId } = route.params;
    const { token, user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/api/comments/story/${storyId}`);
                console.log("Comments fetched:", res); // đây mới là mảng comment
                setComments(res || []);

            } catch (err) {
                console.error("Lỗi khi lấy comment:", err);
            }
        };
        fetchComments();
    }, [storyId]);


    const handleAddComment = async () => {
        if (!content.trim()) return;

        try {
            const newComment = await api.post(
                "/api/comments",
                { storyId, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Gắn thêm username và _id user từ AuthContext
            const commentWithUser = {
                ...newComment,
                userId: {
                    _id: user._id,
                    username: user.username,
                },
            };

            setComments((prev) => [commentWithUser, ...prev]);
            setContent("");
        } catch (err) {
            console.error("Lỗi khi thêm comment:", err);
        }
    };


    const handleDeleteComment = (commentId) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn xóa comment này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/api/comments/${commentId}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            setComments((prev) => prev.filter((c) => c._id !== commentId));
                        } catch (err) {
                            console.error("Lỗi khi xóa comment:", err);
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };


    const handleEditComment = (comment) => {
        setEditingComment(comment);      // lưu comment đang chỉnh sửa
        setEditText(comment.content);    // lấy nội dung cũ
        setEditModalVisible(true);       // mở modal
    };

    // Lưu khi nhấn Lưu trong modal
    const saveEditComment = async () => {
        if (!editText.trim()) return;

        try {
            const updatedComment = await api.put(
                "/api/comments",
                { commentId: editingComment._id, content: editText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

              updatedComment.userId = editingComment.userId;

            // Cập nhật state
            setComments((prev) =>
                prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
            );

            setEditModalVisible(false);  // đóng modal
            setEditingComment(null);
        } catch (err) {
            console.error("Lỗi khi sửa comment:", err);
        }
    };



    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.commentBox}>
                        <View style={styles.commentContent}>
                            <Text style={styles.username}>{item.userId?.username || "Người dùng"}</Text>
                            <Text style={styles.content}>{item.content}</Text>
                            <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
                        </View>

                        {/* Nút Edit/Delete chỉ hiện nếu là comment của user */}
                        {item.userId?._id === user?._id && (
                            <View style={styles.commentActions}>
                                <TouchableOpacity onPress={() => handleEditComment(item)} style={styles.actionBtn}>
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteComment(item._id)} style={styles.actionBtn}>
                                    <Text style={[styles.actionText, { color: "red" }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
                contentContainerStyle={{ paddingVertical: 10 }}
            />
            <Modal visible={editModalVisible} transparent animationType="fade">
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#00000088"
                }}>
                    <View style={{ width: "80%", backgroundColor: "#111", padding: 20, borderRadius: 10 }}>
                        <Text style={{ color: "#fff", marginBottom: 10 }}>Chỉnh sửa bình luận</Text>
                        <TextInput
                            value={editText}
                            onChangeText={setEditText}
                            style={{ backgroundColor: "#222", color: "#fff", padding: 10, borderRadius: 8 }}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginRight: 10 }}>
                                <Text style={{ color: "#aaa" }}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveEditComment}>
                                <Text style={{ color: "#4da6ff" }}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {token && (
                <View style={styles.inputRow}>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="Viết bình luận..."
                        placeholderTextColor="#aaa"
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={handleAddComment} style={styles.sendBtn}>
                        <Text style={{ color: "#fff", fontSize: 16 }}>Gửi</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20, paddingTop: 10 },

    commentBox: {
        backgroundColor: "#111",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        position: "relative", // để nút absolute bên trong
    },
    commentContent: {
        paddingRight: 100, // để nút Edit/Delete không che nội dung
    },
    commentActions: {
        position: "absolute",
        right: 10,
        bottom: 10,
        flexDirection: "row",
        gap: 10,
    },
    username: { color: "#4da6ff", fontWeight: "bold", fontSize: 18, marginBottom: 5 },
    content: { color: "#fff", fontSize: 16 },
    time: { color: "#888", fontSize: 12, marginTop: 5 },

    actionBtn: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "#222",
        borderRadius: 6,
    },
    actionText: { color: "#fff", fontSize: 12 },

    inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    input: {
        flex: 1,
        backgroundColor: "#111",
        color: "#fff",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 16,
    },
    sendBtn: {
        marginLeft: 10,
        backgroundColor: "#3498db",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
});