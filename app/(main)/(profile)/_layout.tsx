import { Stack } from 'expo-router';

export default function ProfileNavigator() {
	return (
		<Stack screenOptions={{ headerShown: false, statusBarTranslucent: true }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="profile-change-password" />
		</Stack>
	);
}
