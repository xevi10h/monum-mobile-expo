import { Image, StyleSheet, TouchableOpacity } from 'react-native';

interface CenterStopsButtonProps {
	onPress: () => void;
}

export default function CenterStopsButton({ onPress }: CenterStopsButtonProps) {
	return (
		<TouchableOpacity
			style={[styles.centerStopsContainer, { bottom: 70 }]}
			onPress={onPress}
		>
			<Image
				source={require('@/assets/images/map_center_stops.png')}
				style={styles.centerStopsIcon}
				resizeMode="contain"
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	centerStopsContainer: {
		position: 'absolute',
		backgroundColor: 'white',
		width: 40,
		height: 40,
		borderRadius: 10,
		right: 15,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
	},
	centerStopsIcon: {
		width: 28,
		height: 28,
	},
});
