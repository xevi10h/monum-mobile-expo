import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

interface ListCityPillProps {
	cityName: string;
	onPress: () => void;
	imageUrl: string;
}

export default function ListCityPill({
	cityName,
	onPress,
	imageUrl,
}: ListCityPillProps) {
	return (
		<TouchableOpacity onPress={onPress} style={styles.button}>
			<View style={styles.container}>
				<Image
					source={{ uri: `${imageUrl}?auto=compress&fit=crop&h=1200` }}
					style={styles.image}
					resizeMode="cover"
				/>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					colors={['rgba(3, 32, 0, 1)', 'rgba(3, 32, 0, 0)']}
					style={styles.linearGradient}
				/>
				<Text style={styles.cityName}>{cityName}</Text>
			</View>
		</TouchableOpacity>
	);
}

const BORDER_RADIUS = 12;

const styles = StyleSheet.create({
	button: {
		borderRadius: BORDER_RADIUS,
		marginHorizontal: 15,
		marginBottom: 15,
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
	},
	container: {
		borderRadius: BORDER_RADIUS,
		paddingHorizontal: 15,
		height: 60,
		justifyContent: 'center',
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
	image: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: BORDER_RADIUS,
	},
	cityName: {
		color: 'white',
		fontSize: 24,
		fontFamily: 'Montserrat-Regular',
	},
	linearGradient: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: BORDER_RADIUS,
	},
});
