import { Stack } from 'expo-router';

export default function MapNavigator() {
	return (
		<Stack
			screenOptions={{ headerShown: false, statusBarTranslucent: true }}
			initialRouteName="index"
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="qr-scanner" />
			<Stack.Screen name="text-search" options={{ animationDuration: 0 }} />
		</Stack>
	);
}
