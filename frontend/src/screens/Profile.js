import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOST } from '@env';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy profile
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập!');
        navigation.navigate('Login');
        return;
      }


      const response = await fetch(`${HOST}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể tải thông tin profile');
      }
    } catch (error) {
      console.error('ERROR fetch profile: ', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={ styles.loadingContainer }>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={ { color: '#ccc', marginTop: 10 } }>Đang tải profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={ styles.container }>
        <Text style={ styles.errorText }>Không có dữ liệu người dùng!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={ styles.container } contentContainerStyle={ { alignItems: 'center', paddingVertical: 40 } }>
      <Image
        source={ { uri: user.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' } }
        style={ styles.avatar }
      />
      <Text style={ styles.username }>{ user.username }</Text>
      <Text style={ styles.email }>{ user.email }</Text>

      <View style={ styles.infoContainer }>
        <Text style={ styles.label }>Vai trò:</Text>
        <Text style={ styles.value }>{ user.role || 'user' }</Text>
      </View>

      <View style={ styles.infoContainer }>
        <Text style={ styles.label }>Trạng thái:</Text>
        <Text style={ [styles.value, { color: user.isActive ? '#0f0' : '#f00' }] }>
          { user.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt' }
        </Text>
      </View>

      <View style={ styles.infoContainer }>
        <Text style={ styles.label }>Giới thiệu:</Text>
        <Text style={ styles.value }>{ user.bio || 'Chưa có bio' }</Text>
      </View>

      <TouchableOpacity
        style={ styles.buttonChangePassword }
        onPress={ () => navigation.navigate('change-password', { user }) }
      >
        <Text style={ styles.buttonText }>Đổi mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={ styles.button }
        onPress={ () => navigation.navigate('update-profile', { user }) }
      >
        <Text style={ styles.buttonText }>Chỉnh sửa hồ sơ</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#1a73e8',
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonChangePassword: {
    backgroundColor: '#c3c60eff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f00',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});

export default ProfileScreen;