import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router, Redirect } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useGlobalContext } from '../../context/GlobalProvider';
import { createUser } from '../../lib/handleAuth';

const SignUp = () => {
  const { setUser, setIsLogged, isLogged } = useGlobalContext();

  // Redirect if already logged in
  if (isLogged) {
    return <Redirect href="/home" />;
  }

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [retailCode, setRetailCode] = useState('');
  const [address, setAddress] = useState('');
  const [shopName, setShopName] = useState('');
  const [pincode, setpincode] = useState(''); // New state for pincode

  // Validate password to ensure it's exactly 8 digits
  const validatePassword = (password: string) => {
    const isValidLength = password.length === 8; // Check if password is exactly 8 digits

    if (!isValidLength || isNaN(Number(password))) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be exactly 8 digits long',
      });
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    // Validate all fields
    if (
      name === '' ||
      phone === '' ||
      email === '' ||
      password === '' ||
      
      address === '' ||
      shopName === '' ||
      pincode === '' // Validate pincode
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      return;
    }

    try {
      // Create user with all fields
      const result = await createUser({
        email,
        password,
        name,
        phone,
        retailCode,
        address,
        shopName,
        pincode, // Include pincode
      });
      setUser(result);
      setIsLogged(true);

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User signed up successfully',
      });

      // Redirect to home screen
      router.replace('/home');
    } catch (error) {
      // Show error toast
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center"
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 py-8 flex-1 justify-center">
            {/* Header */}
            <Text className="text-3xl font-bold mb-8 text-center text-gray-800">
              Create Account
            </Text>

            {/* Form Container */}
            <View className="space-y-4">
              {/* Name Input */}
              <View>
                <Text className="text-sm font-medium mb-1 text-gray-700">Full Name</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Phone Input */}
              <View>
                <Text className="text-sm font-medium mb-1 text-gray-700">Phone Number</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-sm font-medium mb-1 text-gray-700">Email Address</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-sm font-medium mb-1 text-gray-700">Password</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  placeholder="Enter your password (exactly 8 digits)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={8} // Restrict to 8 digits
                />
              </View>

              {/* Retail Code Input */}
              {/* <View>
                <Text className="text-sm font-medium mb-1 text-gray-700">Retail Code</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  placeholder="Enter your retail code"
                  value={retailCode}
                  onChangeText={setRetailCode}
                  keyboardType="numeric"
                />
              </View> */}

              {/* Address Input */}
              <View>
                <Text className="text-sm font-medium mb-1 text-gray-700">Address</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  placeholder="Enter your address"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              {/* Shop Name Input */}
              <View>
                <Text className="text-sm font-medium mb-1 text-gray-700">Shop Name</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChangeText={setShopName}
                />
              </View>

              {/* Carrier Pin Code Input */}
              <View>
                <Text className="text-sm font-medium mb-1 text-gray-700">Carrier Pin Code</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
                  placeholder="Enter your carrier pin code"
                  value={pincode}
                  onChangeText={setpincode}
                  keyboardType="numeric"
                />
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                className="w-full bg-blue-500 py-4 rounded-lg mt-6"
                onPress={handleSignup}
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-semibold text-base">
                  Sign Up
                </Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View className="flex-row justify-center mt-4">
                <Text className="text-gray-600">Already have an account? </Text>
                <Link href="/(auth)/sign-in">
                  <Text className="text-blue-500 font-semibold">Log In</Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Toast Component */}
      <Toast />
    </SafeAreaView>
  );
};

export default SignUp;