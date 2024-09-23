import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
	return (
		<>
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
