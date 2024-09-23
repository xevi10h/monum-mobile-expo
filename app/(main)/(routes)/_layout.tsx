import { Stack } from 'expo-router';

export default function RoutesNavigator() {
	return (
		<Stack screenOptions={{ headerShown: false, statusBarTranslucent: true }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="list-routes-by-city" />
			<Stack.Screen name="route-detail" />
		</Stack>
	);
}
