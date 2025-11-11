import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { HOST } from '@env';

const VerifyOTPScreen = ({ route, navigation }) => {
  const { email } = route.params; // Lấy email từ màn hình đăng ký
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP!');
      return;
    }
console.log("EMAIL: ", email);
console.log("EMAIL: ", email);

    try {
      const response = await fetch(`${HOST}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: otp }),
      });

      const data = response.json();

      if (response.ok) {
        Alert.alert('Thành công', data.message || 'Xác thực OTP thành công!');
        navigation.navigate('login');
      } else {
        Alert.alert('Lỗi', data.message || 'Mã OTP không chính xác hoặc đã hết hạn!');
      }
    } catch (error) {
      console.error('ERROR verify OTP: ', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server!');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Xác Thực OTP</Text>
        <Text style={styles.subtitle}>Vui lòng nhập mã OTP đã gửi tới email:</Text>
        <Text style={styles.email}>{email}</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập mã OTP"
          placeholderTextColor="#aaa"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Xác Thực</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('login')}>
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
  },
  email: {
    fontSize: 16,
    color: '#1a73e8',
    textAlign: 'center',
    marginBottom: 30,
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
    textAlign: 'center',
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

export default VerifyOTPScreen;
