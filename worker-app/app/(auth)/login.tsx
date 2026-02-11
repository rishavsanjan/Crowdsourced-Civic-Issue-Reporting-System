import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

export default function WorkerLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login pressed');
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="dark-content" />
      
      {/* iOS Phone Container */}
      <View className="flex-1 max-w-[390px] w-full self-center bg-white dark:bg-slate-900 shadow-2xl rounded-[48px] overflow-hidden border-8 border-slate-200 dark:border-slate-800 my-4">
        
        {/* Status Bar Simulator */}
        <View className="h-12 w-full flex-row justify-between items-center px-8 pt-4">
          <Text className="text-sm font-semibold dark:text-white">9:41</Text>
          <View className="flex-row gap-1.5 items-center">
            <Icon name="cellular" size={16} color="#000000" />
            <Icon name="wifi" size={16} color="#000000" />
            <Icon name="battery-full" size={18} color="#000000" />
          </View>
        </View>

        <ScrollView 
          className="flex-1 px-8 pt-12"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Branding/Icon Section */}
          <View className="mb-10 flex flex-col items-center">
            <View className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Icon name="construct" size={36} color="#136dec" />
            </View>
            <Text className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Worker Portal
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 mt-2 text-sm text-center">
              Enter your credentials to access your assignments.
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-5">
            {/* Identity Input */}
            <View className="mb-5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 mb-1.5">
                Mobile or Email
              </Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Icon name="person-outline" size={20} color="#94a3b8" />
                </View>
                <TextInput
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white text-base"
                  placeholder="e.g., +1 555-0123"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 mb-1.5">
                Password
              </Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Icon name="lock-open-outline" size={20} color="#94a3b8" />
                </View>
                <TextInput
                  className="w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white text-base"
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#94a3b8" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot */}
            <View className="flex-row items-center justify-between pt-1 mb-5">
              <View className="flex-row items-center space-x-2">
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  trackColor={{ false: '#e2e8f0', true: '#136dec' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#e2e8f0"
                />
                <Text className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                  Remember Me
                </Text>
              </View>
              <TouchableOpacity>
                <Text className="text-sm font-medium text-primary">Forgot?</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="w-full bg-primary hover:bg-blue-600 py-4 rounded-xl shadow-lg flex-row items-center justify-center space-x-2 mt-4 active:scale-95"
              onPress={handleLogin}
              activeOpacity={0.9}
            >
              <Text className="text-white font-bold text-base">Login</Text>
              <Icon name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <View className="mt-auto pb-10 flex flex-col items-center space-y-6">
            <View className="flex-row items-center space-x-2 mt-6">
              <Text className="text-slate-500 dark:text-slate-400 text-sm">
                New worker?
              </Text>
              <TouchableOpacity>
                <Text className="text-primary font-bold text-sm ml-2">Request Access</Text>
              </TouchableOpacity>
            </View>

            <View className="pt-8 border-t border-slate-100 dark:border-slate-800 w-full flex items-center">
              <TouchableOpacity className="flex-row items-center space-x-1">
                <Icon name="help-circle-outline" size={16} color="#94a3b8" />
                <Text className="text-xs text-slate-400 ml-1">Contact Support</Text>
              </TouchableOpacity>
            </View>

            {/* iOS Home Indicator */}
            <View className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mt-4" />
          </View>
        </ScrollView>

        {/* Decorative Background Elements */}
        <View className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full opacity-50" 
          style={{ position: 'absolute' }} 
        />
        <View className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full opacity-50" 
          style={{ position: 'absolute' }} 
        />
      </View>
    </View>
  );
}