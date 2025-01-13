import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useMainStore } from '@/zustand/MainStore';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
	const isGeneralLoading = useMainStore((state) => state.main.isGeneralLoading);

	return (
		<>
			{isGeneralLoading && (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: 9999,
						backgroundColor: 'rgba(0,0,0,0.5)',
					}}
				>
					<ActivityIndicator size="large" color="white" />
				</View>
			)}
			<StatusBar translucent backgroundColor="transparent" style="light" />
			<Stack
				screenOptions={{
					headerShown: false,
					statusBarTranslucent: true,
				}}
				initialRouteName="index"
			>
				<Stack.Screen name="index" />
				<Stack.Screen name="register" />
				<Stack.Screen name="login-with-credentials" />
				<Stack.Screen name="password-recovery" />
				<Stack.Screen name="code-verification" />
				<Stack.Screen name="new-password" />
				<Stack.Screen name="password-changed" />
			</Stack>
		</>
	);
}
