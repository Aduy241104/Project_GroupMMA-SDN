import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { HOST } from '@env';
import { AuthContext } from '../context/AuthContext';

const ChangePasswordScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const response = await fetch(`${HOST}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // dùng token từ context
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = response.json();

      console.log(data);

      if (response.ok) {
        Alert.alert('Thành công', data.message || 'Đổi mật khẩu thành công!');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', data.message || 'Đổi mật khẩu thất bại!');
      }
    } catch (error) {
      console.error('ERROR change password: ', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server!');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Đổi Mật Khẩu</Text>

        <TextInput style={styles.input} placeholder="Mật khẩu cũ" placeholderTextColor="#aaa" value={oldPassword} onChangeText={setOldPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Mật khẩu mới" placeholderTextColor="#aaa" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Xác nhận mật khẩu mới" placeholderTextColor="#aaa" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Cập Nhật</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#1a73e8',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ChangePasswordScreen;
