import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DetailCityPillProps {
	cityName: string;
	onPress: () => void;
	imageUrl: string;
}

export default function DetailCityPill({
	cityName,
	imageUrl,
	onPress,
}: DetailCityPillProps) {
	return (
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
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<TouchableOpacity onPress={onPress}>
					<Image
						source={require('@/assets/images/list_routes_go_back.png')}
						style={{ width: 8, height: 14, marginHorizontal: 18 }}
					/>
				</TouchableOpacity>
				<Text style={styles.cityName}>{cityName}</Text>
			</View>
		</View>
	);
}

const BORDER_RADIUS = 12;

const styles = StyleSheet.create({
	container: {
		borderTopLeftRadius: BORDER_RADIUS,
		borderTopRightRadius: BORDER_RADIUS,
		height: 160,
		paddingVertical: 20,
		justifyContent: 'flex-start',
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		marginTop: 20,
	},
	image: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderTopLeftRadius: BORDER_RADIUS,
		borderTopRightRadius: BORDER_RADIUS,
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
		borderTopLeftRadius: BORDER_RADIUS,
		borderTopRightRadius: BORDER_RADIUS,
	},
});
