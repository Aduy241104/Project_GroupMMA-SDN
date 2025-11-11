//List user
import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,View
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../config/axiosConfig";
import { AuthContext } from "../context/AuthContext";

const ListUserScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await api.get("/api/auth/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch users error:", error);
      Alert.alert("Lỗi", error?.message || "Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers])
  );

  const handleDelete = (id) => {
    Alert.alert("Xóa người dùng", "Bạn có chắc chắn muốn xóa người dùng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/auth/users/${id}`);
            Alert.alert("Thành công", "Đã xóa người dùng.");
            fetchUsers(true);
          } catch (error) {
            console.error("Delete user error:", error);
            Alert.alert("Lỗi", error?.message || "Không thể xóa người dùng.");
          }
        }
      }
    ]);
  };

  const handleToggleActive = async (item) => {
    // Kiểm tra xem có phải chính admin đang đăng nhập không
    const currentUserId = user?.id || user?._id;
    const itemUserId = item._id || item.id;
    
    if (currentUserId && currentUserId.toString() === itemUserId.toString()) {
      Alert.alert("Thông báo", "Bạn không thể block/unblock chính tài khoản của mình.");
      return;
    }

    try {
      const path = item.isActive
        ? `/api/auth/users/${item._id}/block`
        : `/api/auth/users/${item._id}/unblock`;
      await api.patch(path);
      Alert.alert("Thành công", item.isActive ? "Đã khóa người dùng." : "Đã mở khóa người dùng.");
      fetchUsers(true);
    } catch (error) {
      console.error("Toggle active error:", error);
      Alert.alert("Lỗi", error?.message || "Không thể cập nhật trạng thái người dùng.");
    }
  };

  const renderUserItem = ({ item }) => {
    // Kiểm tra xem có phải chính admin đang đăng nhập không
    const currentUserId = user?.id || user?._id;
    const itemUserId = item._id || item.id;
    const isCurrentUser = currentUserId && currentUserId.toString() === itemUserId.toString();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <View style={[styles.statusBadge, item.isActive ? styles.badgeActive : styles.badgeBlocked]}>
            <Text style={styles.statusText}>{item.isActive ? "Active" : "Blocked"}</Text>
          </View>
        </View>
        <Text style={styles.textMuted}>{item.email}</Text>
        <Text style={styles.textMuted}>Role: {item.role}</Text>
        {item.bio ? <Text style={styles.bioText}>{item.bio}</Text> : null}
        {isCurrentUser && (
          <Text style={styles.currentUserText}>Đây là tài khoản của bạn</Text>
        )}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate("EditUser", { userId: item._id })}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item._id)}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              item.isActive ? styles.blockButton : styles.unblockButton,
              isCurrentUser && styles.disabledButton
            ]}
            onPress={() => handleToggleActive(item)}
            disabled={isCurrentUser}
          >
            <Ionicons
              name={item.isActive ? "lock-closed-outline" : "lock-open-outline"}
              size={16}
              color={isCurrentUser ? "#666" : "#fff"}
            />
            <Text style={[styles.actionText, isCurrentUser && styles.disabledText]}>
              {item.isActive ? "Block" : "Unblock"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!user || user.role !== "admin") {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Bạn không có quyền truy cập trang này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý người dùng</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddUser")}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#07c3e9ff" size="large" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
          contentContainerStyle={users.length === 0 ? styles.emptyList : undefined}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchUsers(true)}
              tintColor="#07c3e9ff"
              colors={["#07c3e9ff"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có người dùng nào.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 24
  },
  centered: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700"
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a73e8",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600"
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4
  },
  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeActive: {
    backgroundColor: "rgba(39, 174, 96, 0.2)",
    borderWidth: 1,
    borderColor: "#27ae60"
  },
  badgeBlocked: {
    backgroundColor: "rgba(231, 76, 60, 0.2)",
    borderWidth: 1,
    borderColor: "#e74c3c"
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  textMuted: {
    color: "#bbb",
    fontSize: 14
  },
  bioText: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 6
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4
  },
  editButton: {
    backgroundColor: "#34495e"
  },
  deleteButton: {
    backgroundColor: "#c0392b"
  },
  blockButton: {
    backgroundColor: "#8e44ad"
  },
  unblockButton: {
    backgroundColor: "#27ae60"
  },
  actionText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 13
  },
  emptyList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    color: "#777",
    fontSize: 15
  },
  currentUserText: {
    color: "#07c3e9ff",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4
  },
  disabledButton: {
    backgroundColor: "#333",
    opacity: 0.5
  },
  disabledText: {
    color: "#666"
  }
});

export default ListUserScreen;

