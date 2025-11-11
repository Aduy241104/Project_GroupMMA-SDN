import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

function MenuScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogin = () => {
    navigation.navigate("login");
  };

  const handleManageProfile = () => {
    navigation.navigate("profile");
  };

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout(); // ✅ gọi hàm từ AuthContext
          Alert.alert("Thành công", "Bạn đã đăng xuất.");
        },
      },
    ]);
  };


  const handleViewHistory = () => {
    if (!user) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để xem lịch sử");
      return;
    }
    navigation.navigate("history")
  }

  const renderMenuItem = (icon, text, onPress) => (
    <TouchableOpacity style={ styles.menuItem } onPress={ onPress }>
      <View style={ styles.iconText }>
        <Icon name={ icon } size={ 20 } color="#4da6ff" style={ { width: 25 } } />
        <Text style={ styles.menuText }>{ text }</Text>
      </View>
      <Icon name="chevron-forward" size={ 20 } color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={ styles.container }>
      <Text style={ styles.title }>Menu</Text>

      <View style={ styles.profileSection }>
        { user ? (
          <>
            <TouchableOpacity onPress={ handleManageProfile }>
              <View style={ styles.profileRow }>
                <View style={ styles.avatar }>
                  <Image
                    source={ {
                      uri:
                        user.avatarUrl ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    } }
                    style={ styles.avatarImage } // ✅ Thêm dòng này
                  />
                </View>
                <View>
                  <Text style={ styles.username }>{ user.username }</Text>
                  <Text style={ styles.subText }>
                    TYT - Truyện Online, Offline
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={ { width: 80 } } onPress={ handleLogout }>
              <Text style={ styles.logoutText }>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={ styles.loginButton } onPress={ handleLogin }>
            <Text style={ styles.loginText }>Đăng nhập</Text>
          </TouchableOpacity>
        ) }
      </View>

      {/* Lịch sử trên tài khoản */ }
      <Text style={ styles.sectionTitle }>LỊCH SỬ TRÊN TÀI KHOẢN</Text>
      { renderMenuItem("time-outline", "Truyện đã xem", handleViewHistory) }
      { renderMenuItem("heart-outline", "Truyện đã thích") }
      { renderMenuItem("download-outline", "Truyện đã tải") }
      { renderMenuItem("add-circle-outline", "Truyện đã theo dõi",) }
      { renderMenuItem("person-add-outline", "Người đang theo dõi") }

      {/* Thông báo */ }
      <Text style={ styles.sectionTitle }>THÔNG BÁO</Text>
      { renderMenuItem("notifications-outline", "Thông báo của tôi") }


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // nền đen
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "600",
  },
  avatarImage: {  // ✅ Thêm style mới này
    width: 50,
    height: 50,
  },
  profileSection: {
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    overflow: "hidden",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subText: {
    color: "#aaa",
    fontSize: 13,
  },
  logoutText: {
    color: "#ff4d4d",
    fontSize: 14,
    marginTop: 5,
    width: 80,
  },
  loginButton: {
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  sectionTitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 15,
    marginBottom: 5,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#222",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    color: "#fff",
    fontSize: 15,
  },
});

export default MenuScreen;
