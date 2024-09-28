import { Stack } from 'expo-router';

export default function RoutesNavigator() {
	return (
		<Stack
			screenOptions={{ headerShown: false, statusBarTranslucent: true }}
			initialRouteName="index"
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="[cityId]/index" />
			<Stack.Screen name="[cityId]/[routeId]" />
		</Stack>
	);
}
