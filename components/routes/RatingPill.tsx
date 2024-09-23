import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'react-native';

interface RatingPillProps {
	number: number;
	additionalStyle?: ViewStyle;
}
export default function RatingPill({
	number,
	additionalStyle,
}: RatingPillProps) {
	return (
		<View style={[styles.mediaPillRatingContainer, additionalStyle]}>
			<Text style={styles.mediaPillRatingText}>
				{`${number.toFixed(1) || '0'} `}
			</Text>
			<View>
				<Image
					source={require('@/assets/images/place_detail_media_rating_star.png')}
					style={styles.mediaPillRatingImage}
					resizeMode="contain"
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mediaPillRatingContainer: {
		height: 20,
		width: 30,
		backgroundColor: '#3F713B',
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
	},
	mediaPillRatingText: {
		fontSize: 8,
		color: 'white',
		fontFamily: 'Montserrat-Regular',
	},
	mediaPillRatingImage: { width: 8, height: 8 },
});
