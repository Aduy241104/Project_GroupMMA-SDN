import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { HOST } from '@env';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const response = await fetch(`${HOST}/api/auth/register`, { // Thay bằng URL API thực tế
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', data.message || 'Đăng ký thành công! Kiểm tra email để xác thực OTP.');
        // Navigate đến màn hình verify OTP hoặc login
        navigation.navigate('VerifyOTP', { email }); // Giả sử có màn hình VerifyOTP
      } else {
        Alert.alert('Lỗi', data.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      console.error('ERROR register: ', error);
      Alert.alert('Lỗi', 'Lỗi kết nối server!');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Đăng Ký Tài Khoản</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập ngay!</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Nền đen
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // Chữ trắng
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#333', // Input nền xám đen
    color: '#fff', // Chữ trắng
    borderWidth: 1,
    borderColor: '#555', // Viền xám
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1a73e8', // Nút nền đen đậm
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff', // Chữ trắng
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#1a73e8', // Chữ xám nhạt
    textAlign: 'center',
    fontSize: 16,
  },
});

export default RegisterScreen;