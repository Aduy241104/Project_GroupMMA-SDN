import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { HOST } from '@env';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email!');
      return;
    }

    try {
      const response = await fetch(`${HOST}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', data.message || 'Mã OTP đã được gửi đến email!');
        navigation.navigate('reset-password', { email });
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể gửi OTP!');
      }
    } catch (error) {
      console.error('ERROR forgot password: ', error);
      Alert.alert('Lỗi', 'Không thể kết nối server!');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Quên Mật Khẩu</Text>
        <Text style={styles.subtitle}>Nhập email để nhận mã OTP khôi phục</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Gửi OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Quay lại đăng nhập</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
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

export default ForgotPasswordScreen;
